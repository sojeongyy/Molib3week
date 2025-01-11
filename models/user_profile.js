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
    }
});

module.exports = mongoose.model('UserProfile', UserSchema);
