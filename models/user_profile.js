const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'kakao_profiles',
        required: true
    },
    username: {
        type: String
    },
    photo: {
        type: String
    },
    status: {
        type: String
    },
    similarity: {
        type: Number
    },
    intro: {
        type: String
    },
    ideal: {
        type: String
    },
    rating: {
        type: Number
    },
    personality: {
        type: [String], // 여러 성격을 배열로 저장
        enum: ['다정한', '친절한', '외향적인', '내향적인', '귀여운', '과묵한', '어른스러운', '세심한'],
        default: []
    },
});

module.exports = mongoose.model('UserProfile', UserSchema);
