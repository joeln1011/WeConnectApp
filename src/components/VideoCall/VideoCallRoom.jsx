import { useVideoCallContext } from "@context/VideoCallProvider";
import CallControls from "./CallControls";
import { useEffect, useRef } from "react";

const VideoCallRoom = () => {
  const { isInCall, remoteStream, localStream } = useVideoCallContext();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  if (!isInCall) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="relative flex-1">
        <div className="absolute inset-0">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="h-full w-full"
          />
        </div>
        <div className="absolute right-4 bottom-4 h-40 w-72 overflow-hidden rounded-lg bg-gray-900">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            className="h-full w-full"
          />
        </div>
      </div>
      <CallControls />
    </div>
  );
};

export default VideoCallRoom;
