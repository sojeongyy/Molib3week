const { Server } = require("socket.io");
const User = require("../models/userModel"); // DB에서 사용자 정보를 가져오는 모델

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000", // 프런트엔드 URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    // 사용자 ID를 DB에서 가져옴
    const userId = socket.handshake.query.userId;

    User.findById(userId, (err, user) => {
      if (err || !user) {
        console.error("User not found");
        socket.disconnect();
        return;
      }

      // 사용자 정보 전달
      socket.emit("init", { id: user._id, name: user.name });
    });

    // 메시지 수신 이벤트
    socket.on("send message", (message) => {
      io.emit("receive message", message); // 메시지 전달
    });

    // 연결 해제 이벤트
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initSocket;
