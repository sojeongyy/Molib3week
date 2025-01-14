const mongoose = require("mongoose");
const ChatRoom = require("../models/chatroom_info"); // ChatRoom 모델 가져오기

// 특정 채팅방 조회
exports.getChatRoomById = async (req, res) => {
  const { chatRoomId } = req.params;

  try {
    const chatRoom = await ChatRoom.findOne({ chatRoomId });
    if (!chatRoom) {
      return res.status(404).json({ error: "Chat room not found" });
    }
    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 새로운 채팅방 생성
exports.createChatRoom = async (req, res) => {
  const { chatRoomId, participants } = req.body;

  // 기존에는 chatRoomId와 participants 둘 다 필수였지만
  // 여기서는 participants 미전달 시 빈 배열로 처리
  if (!chatRoomId) {
    return res.status(400).json({ error: "chatRoomId is required" });
  }

  try {
    const existingRoom = await ChatRoom.findOne({ chatRoomId });
    if (existingRoom) {
      return res.status(409).json({ error: "Chat room already exists" });
    }

    // participants가 없으면 빈 배열로 기본값 설정
    const newRoom = new ChatRoom({
      chatRoomId,
      participants: participants || [],
      messages: [],
    });
    await newRoom.save();

    res.status(201).json({ message: "Chat room created", chatRoomId });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 특정 채팅방에 메시지 추가
exports.saveMessage = async (req, res) => {
  const { chatRoomId } = req.params;
  // 프론트에서 user, message 라는 키로 보낸다고 가정
  const { user, message } = req.body;

  if (!user || !message) {
    return res.status(400).json({ error: "user and message are required" });
  }

  try {
    const chatRoom = await ChatRoom.findOne({ chatRoomId });
    if (!chatRoom) {
      return res.status(404).json({ error: "Chat room not found" });
    }

    const newMessage = {
      messageId: `msg_${Date.now()}`,
      senderId: user, // userId -> user
      content: message, // content -> message
      timestamp: new Date().toISOString(),
    };

    chatRoom.messages.push(newMessage);
    await chatRoom.save();

    res.status(201).json({ message: "Message saved", newMessage });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
