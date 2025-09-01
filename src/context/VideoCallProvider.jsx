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
  useRejectCallMutation,
} from "@services/videoCallApi";
import { Events } from "@libs/constants";
import { useDispatch } from "react-redux";
import { closeDialog, openDialog } from "@redux/slices/dialogSlice";
import { openSnackbar } from "@redux/slices/snackbarSlice";

const VideoCallContext = createContext({});

export const useVideoCallContext = () => {
  return useContext(VideoCallContext);
};

const VideoCallProvider = ({ children }) => {
  const [isInCall, setIsInCall] = useState(false);
  const [inCommingCall, setInCommingCall] = useState(false);
  const [callId, setCallId] = useState(null);
  const [callerInfo, setCallerInfo] = useState(null);

  const dispatch = useDispatch();

  const pendingSDPOffer = useRef(null);

  const [connection, setConnection] = useState(null);

  const [initialCall] = useInitiateCallMutation();
  const [answerCall] = useAnswerCallMutation();
  const [rejectIncomingCall] = useRejectCallMutation();
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

  const cleanupCall = useCallback(() => {
    if (connection) {
      connection.closeConnection();
    }
    setConnection(null);
    setIsInCall(false);
    setInCommingCall(false);
    setCallId(null);
    setCallerInfo(null);
  }, [connection]);

  const endCurrentCall = useCallback(async () => {
    if (!isInCall) return;

    await endCall(callId).unwrap();
    cleanupCall();
  }, [isInCall, endCall, callId, cleanupCall]);

  const handleIncomingCall = useCallback((data) => {
    console.log("Incoming call", data);
    setIsInCall(false);
    setInCommingCall(true);
    setCallId(data.callId);
    setCallerInfo(data.caller);

    dispatch(
      openDialog({
        title: "Incoming Call",
        contentType: "INCOMING_CALL_DIALOG",
        closeActionType: Events.CALL_REJECTED,
      }),
    );
  }, []);

  useEffect(() => {
    socket.on(Events.INCOMING_CALL, handleIncomingCall);
    socket.on(Events.SDP_OFFER, async (data) => {
      pendingSDPOffer.current = data.sdp;
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
    socket.on(Events.CALL_REJECTED, () => {
      cleanupCall();
      dispatch(
        openSnackbar({
          type: "info",
          message: "Your call has been rejected",
        }),
      );
    });
    return () => {
      socket.off(Events.INCOMING_CALL);
      socket.off(Events.SDP_OFFER);
      socket.off(Events.SDP_ANSWER);
      socket.off(Events.ICE_CANDIDATE);
      socket.off(Events.CALL_ENDED);
      socket.off(Events.CALL_REJECTED);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callId, callerInfo?._id, connection, handleIncomingCall, isInCall]);

  useEffect(() => {
    if (isInCall && callId) {
      const handleBeforeUnload = (event) => {
        event.preventDefault();
        endCurrentCall();
      };
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [callId, isInCall, endCurrentCall]);

  async function startCall(userId) {
    try {
      const res = await initialCall(userId);

      if (res.error) {
        dispatch(
          openSnackbar({
            type: "error",
            message: res.error?.data?.message,
          }),
        );
        return;
      }
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
    } catch (err) {
      dispatch(
        openSnackbar({
          type: "error",
          message: err.message,
        }),
      );
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function acceptCall() {
    if (!inCommingCall) return;
    try {
      await answerCall(callId).unwrap();
      const connection = await setUpPeerConnection({
        callId: callId,
        remoteUserId: callerInfo._id,
      });

      setConnection(connection);
      setIsInCall(true);
      setInCommingCall(false);

      if (pendingSDPOffer.current) {
        const answer = await connection.handleOffer(pendingSDPOffer.current);
        socket.emit(Events.SDP_ANSWER, {
          targetUserId: callerInfo._id,
          sdp: answer,
          callId,
        });
        pendingSDPOffer.current = null;
      }
      dispatch(closeDialog());
    } catch (err) {
      console.error(err);
    }
  }
  async function rejectCall() {
    if (!inCommingCall) return;
    try {
      await rejectIncomingCall(callId).unwrap();

      cleanupCall();
      dispatch(closeDialog());
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <VideoCallContext.Provider
      value={{
        isInCall,
        setIsInCall,
        startCall,
        callerInfo,
        acceptCall,
        rejectCall,
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
