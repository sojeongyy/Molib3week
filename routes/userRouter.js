const express = require('express');
const passport = require('passport');
const { kakaoCallback } = require('../controller/userController'); // 사용자 컨트롤러 임포트

const router = express.Router();

// ✅ 'authenticate' 대신 'passport.authenticate' 사용
router.get('/kakao', passport.authenticate('kakao'));

// ✅ 콜백 라우트 (user 컨트롤러의 kakaoCallback 사용)
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/login'
}), kakaoCallback);

// ✅ 라우트 내보내기 (CommonJS 방식)
module.exports = router;
