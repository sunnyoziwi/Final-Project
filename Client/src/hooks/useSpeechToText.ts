import { useState, useRef, useEffect } from 'react';

export const useSpeechToText = (languageCode: string = 'vi-VN') => {
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.lang = languageCode; 

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognitionRef.current = recognition;
    }
  }, [languageCode]); 

  const startListening = () => {
    if (recognitionRef.current) {
      
      recognitionRef.current.lang = languageCode; 
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.log("Recognition already started");
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return { transcript, startListening, stopListening };
};