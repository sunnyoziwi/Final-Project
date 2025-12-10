const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const apiRoutes = require('./routes/api');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);
app.use(express.static(path.join(__dirname, '../../client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.use((req, res, next) => {
  // Cho phép chạy script (unsafe-eval) để tránh lỗi màn hình trắng
  res.setHeader(
    "Content-Security-Policy",
    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
  );
  // Fix lỗi "X-Content-Type-Options"
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Fix lỗi "Cache-Control" (để trình duyệt không nhớ cache cũ)
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  next();
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["ngrok-skip-browser-warning"],
    credentials : true
  }
});

// --- BẮT ĐẦU VÙNG KẾT NỐI SOCKET ---
io.on("connection", (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  // 1. Vào phòng
  socket.on("join_room", (email) => {
    socket.join(email);
    console.log(`User joined room: ${email}`);
  });

  // 2. Bắt đầu phỏng vấn (Chuyển trang)
  socket.on("start_interview", (data) => {
    io.to(data.candidateEmail).emit("force_start"); 
  });

  // 3. WebRTC Signaling (Trao đổi ID gọi video)
  socket.on("send_peer_id", (data) => {
    console.log(`📡 PeerID received from ${data.userEmail}: ${data.peerId}`);
    socket.to(data.userEmail).emit("receive_peer_id", data.peerId);
  });

  // 🔥 4. SỬA LỖI ĐEN MÀN HÌNH: Giám khảo vào sau thì yêu cầu gửi lại ID
  socket.on("interviewer_ready", (data) => {
    console.log(`Interviewer ready in room: ${data.candidateEmail}`);
    // Bắn tin nhắn yêu cầu Thí sinh gửi lại ID
    io.to(data.candidateEmail).emit("request_peer_id");
  });

  // 5. Transcript & Câu hỏi
  socket.on("stream_transcript", (data) => {
    socket.to(data.to).emit("receive_transcript", data.text);
  });

  socket.on("send_question", (data) => {
    socket.to(data.to).emit("receive_question", data.question);
  });

}); 
// --- KẾT THÚC VÙNG KẾT NỐI SOCKET --- (Dấu ngoặc này rất quan trọng)

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
