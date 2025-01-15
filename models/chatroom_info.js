const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  chatRoomId: {
    type: String,
    required: true,
    unique: true, // 유지: chatRoomId는 고유해야 하므로 HEAD의 unique 설정 포함
  },
  participants: [
    {
      userId: {
        type: String,
        ref: "userprofiles",
        required: true, // 유지: userId는 필수값
      },
      username: String,
      photo: String,
      status: String,
    },
  ],
  messages: [
    {
      messageId: String,
      senderId: {
        type: String,
        ref: "userprofiles",
        required: true,
      },
      senderName: String,
      content: String,
      timestamp: Date,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatRoomModel = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = ChatRoomModel;
