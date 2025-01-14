const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema(
  {
    // 채팅방 ID
    /* 어차피 _id 자동으로 생성되는 듯
    chatroomId: {
      required: true,
    },*/
    // 1:1 채팅 참가자 목록
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserProfile", // UserProfile 모델과 연결
        required: true,
      },
    ],
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

module.exports = mongoose.model("ChatRoom", ChatRoomSchema);
