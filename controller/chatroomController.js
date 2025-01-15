const ChatRoomDataModel = require("../models/chatroom_data");
const ChatRoomModel = require("../models/chatroom_info");
const mongoose = require("mongoose"); // ✅ mongoose 임포트 추가
const UserProfile = require("../models/user_profile");
const OpenAI = require("openai");
const { query } = require("express");

// // OpenAI API 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ 특정 `userId` 기준으로 채팅방 조회
const getChatRoomsByUserId = async (req, res) => {
    try {
        // ✅ (1) 로그인 여부 체크
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "사용자가 인증되지 않았습니다." });
        }

        const userId = new mongoose.Types.ObjectId(req.user.id);
        console.log("userId", userId);
        // ✅ (2) 데이터베이스에서 해당 사용자 조회
        const existingUser = await UserProfile.findOne({ userId: userId });
        
        if (!existingUser) {
            return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        }

        // ✅ (3) `chatRoomData` 스키마에서 해당 사용자가 속한 채팅방 찾기
        // ✅ `chatRoomData`의 userId가 String일 경우 변환 후 비교
        const chatRooms = await ChatRoomDataModel.find({
            userId: userId.toString()  // ❗ String으로 변환하여 비교
        })
        
      
        if (!chatRooms.length) {
            return res.status(404).json({ message: "참여 중인 채팅방이 없습니다." });
        }

        // ✅ (4) 필터링된 채팅방 데이터 반환
      //res.status(200).json(chatRooms);
        res.status(200).json({
            username: existingUser.username,  // 사용자 이름 추가
            chatRooms: chatRooms
        });
      
    } catch (error) {
        console.error("❌ 채팅방 조회 오류:", error);
        res.status(500).json({ message: "서버 오류 발생", error });
    }
};




// (2) 특정 `chatRoomId`에 대한 AI 피드백 제공 (메시지 5개마다)
const aiFeedback = async (req, res) => {
    const { chatRoomId } = req.body; // ✅ 요청 본문에서 chatRoomId 가져오기
    try {
        const chatRoom = await ChatRoomModel.findOne({ chatRoomId: chatRoomId });
        if (!chatRoom) {
            return res.status(404).json({ message: "채팅방을 찾을 수 없습니다." });
        }

        const messages = chatRoom.messages;
        if (messages.length % 3 !== 0) {
            return res.status(400).json({ message: "AI 피드백은 메시지 3개마다 제공됩니다." });
        }

        const formattedMessages = messages.map(msg => ({
            role: "user",
            content: `[${msg.senderName}] ${msg.content}`
        }));

        // OpenAI API 호출
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            query: "Provide positive feedback for the conversation.",
            messages: [
                { role: "system", content: query },
                ...formattedMessages.slice(-5),
            ],
            max_tokens: 100
        });

        // ✅ 응답 검증 코드 추가
        if (completion && completion.choices && completion.choices.length > 0) {
            const aiResponse = completion.choices[0].message.content;
            console.log("🔍 OpenAI API 응답:", JSON.stringify(completion, null, 2));
            res.status(200).json({ feedback: aiResponse });
            //console.log("🔍 OpenAI API 응답:", JSON.stringify(completion, null, 2));
        } else {
            console.error("OpenAI 응답이 비어있습니다.");
            res.status(500).json({ error: "AI 응답을 가져올 수 없습니다." });
    }

    } catch (error) {
        console.error("AI 피드백 생성 실패:", error);
        res.status(500).json({ error: "AI 피드백 생성 중 오류가 발생했습니다." });
    }
};

module.exports = { getChatRoomsByUserId, aiFeedback };
//module.exports = { getChatRoomsByUserId};