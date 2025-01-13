const express = require('express');
const router = express.Router();
const multer = require('multer');
const { compareFaces } = require('../controller/faceApiController');

const upload = multer({ storage: multer.memoryStorage() });

// ✅ POST - 얼굴 유사도 비교 엔드포인트
router.post('/compare-faces', upload.array('images', 2), compareFaces);

module.exports = router;
