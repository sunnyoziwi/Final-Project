const fs = require('fs');
const path = require('path');
const { getVNTime } = require('../utils/timeHelper');

global.activeSessions = {}; 
global.waitingList = []
global.positions = [
  {
    id: 'pos_1',
    title: 'Frontend Developer',
    questions: [
      "React Lifecycle là gì?",
      "Giải thích Virtual DOM?",
      "Sự khác biệt giữa var, let, const?",
      "Cơ chế Async/Await hoạt động thế nào?",
      "Bạn mong muốn mức lương bao nhiêu?"
    ]
  },
  {
    id: 'pos_2',
    title: 'Backend Developer',
    questions: [
      "Node.js là đơn luồng hay đa luồng?",
      "RESTful API là gì?",
      "Cách tối ưu truy vấn Database?",
      "Giải thích khái niệm Middleware?",
      "Kinh nghiệm của bạn với Microservices?"
    ]
  }
];


const UPLOADS_ROOT = path.join(__dirname, '../../uploads');

if (!fs.existsSync(UPLOADS_ROOT)) fs.mkdirSync(UPLOADS_ROOT);

exports.getPositions = (req, res) => {
  res.json(global.positions);
};

exports.addPosition = (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Thiếu tên vị trí" });

  const newPos = {
    id: `pos_${Date.now()}`, 
    title: title,
    questions: [
      "Question 1...", 
      "Question 2...", 
      "Question 3...", 
      "Question 4...", 
      "Question 5..."
    ] 
  };

  global.positions.push(newPos);
  res.json({ success: true, newPosition: newPos });
};

exports.updatePosition = (req, res) => {
  const { id, questions } = req.body;
  const posIndex = global.positions.findIndex(p => p.id === id);
  
  if (posIndex !== -1) {
    global.positions[posIndex].questions = questions;
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Position not found" });
  }
};

exports.startSession = (req, res) => {
  const { userName } = req.body;
  if (!userName) return res.status(400).json({ error: "Thiếu userName" });

  const timeString = getVNTime();
  const folderName = `${timeString}_${userName}`;
  const folderPath = path.join(UPLOADS_ROOT, folderName);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    fs.mkdirSync(path.join(folderPath, 'video'));
    fs.mkdirSync(path.join(folderPath, 'text'));
  }

  global.activeSessions[userName] = folderPath;
  console.log(` Session started: ${userName} -> ${folderName}`);
  
  res.json({ success: true, folder: folderName });
};

exports.finishSession = (req, res) => {
  const { userName } = req.body;
  if (global.activeSessions[userName]) {
    delete global.activeSessions[userName];
  }
  console.log(` Session finished: ${userName}`);
  res.json({ success: true });
};

exports.verifyToken = (req, res) => {
  res.json({ success: true, message: "Token OK" });
};
exports.joinWaiting = (req, res) => {
  const { name, email } = req.body;
  
  const exists = global.waitingList.find(c => c.email === email);
  if (!exists) {
    const newCandidate = { 
      id: Date.now(), 
      name, 
      email 
    };
    global.waitingList.push(newCandidate);
    console.log(`➕ User joined waiting room: ${name}`);
  }
  
  res.json({ success: true });
};

exports.getWaitingList = (req, res) => {
  res.json({ candidates: global.waitingList });

};
