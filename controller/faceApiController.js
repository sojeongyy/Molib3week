const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = require('canvas');
const path = require('path');

const MODEL_PATH = path.join(__dirname, '../face_models');

// ✅ face-api.js 설정
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// ✅ 모델 로드
const loadModels = async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
    console.log('✅ Face-api.js 모델 로드 완료');
};
loadModels();

// ✅ 유사도 비교 로직
const bufferToCanvas = async (buffer) => {
    const img = new Image();
    img.src = buffer;
    return faceapi.createCanvasFromMedia(img);
};

const calculateSimilarity = async (img1Buffer, img2Buffer) => {
    const img1Canvas = await bufferToCanvas(img1Buffer);
    const img2Canvas = await bufferToCanvas(img2Buffer);

    const detection1 = await faceapi.detectSingleFace(img1Canvas).withFaceLandmarks().withFaceDescriptor();
    const detection2 = await faceapi.detectSingleFace(img2Canvas).withFaceLandmarks().withFaceDescriptor();

    if (!detection1 || !detection2) {
        throw new Error('얼굴을 감지할 수 없습니다.');
    }

    const distance = faceapi.euclideanDistance(detection1.descriptor, detection2.descriptor);
    return ((1 - distance) * 100).toFixed(2);  // 유사도 변환
};

// ✅ 라우트 핸들러
exports.compareFaces = async (req, res) => {
    try {
        const [image1, image2] = req.files;
        if (!image1 || !image2) {
            return res.status(400).json({ error: "이미지를 모두 업로드해주세요." });
        }

        const similarity = await calculateSimilarity(image1.buffer, image2.buffer);
        res.status(200).json({ score: `${similarity}%` });
    } catch (error) {
        console.error("❌ 오류 발생:", error);
        res.status(500).json({ error: error.message });
    }
};

const UserProfile = require('../models/user_profile');

// ✅ 유사도 업데이트 컨트롤러 (현재 로그인된 사용자 기준)
exports.updateSimilarity = async (req, res) => {
    try {
        // ✅ 로그인한 사용자 정보 추출
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "사용자가 인증되지 않았습니다." });
        }

        const { similarity } = req.body;

        // ✅ 유효성 검사
        if (similarity === undefined || isNaN(parseFloat(similarity))) {
            return res.status(400).json({ message: "유효한 유사도 점수가 필요합니다." });
        }

        // ✅ 사용자 프로필 업데이트
        const updatedUser = await UserProfile.findOneAndUpdate(
            { userId: req.user.id },  
            { $set: { similarity: parseFloat(similarity) } },  
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "사용자 프로필을 찾을 수 없습니다." });
        }

        res.status(200).json({ message: "✅ 유사도 점수가 성공적으로 업데이트되었습니다.", updatedUser });
    } catch (error) {
        console.error("❌ 유사도 점수 업데이트 오류:", error);
        res.status(500).json({ message: "서버 오류 발생", error: error.message });
    }
};