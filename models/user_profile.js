const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    kakaoId: {
        type: String,
        unique: true
    },
    email: {
        type: String
    },
    nickname: {
        type: String
    },
    profileImage: {
        type: String
    },
    providerType: {
        type: String,
        default: 'kakao'
    }
});

module.exports = mongoose.model('User', UserSchema);
