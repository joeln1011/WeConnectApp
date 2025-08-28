import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { socket } from "./SocketProvider";
import {
  useAnswerCallMutation,
  useEndCallMutation,
  useInitiateCallMutation,
} from "@services/videoCallApi";
import { Events } from "@libs/constants";

const VideoCallContext = createContext({});

export const useVideoCallContext = () => {
  return useContext(VideoCallContext);
};

const VideoCallProvider = ({ children }) => {
  const [isInCall, setIsInCall] = useState(false);
  const [inCommingCall, setInCommingCall] = useState(false);
  const [callId, setCallId] = useState(null);
  const [callerInfo, setCallerInfo] = useState(null);

  const pendingSDPOffer = useRef(null);

  const [connection, setConnection] = useState(null);

  const [initialCall] = useInitiateCallMutation();
  const [answerCall] = useAnswerCallMutation();
  const [endCall] = useEndCallMutation();

  const pendingICECandidate = useRef([]);

  const setUpPeerConnection = async ({ remoteUserId, callId }) => {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.relay.metered.ca:80",
          },
          {
            urls: "turn:global.relay.metered.ca:80",
            username: "f8b04b9a70491db1ff9262d6",
            credential: "hdcWNvisgfzx67eM",
          },
          {
            urls: "turn:global.relay.metered.ca:80?transport=tcp",
            username: "f8b04b9a70491db1ff9262d6",
            credential: "hdcWNvisgfzx67eM",
          },
          {
            urls: "turn:global.relay.metered.ca:443",
            username: "f8b04b9a70491db1ff9262d6",
            credential: "hdcWNvisgfzx67eM",
          },
          {
            urls: "turns:global.relay.metered.ca:443?transport=tcp",
            username: "f8b04b9a70491db1ff9262d6",
            credential: "hdcWNvisgfzx67eM",
          },
        ],
      });

      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const remoteStream = new MediaStream();

      pc.ontrack = (event) => {
        console.log("onTrack", event);
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };

      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      pc.onicecandidate = (event) => {
        console.log(event);
        if (event.candidate) {
          socket.emit(Events.ICE_CANDIDATE, {
            targetUserId: remoteUserId,
            candidate: event.candidate,
            callId,
          });
        }
      };

      //Offer from A to Signaling Server and goes down to B
      async function createOffer() {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        return offer;
      }

      //On client A
      async function handleAnswer(anwser) {
        await pc.setRemoteDescription(new RTCSessionDescription(anwser));
        processQueuedCandidates(pc);
      }

      //On client B
      async function handleOffer(offer) {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        processQueuedCandidates(pc);
        return answer;
      }

      const closeConnection = () => {
        localStream.getTracks().forEach((track) => track.stop());
        pc.close;
      };

      function processQueuedCandidates(peerConnection) {
        if (pendingICECandidate.current.length > 0) {
          pendingICECandidate.current.forEach(async (candidate) => {
            await peerConnection.addIceCandidate(
              new RTCIceCandidate(candidate),
            );
          });
        }
        pendingICECandidate.current = [];
      }
      const handleNewCandidate = async (candidate) => {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      };

      return {
        pc,
        createOffer,
        handleAnswer,
        handleOffer,
        handleNewCandidate,
        closeConnection,
        remoteStream,
        localStream,
        processQueuedCandidates,
      };
    } catch (error) {
      console.error("Error setting up peer connection:", error);
    }
  };

  const handleIncomingCall = useCallback((data) => {
    console.log("Incoming call", data);
    setIsInCall(false);
    setInCommingCall(true);
    setCallId(data.callId);
    setCallerInfo(data.caller);
  }, []);

  useEffect(() => {
    if (inCommingCall) {
      acceptCall();
    }
  }, [inCommingCall]);

  useEffect(() => {
    socket.on(Events.INCOMING_CALL, handleIncomingCall);
    socket.on(Events.SDP_OFFER, async (data) => {
      pendingSDPOffer.current = data.sdp;
      //On User B
      // if (!connection || !isInCall) return;

      // const answer = await connection.handleOffer(data.sdp);
      // socket.emit(Events.SDP_ANSWER, {
      //   targetUserId: callerInfo._id,
      //   sdp: answer,
      //   callId,
      // });
    });
    socket.on(Events.SDP_ANSWER, async (data) => {
      if (!connection || !isInCall) return;
      await connection.handleAnswer(data.sdp);
    });
    socket.on(Events.ICE_CANDIDATE, (data) => {
      if (!connection || !isInCall || !connection.pc.remoteDescription) {
        pendingICECandidate.current.push(data.candidate);
        return;
      }

      connection.handleNewCandidate(data.candidate);
    });
    socket.on(Events.CALL_ENDED, cleanupCall);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callId, callerInfo?._id, connection, handleIncomingCall, isInCall]);

  async function startCall(userId) {
    const res = await initialCall(userId);
    const peerConnection = await setUpPeerConnection({
      callId: res.data.callId,
      remoteUserId: userId,
    });

    setIsInCall(true);
    setConnection(peerConnection);
    setCallId(res.data.callId);
    const offer = await peerConnection.createOffer();

    socket.emit(Events.SDP_OFFER, {
      targetUserId: userId,
      sdp: offer,
      callId: res.data.callId,
    });

    return res.data.callId;
  }

 // eslint-disable-next-line react-hooks/exhaustive-deps
  async function acceptCall() {
    if (!inCommingCall) return;

    await answerCall(callId).unwrap();

    const connection = await setUpPeerConnection({
      callId: callId,
      remoteUserId: callerInfo._id,
    });

    if (pendingSDPOffer.current) {
      await connection.handleOffer(pendingSDPOffer);

      const answer = await connection.handleOffer(pendingSDPOffer.current);
      socket.emit(Events.SDP_ANSWER, {
        targetUserId: callerInfo._id,
        sdp: answer,
        callId,
      });
      pendingSDPOffer.current = null;
      connection.processQueuedCandidates(connection.pc);
    }
    setConnection(connection);

    setIsInCall(true);
    setInCommingCall(false);
  }

  async function endCurrentCall() {
    if (!isInCall) return;

    await endCall(callId).unwrap();
    cleanupCall();
  }

  function cleanupCall() {
    if (connection) {
      connection.closeConnection();
    }
    setConnection(null);
    setIsInCall(false);
    setInCommingCall(false);
    setCallId(null);
    setCallerInfo(null);
  }

  return (
    <VideoCallContext.Provider
      value={{
        isInCall,
        setIsInCall,
        startCall,
        localStrea: connection?.localStream,
        remoteStream: connection?.remoteStream,
        endCurrentCall,
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};
export default VideoCallProvider;
