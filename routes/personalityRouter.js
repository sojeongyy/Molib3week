const express = require('express');
const { savePersonality } = require('../controller/personalityController');
const router = express.Router();

// POST 요청으로 성격 저장
router.post('/savePersonality', savePersonality);

module.exports = router;
