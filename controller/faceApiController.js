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
