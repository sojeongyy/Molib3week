/* server.js */

const express = require("express");
const app = express();
const { mongoDB } = require("./config/mongo-db");
const multer = require('multer');
const { spawn } = require('child_process');
const port = 5000;

// Multer 설정 (파일 업로드용)
const upload = multer({ dest: 'uploads/' });

mongoDB();

// 이미지 비교 엔드포인트
app.post('/api/similarity-check', upload.single('image'), (req, res) => {
    const profileImagePath = 'uploads/profile.jpg'; // 프로필 사진 경로 (DB에서 가져올 수 있음)
    const uploadedImagePath = req.file.path;

    // Python face_recognition 라이브러리 호출
    const pythonProcess = spawn('python3', ['compare_faces.py', profileImagePath, uploadedImagePath]);

    pythonProcess.stdout.on('data', (data) => {
        res.json({ score: data.toString().trim() });
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error('Error:', data.toString());
        res.status(500).send('Error processing image');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
