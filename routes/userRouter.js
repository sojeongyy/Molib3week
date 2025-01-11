const express = require('express');
const passport = require('passport');
const { kakaoCallback } = require('../controller/userController'); // 사용자 컨트롤러 임포트
const { getUserProfile } = require('../controller/userController');
const jwt = require('jsonwebtoken');
const router = express.Router();

// ✅ 'authenticate' 대신 'passport.authenticate' 사용
router.get('/kakao', passport.authenticate('kakao'));

// ✅ 콜백 라우트 (user 컨트롤러의 kakaoCallback 사용)
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/login'
}), kakaoCallback);

// ✅ JWT 토큰 수동 검증 미들웨어
const verifyJWT = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "토큰 검증 실패." });
    }
};

// ✅ 로그인한 사용자 프로필 조회 (JWT 검증 포함)
router.get('/userprofile', verifyJWT, getUserProfile);

module.exports = router;