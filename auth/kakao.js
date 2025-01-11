const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');

// ✅ 카카오 API 키와 Redirect URI
const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;

// ✅ 카카오 인가 코드 수신 및 토큰 요청
router.post('/', async (req, res) => {
    const { code } = req.body;

    try {
        // ✅ 1. 액세스 토큰 요청
        const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
            params: {
                grant_type: 'authorization_code',
                client_id: KAKAO_CLIENT_ID,
                redirect_uri: KAKAO_REDIRECT_URI,
                code
            }
        });
        const accessToken = tokenResponse.data.access_token;

        // ✅ 2. 사용자 정보 요청
        const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const { id, kakao_account } = userResponse.data;
        const nickname = kakao_account.profile.nickname;
        const email = kakao_account.email;
        const profileImage = kakao_account.profile.profile_image_url;

        // ✅ 3. MongoDB에 사용자 정보 저장
        let user = await User.findOne({ kakaoId: id });
        if (!user) {
            user = new User({ kakaoId: id, nickname, email, profileImage });
            await user.save();
        }

        res.json({ message: '✅ 로그인 성공!', user });
    } catch (error) {
        console.error('❌ 카카오 로그인 실패:', error);
        res.status(500).send('카카오 로그인 오류');
    }
});

module.exports = router;
