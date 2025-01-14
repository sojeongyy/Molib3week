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

require("./passport/index"); // Passport 설정 파일 로드

const app = express();
connectDB();
//passport(app);

// ✅ CORS 및 미들웨어 등록 (순서 중요)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: "1000mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

// ✅ 라우트에서 적용
// app.post('/upload', upload.array('images', 2), (req, res) => {
//     try {
//         console.log('✅ 이미지 업로드 성공:', req.files);
//         res.json({ message: "이미지 업로드 성공!" });
//     } catch (error) {
//         res.status(500).send("오류 발생: " + error.message);
//     }
// });

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
app.use("/auth", userRoutes); // 카카오 인증 관련 라우트
app.use("/auth/kakao", kakaoAuthRouter);

app.use("/", faceApiRoutes); // 얼굴 비교 라우트
app.use("/api/personality", personalityRouter);
app.use("/api/chatrooms", chatRoomRouter); // 채팅방 라우트

// ✅ 기본 라우트
app.get("/", (req, res) => {
  res.send("✅ 카카오 소셜 로그인 서비스 시작!");
});

// ✅ User 모델을 정확히 불러오기
const KakaoUser = require("./models/kakao_profile.js");

// ✅ 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
