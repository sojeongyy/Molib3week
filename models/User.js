const mongoose = require('mongoose');  // ✅ CommonJS 방식으로 변경
const { Schema, model } = mongoose;    // ✅ 구조분해 할당 유지

// ✅ User 스키마 정의
const UserSchema = new Schema({
    nickname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, "유효한 이메일 주소를 입력하세요."]
    },
    passwordHash: {
        type: String,
        required: true
    },
    dateOfBirth: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ✅ User 모델 생성 및 내보내기
const User = model('users', UserSchema);
export default User;
