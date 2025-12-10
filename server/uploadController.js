const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Cấu hình nơi lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { userName } = req.body;
    const userFolder = global.activeSessions[userName];

    if (userFolder && fs.existsSync(userFolder)) {
      const videoFolder = path.join(userFolder, 'video');
      cb(null, userFolder);
    } else {
      cb(new Error("Session not found or expired"), null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware xử lý upload
exports.uploadMiddleware = upload.single('video');

// Hàm xử lý sau khi upload xong
exports.handleUpload = (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const { userName, transcript, index } = req.body;
  const userRootFolder = global.activeSessions[userName];

  // Lưu Transcript (nếu có)
  if (userRootFolder && transcript) {
    const txtFileName = `question_${parseInt(index) + 1}_transcript.txt`;
    
    // 🔥 SỬA: Trỏ vào folder con 'text'
    const txtPath = path.join(userRootFolder, 'text', txtFileName);
    
    fs.writeFileSync(txtPath, transcript, 'utf8');
  }
  console.log(`📹 Uploaded: ${req.file.originalname} for ${req.body.userName}`);
  res.json({ success: true, filename: req.file.filename });
};
