const express = require('express');
const passport = require('passport');
const { kakaoCallback } = require('../controller/userController'); // 사용자 컨트롤러 임포트
const { getUserProfile } = require('../controller/userController');
const UserProfile = require('../models/user_profile');
const jwt = require('jsonwebtoken');
const router = express.Router();

// ✅ 'authenticate' 대신 'passport.authenticate' 사용
router.get('/kakao', passport.authenticate('kakao'));


// ✅ 콜백 라우트 (user 컨트롤러의 kakaoCallback 사용)
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/login'
}), kakaoCallback);

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


// ✅ 기존 사용자 정보 업데이트 (signup 페이지)
router.put('/signup', async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    try {
        // ✅ JWT 토큰에서 사용자 ID 추출
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const { username, ideal, intro, status } = req.body;

        // if (!username || !ideal || !intro || !status) {
        //     return res.status(400).json({ message: "모든 필드를 입력해야 합니다." });
        // }

        // ✅ 기존 사용자 데이터 업데이트
        const updatedProfile = await UserProfile.findOneAndUpdate(
            { userId: userId }, 
            { $set: { username, ideal, intro, status } }, 
            { new: true, upsert: true }
        );

        res.status(200).json({ message: "✅ 프로필 업데이트 성공!", updatedProfile });
    } catch (error) {
        console.error("❌ 프로필 업데이트 실패:", error);
        res.status(500).json({ message: "서버 오류 발생" });
    }
});




module.exports = router;