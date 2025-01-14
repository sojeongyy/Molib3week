const ChatRoom = require("../models/chatroom_info");

// 현재 로그인한 사용자의 채팅방 목록 가져오기
exports.getChatRooms = async (req, res) => {
  try {
    const userId = req.user._id; // 로그인한 사용자의 ID (미들웨어에서 설정)

    const chatRooms = await ChatRoom.find({
      participants: userId,
    })
      .populate("participants", "username photo status") // 참가자 정보 로드
      .exec();

    res.status(200).json(chatRooms);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    res.status(500).json({ error: "Failed to fetch chat rooms" });
  }
};
