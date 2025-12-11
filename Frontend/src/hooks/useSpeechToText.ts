import { useState, useRef, useEffect, useCallback } from 'react';

export const useSpeechToText = (languageCode: string = 'vi-VN') => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // 1. Kiểm tra trình duyệt
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error("❌ Trình duyệt này KHÔNG hỗ trợ Speech Recognition. Hãy dùng Chrome trên PC.");
      return;
    }

    console.log("✅ Trình duyệt hỗ trợ Speech API. Đang khởi tạo...");
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;      // Thu âm liên tục
    recognition.interimResults = true;  // Trả về kết quả ngay khi đang nói (chưa xong câu)
    recognition.lang = languageCode;

    // --- CÁC SỰ KIỆN LOGGING ---

    recognition.onstart = () => {
      console.log("🎤 Mic đã BẬT. Bắt đầu nghe...");
      setIsListening(true);
    };

    recognition.onend = () => {
      console.log("🛑 Mic đã TẮT (Tự động hoặc do lệnh stop).");
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("⚠️ Lỗi Speech API:", event.error);
      // Các lỗi thường gặp: 
      // 'not-allowed' (Chưa cấp quyền Mic), 
      // 'network' (Mất mạng/API key), 
      // 'no-speech' (Không nghe thấy gì)
    };

    recognition.onresult = (event: any) => {
      // console.log("🗣 Đang nhận tín hiệu..."); // Bỏ comment nếu muốn xem log liên tục
      let currentTranscript = '';
      
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      
      // Log kết quả thô để kiểm tra xem API có trả về chữ không
      // console.log("📝 Text nhận được:", currentTranscript); 
      
      setTranscript(currentTranscript);
    };

    recognitionRef.current = recognition;

    // Cleanup khi unmount
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [languageCode]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        console.log("▶️ Lệnh startListening() đã được gọi.");
      } catch (error) {
        console.warn("⚠️ Không thể start (có thể mic đang bật rồi):", error);
      }
    } else {
        console.error("❌ Không tìm thấy instance recognition.");
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      console.log("⏹️ Lệnh stopListening() đã được gọi.");
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    console.log("🔄 Đã reset transcript.");
  }, []);

  return { 
    transcript, 
    isListening, 
    startListening, 
    stopListening, 
    resetTranscript 
  };
};