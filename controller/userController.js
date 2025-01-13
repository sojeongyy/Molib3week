const jwt = require('jsonwebtoken');
const UserProfile = require('../models/user_profile');
const mongoose = require('mongoose');

// ✅ 카카오 로그인 콜백 (JWT 토큰 발급 및 저장)
exports.kakaoCallback = (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // ✅ 쿠키 설정 (httpOnly, secure 적용)
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // ✅ 새로운 사용자라면 /signup 페이지로 이동
    if (req.authInfo && req.authInfo.redirectToSignup) {
        console.log("✅ 새로운 사용자, signup 페이지로 이동");
        return res.redirect('http://localhost:3000/signup');
    }

    console.log(`✅ 로그인 성공! 사용자: ${req.user.nickname}`);
    res.redirect('http://localhost:3000/');
};

// ✅ 사용자 프로필 조회 (JWT에서 추출한 ID 사용)
exports.getUserProfile = async (req, res) => {
    console.log("✅ getUserProfile 라우트 호출됨");
    console.log("✅ 요청받은 사용자 ID:", req.user.id);

    try {
        // ✅ userId 타입 확인
        console.log("✅ userId 데이터 타입:", typeof req.user.id);

        // ✅ MongoDB의 전체 UserProfile 데이터 출력 (디버깅용)
        const allProfiles = await UserProfile.find();
        console.log("✅ 모든 프로필 데이터:", allProfiles);

        const userId = new mongoose.Types.ObjectId(req.user.id);
        // ✅ userId에 해당하는 프로필 찾기
        const userProfile = await UserProfile.findOne({ userId }).populate('userId');
        console.log("✅ 조회 결과:", userProfile);

        if (!userProfile) {
            console.log("❌ 프로필이 존재하지 않습니다.");
            return res.status(404).json({ message: "프로필을 찾을 수 없습니다." });
        }

        // ✅ 프로필이 존재할 경우 데이터 반환
        res.status(200).json({
            username: userProfile.username,
            photo: userProfile.photo || '/default.png',
            status: userProfile.status,
            similarity: userProfile.similarity,
            intro: userProfile.intro,
            ideal: userProfile.ideal,
            rating: userProfile.rating
        });
    } catch (error) {
        console.error('❌ 프로필 조회 중 오류 발생:', error);
        res.status(500).json({ error: '서버 오류 발생' });
    }
};