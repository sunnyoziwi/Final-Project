const multer = require('multer');
const fs = require('fs');
const path = require('path');

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

exports.uploadMiddleware = upload.single('video');

exports.handleUpload = (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const { userName, transcript, index } = req.body;
  const userRootFolder = global.activeSessions[userName];

  if (userRootFolder && transcript) {
    const txtFileName = `question_${parseInt(index) + 1}_transcript.txt`;
    
    const txtPath = path.join(userRootFolder, 'text', txtFileName);
    
    fs.writeFileSync(txtPath, transcript, 'utf8');
  }
  console.log(`📹 Uploaded: ${req.file.originalname} for ${req.body.userName}`);
  res.json({ success: true, filename: req.file.filename });
};