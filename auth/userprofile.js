const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controller/userController');

// ✅ JWT 인증을 사용하여 로그인한 사용자만 접근 가능
router.get('/userprofile', getUserProfile);

module.exports = router;
