const mongoose = require('mongoose');  // ✅ CommonJS 방식으로 변경
const { Schema, model } = mongoose;    // ✅ 구조분해 할당 유지

// ✅ User 스키마 정의
const UserSchema = new mongoose.Schema({
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
    // passwordHash: {  // ✅ 필수값으로 설정됨
    //     type: String,
    //     required: true
    // },
    kakaoId: {
        type: String
    }
});

// ✅ User 모델 생성 및 내보내기
const User = mongoose.model('users', UserSchema);
module.exports = User;
