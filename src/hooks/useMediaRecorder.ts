import { useState, useRef } from 'react';

export const useMediaRecorder = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const initCamera = async () => {
    if (mediaStream) return; 
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setMediaStream(stream);
    } catch (error) {
      console.error("Lỗi camera:", error);
      alert("Không thể mở Camera!");
    }
  };

  const startRecording = () => {
    if (!mediaStream) {
      initCamera().then(() => startRecording());
      return;
    }

    const recorder = new MediaRecorder(mediaStream);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) return;

      recorder.onstop = () => {
        const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
        setIsRecording(false);
        resolve(videoBlob);
      };

      recorder.stop();
    });
  };

  const shutdownCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  };

  return { 
    mediaStream, 
    isRecording, 
    initCamera,      
    startRecording, 
    stopRecording, 
    shutdownCamera   
  };
};