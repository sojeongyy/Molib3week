const mongoose = require("mongoose");
const { ChatRoomModel } = require("../models/chatroom_info"); // ChatRoom 모델 가져오기

// 특정 채팅방 조회
exports.getChatRoomById = async (req, res) => {
  const { chatRoomId } = req.params;

  try {
    const chatRoom = await ChatRoomModel.findOne({ chatRoomId });
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
    const existingRoom = await ChatRoomModel.findOne({ chatRoomId });
    if (existingRoom) {
      return res.status(409).json({ error: "Chat room already exists" });
    }

    // participants가 없으면 빈 배열로 기본값 설정
    const newRoom = new ChatRoomModel({
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
  // 프론트에서 보내주는 값들
  // chatRoomId, user(_id), message 등을 body로 받아온다고 가정
  console.log("Request Body:", req.body);
  const { chatroomId, user, message } = req.body;

  // 유효성 검사
  if (!chatroomId) {
    return res.status(400).json({ error: "chatroomId is required" });
  }
  if (!user || !message) {
    return res.status(400).json({ error: "user and message are required" });
  }

  try {
    // 1) chatRoomId로 해당 채팅방 찾기

    const chatRoom = await ChatRoomModel.findOne({ chatRoomId: chatroomId });
    console.log("Chat Room Found:", chatRoom);
    console.log("Query Executed with:", { chatRoomId: chatroomId });

    if (!chatRoom) {
      return res.status(404).json({ error: "Chat room not found" });
    }

    // 2) messages 배열에 새 메시지 push
    const newMessage = {
      messageId: `msg_${Date.now()}`, // 메시지 ID 예시
      senderId: user, // user의 _id
      content: message, // 메시지 내용
      timestamp: new Date(),
    };
    chatRoom.messages.push(newMessage);

    // 3) DB 저장
    await chatRoom.save();
    console.log(">>> chatRoom after saving:", chatRoom);

    // 4) 성공 응답
    res.status(201).json({ message: "Message saved", newMessage });
  } catch (error) {
    console.error("Error in saveMessage route:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
