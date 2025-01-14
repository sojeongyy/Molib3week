// messages_data.json 기반 스키마!!
const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
    chatRoomId: {
        type: String,
        required: true,
        unique: true
    },
    participants: [
        {
            userId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'userprofiles',
                required: true
            },
            username: String,
            photo: String,
            status: String
        }
    ],
    messages: [
        {
            messageId: String,
            senderId: String,
            senderName: String,
            content: String,
            timestamp: Date
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ChatRoomModel = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = ChatRoomModel;
