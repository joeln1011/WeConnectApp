import { useVideoCallContext } from "@context/VideoCallProvider";
import {
  Mic,
  MicOff,
  PhoneDisabled,
  Videocam,
  VideocamOff,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";

const CallControls = () => {
  const { endCurrentCall, localStream } = useVideoCallContext();
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const toggleAudio = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();

      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsAudioMuted(!isAudioMuted);
    }
  };
  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();

      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoMuted(!isVideoMuted);
    }
  };
  return (
    <div className="flex justify-center gap-3 bg-gray-900">
      <IconButton onClick={toggleAudio}>
        {isAudioMuted ? (
          <MicOff className="text-dark-400" />
        ) : (
          <Mic className="text-dark-400" />
        )}
      </IconButton>
      <IconButton onClick={() => endCurrentCall()}>
        <PhoneDisabled className="text-red-500" />
      </IconButton>
      <IconButton onClick={toggleVideo}>
        {isVideoMuted ? (
          <VideocamOff className="text-dark-400" />
        ) : (
          <Videocam className="text-dark-400" />
        )}
      </IconButton>
    </div>
  );
};

export default CallControls;
