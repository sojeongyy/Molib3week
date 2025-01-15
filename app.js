require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const { connectDB, mongoose } = require("./config/db"); // MongoDB 연결
const userRoutes = require("./routes/userRouter"); // 사용자 라우트
const passport = require("passport");
const cors = require("cors");
const kakaoAuthRouter = require("./auth/kakao");
const cookieParser = require("cookie-parser");
const faceApiRoutes = require("./routes/faceApiRouter");
const multer = require("multer");
const personalityRouter = require("./routes/personalityRouter");
const chatRoomRouter = require("./routes/chatroomRouter");
const messageRouter = require("./routes/chat");
const http = require("http");
const { Server } = require("socket.io");

const chatMessageController = require("./controller/chatMessageController");
console.log(chatMessageController);

require("./passport/index"); // Passport 설정 파일 로드

const app = express();
connectDB();
//passport(app);

// HTTP 서버 생성
const httpServer = http.createServer(app);

// (3) Socket.IO 서버 초기화
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// (4) WebSocket 이벤트 처리
// 사용자가 소켓에 접속했을 때
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 방(채팅방 ID) join
  socket.on("joinRoom", (chatRoomId) => {
    socket.join(chatRoomId);
    console.log(`Socket ${socket.id} joined room ${chatRoomId}`);
  });
  socket.on("connect", () => {
    console.log("소켓 서버에 연결되었습니다.");
  });
  socket.on("connect_error", (err) => {
    console.error("연결 에러:", err);
  });

  // 메시지 전송
  socket.on("sendMessage", async ({ chatRoomId, message }) => {
    // 1. DB에 메시지 저장 (ChatRoomModel 갱신)
    // 2. 같은 방에 join해 있는 소켓들에게 메시지 전달
    io.to(chatRoomId).emit("receiveMessage", message);
  });

  // 연결 종료
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ CORS 및 미들웨어 등록 (순서 중요)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: "1000mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mySecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true, // ✅ 클라이언트에서 접근 불가
      secure: false, // ✅ 개발 환경에서는 false (HTTPS에서는 true)
      maxAge: 1000 * 60 * 60 * 24, // 1일
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ✅ 사용자 라우트 연결
app.use("/auth", userRoutes);
app.use("/auth/kakao", kakaoAuthRouter);

app.use("/", faceApiRoutes); // 얼굴 비교 라우트
app.use("/api/personality", personalityRouter);
app.use("/api/chatrooms", chatRoomRouter); // 채팅방 라우트
app.use("/chatother", messageRouter); //메시지 라우트

// ✅ 기본 라우트
app.get("/", (req, res) => {
  res.send("✅ 카카오 소셜 로그인 서비스 시작!");
});

// ✅ User 모델을 정확히 불러오기
const KakaoUser = require("./models/kakao_profile.js");

// ✅ 서버 실행
//const PORT = process.env.PORT || 5000;
//app.listen(PORT, () => {
//  console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
//});

// ======================
// 서버 시작
// ======================
const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
