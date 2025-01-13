const express = require("express");
const app = express();
const multer = require('multer');
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = require('canvas');
const canvas = require('canvas');
const path = require("path");
const fs = require("fs");
const port = 5000;
const cors = require("cors");  // ✅ CORS 임포트 추가

app.use(cors());

// face-api.js의 환경 설정
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// 모델 경로 설정
const MODEL_PATH = path.join(__dirname, "../face_models");

// 메모리 스토리지를 사용하는 multer 설정
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 모델 로딩 함수
const loadModels = async () => {
    try {
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
        await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
        await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
        console.log("Face-api.js 모델 로드 완료 ✅");
    } catch (error) {
        console.error("모델 로드 실패 ❌", error);
    }
};

// 이미지 버퍼를 Canvas 객체로 변환하는 함수
const bufferToCanvas = async (buffer) => {
    try {
        const img = new Image();
        img.src = buffer;
        return faceapi.createCanvasFromMedia(img);
    } catch (error) {
        throw new Error("이미지 변환 중 오류 발생: " + error.message);
    }
};

// 얼굴 유사도 계산 함수
const calculateSimilarity = async (img1Buffer, img2Buffer) => {
    try {
        console.log("⚙️ 얼굴 유사도 계산 시작");

        const img1Canvas = await bufferToCanvas(img1Buffer);
        const img2Canvas = await bufferToCanvas(img2Buffer);

        const detections1 = await faceapi.detectSingleFace(img1Canvas).withFaceLandmarks().withFaceDescriptor();
        const detections2 = await faceapi.detectSingleFace(img2Canvas).withFaceLandmarks().withFaceDescriptor();

        if (!detections1) {
            throw new Error("첫 번째 이미지에서 얼굴을 감지하지 못했습니다.");
        }
        if (!detections2) {
            throw new Error("두 번째 이미지에서 얼굴을 감지하지 못했습니다.");
        }

        const distance = faceapi.euclideanDistance(detections1.descriptor, detections2.descriptor);
        const similarityPercentage = ((1 - distance) * 100).toFixed(2);
        console.log(`✅ 유사도 계산 완료: ${similarityPercentage}%`);
        return similarityPercentage;
    } catch (error) {
        console.error("❌ 얼굴 유사도 계산 중 오류:", error);
        throw error;
    }
};

// ✅ POST 요청: 두 이미지의 유사도 비교 엔드포인트
app.post("/api/compare-faces", upload.array("images", 2), async (req, res) => {
    console.log("✅ POST 요청 수신");  // 경로 확인 로그 추가
    try {
        console.log("✅ POST 요청 수신됨");
        const [image1, image2] = req.files;

        if (!image1 || !image2) {
            console.log("❌ 이미지 업로드 누락");
            return res.status(400).json({ error: "이미지를 모두 업로드해야 합니다." });
        }

        const similarity = await calculateSimilarity(image1.buffer, image2.buffer);
        console.log(`✅ 유사도 계산 완료: ${similarity}%`);
        res.json({ score: `${similarity}%` });
    } catch (error) {
        console.error("❌ 서버 오류 발생:", error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ 서버 시작 및 모델 로드
app.listen(port, async () => {
    await loadModels();
    console.log(`서버 실행 중: http://localhost:${port}`);
});
