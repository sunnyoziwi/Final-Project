import { useEffect, useRef } from 'react';

interface VideoRecorderProps {
  stream: MediaStream | null;
}

export const VideoRecorder = ({ stream }: VideoRecorderProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="video-wrapper">
      {stream ? (
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          className="video-element"
        />
      ) : (
        <div className="video-placeholder">
          <p>Camera is turned off...</p>
        </div>
      )}
    </div>
  );
};