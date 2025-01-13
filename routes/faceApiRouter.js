const express = require('express');
const router = express.Router();
const multer = require('multer');
const verifyJWT = require('../middleware/verifyJWT'); // ✅ 임포트 추가
const { compareFaces, updateSimilarity } = require('../controller/faceApiController');

const upload = multer({ storage: multer.memoryStorage() });

// ✅ POST - 얼굴 유사도 비교 엔드포인트
router.post('/api/compare-faces', upload.array('images', 2), compareFaces);

// 유사도 업데이트 라우트
//router.put('/auth/update-similarity', verifyJWT, updateSimilarity);
router.put('/auth/update-similarity', updateSimilarity);
module.exports = router;
