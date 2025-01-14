const mongoose = require("mongoose");

// ✅ ChatRoomProps 스키마 정의
const chatRoomDataSchema = new mongoose.Schema({
    userId: {
        type: String,  // ✅ 사용자 고유 ID (ObjectId)
        required: true
    },
    chatRoomArray: [
        {
            username: {
                type: String,
                required: true
            },
            id: {
                type: String,  // ✅ 문자열 ID (ObjectId와 다른 사용자 지정 ID)
                required: true
            },
            status: {
                type: String,
                enum: ["green", "red", "unknown"],  // ✅ 상태 제한
                default: "unknown"
            },
            photo: {
                type: String,
                default: "/images/default-photo.png"
            },
            lastchatdate: {
                type: Number,
                default: 0
            }
        }
    ]
});

// ✅ Mongoose 모델 생성
const ChatRoomDataModel = mongoose.model("ChatRoomdata", chatRoomDataSchema);
module.exports = ChatRoomDataModel;
