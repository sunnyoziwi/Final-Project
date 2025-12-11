import { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { useMediaRecorder } from '../hooks/useMediaRecorder';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { apiService } from '../api/apiService';
import { socket } from '../api/socket';
import { VideoRecorder } from '../component/VideoRecorder';


interface RoomProps {
  userName: string;
  userEmail: string;
  language: string;
  positionData: { title: string, questions: string[] };
  onFinish: () => void;
}

export const Interviewee = ({ userName, userEmail, language, positionData, onFinish }: RoomProps) => {
  const { mediaStream, isRecording, initCamera, startRecording, stopRecording, shutdownCamera } = useMediaRecorder();
  const { transcript, startListening, stopListening } = useSpeechToText(language);
  
  const questionsList = positionData?.questions || ["Loading question..."];

  const [questionIndex, setQuestionIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");
  
  const peerInstance = useRef<Peer | null>(null);
  const transcriptRef = useRef(''); 

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    initCamera();
    apiService.startSession(userName).catch(console.error);
  }, []);

  useEffect(() => {
    if (!mediaStream || peerInstance.current) return;
    const peer = new Peer({
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    });
    
    peerInstance.current = peer;

    const sendMyId = (id: string) => {
      socket.emit("join_room", userEmail);
      socket.emit("send_peer_id", { peerId: id, userEmail });
    };

    peer.on('open', (id) => sendMyId(id));

    socket.on("request_peer_id", () => {
      if (peerInstance.current?.id) sendMyId(peerInstance.current.id);
    });

    peer.on('call', (call) => {
      call.answer(mediaStream); 
    });

    socket.on("receive_question", (msg) => setCustomQuestion(msg));

    return () => {
      socket.off("receive_question");
      socket.off("request_peer_id");
      peer.destroy();
      peerInstance.current = null;
    };
  }, [mediaStream, userEmail]); 

  useEffect(() => {
    if (transcript) {
      socket.emit("stream_transcript", { to: userEmail, text: transcript });
    }
  }, [transcript, userEmail]);

  const handleStartRecording = () => {
    startRecording();
    startListening();
  };

  const handleNextQuestion = async () => {
    const videoBlob = await stopRecording();
    stopListening();
    
    const finalTranscript = transcriptRef.current;
    setIsUploading(true);

    try {
      await apiService.uploadOne(videoBlob, questionIndex, userName, finalTranscript);

      if (questionIndex < questionsList.length - 1) {
        setQuestionIndex(prev => prev + 1);
        setCustomQuestion(""); 
      } else {
        shutdownCamera();
        await apiService.finishSession(userName);
        onFinish();
      }
    } catch (error) {
      alert("Upload Error!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="room-container">
       <h3 style={{color: '#007bff', marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '1px'}}>
         Position: {positionData?.title}
       </h3>
       
       <h1 className="question-title" style={{fontSize: '28px', fontWeight: 'bold', margin: '20px 0', color: '#333'}}>
         {questionsList[questionIndex]}
       </h1>

       {customQuestion && (
         <div style={{background: '#ffebee', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffcdd2', textAlign: 'left'}}>
           <strong style={{color: '#d32f2f'}}> Extra question:</strong> 
           <p style={{fontSize: '18px', fontWeight: 'bold', margin: '5px 0'}}>{customQuestion}</p>
         </div>
       )}

       <div style={{ marginBottom: '20px' }}>
         <VideoRecorder stream={mediaStream} />
       </div>
       
       <div className="transcript-box">
         {isRecording ? ` "${transcript}"` : "..."}
       </div>

       <div className="button-group">
         {!isRecording && !isUploading && (
           <button onClick={handleStartRecording} className="btn btn-success"> Start Answer</button>
         )}
         {isRecording && (
           <button onClick={handleNextQuestion} disabled={isUploading} className="btn btn-primary">
             {isUploading ? " Uploading..." : "Next ➡"}
           </button>
         )}
       </div>
    </div>
  );
};