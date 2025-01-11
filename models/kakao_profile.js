const mongoose = require('mongoose');  // ✅ CommonJS 방식으로 변경

// ✅ User 스키마 정의
const KakaoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    nickname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    kakaoId: {
        type: String
    }
});

// ✅ User 모델 생성 및 내보내기
const KakaoUser = mongoose.model('kakao_profiles', KakaoSchema);
module.exports = KakaoUser;
