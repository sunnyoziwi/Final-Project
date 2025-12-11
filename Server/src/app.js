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
  res.setHeader(
    "Content-Security-Policy",
    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
  );
  res.setHeader("X-Content-Type-Options", "nosniff");
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

io.on("connection", (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  socket.on("join_room", (email) => {
    socket.join(email);
    console.log(`User joined room: ${email}`);
  });

  socket.on("start_interview", (data) => {
    io.to(data.candidateEmail).emit("force_start"); 
  });

  socket.on("send_peer_id", (data) => {
    console.log(`📡 PeerID received from ${data.userEmail}: ${data.peerId}`);
    socket.to(data.userEmail).emit("receive_peer_id", data.peerId);
  });

  socket.on("interviewer_ready", (data) => {
    console.log(`Interviewer ready in room: ${data.candidateEmail}`);
    io.to(data.candidateEmail).emit("request_peer_id");
  });

  socket.on("stream_transcript", (data) => {
    socket.to(data.to).emit("receive_transcript", data.text);
  });

  socket.on("send_question", (data) => {
    socket.to(data.to).emit("receive_question", data.question);
  });

}); 

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});