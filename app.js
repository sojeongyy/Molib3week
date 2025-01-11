require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const { connectDB, mongoose } = require('./config/db'); // MongoDB 연결
const userRoutes = require('./routes/userRouter.js'); // 사용자 라우트
const passport = require('passport');
const UserSchema = require('./models/User');
const kakaoAuthRouter = require('./auth/kakao');
require('./passport/index');  // Passport 설정 파일 로드

const app = express();
connectDB();
//passport(app);

// ✅ 세션 설정 (순서 중요: session → passport.initialize → passport.session)
app.use(session({ 
    secret: process.env.SESSION_SECRET || 'mySecretKey', 
    resave: false, 
    saveUninitialized: true 
}));

// ✅ 미들웨어 등록
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// ✅ 사용자 라우트 연결
app.use('/auth', userRoutes);  // 카카오 인증 관련 라우트
app.use('/auth/kakao', kakaoAuthRouter);
app.use('/users', userRoutes);  // 일반 사용자 관련 라우트

// ✅ 기본 라우트
app.get('/', (req, res) => {
    res.send('✅ 카카오 소셜 로그인 서비스 시작!');
});

// ✅ User 모델을 정확히 불러오기
const User = require('./models/User');

// ✅ 데이터 추가 (스키마 반영)
app.get('/add-user', async (req, res) => {
    try {
        const newUser = new User({
            name: "Alice",
            nickname: "Ali",   // ✅ nickname 추가
            email: "alice@example.com",
            passwordHash: "123456"   // ✅ passwordHash 추가
        });
        await newUser.save();
        console.log("✅ 사용자 추가 및 스키마 반영 완료!");
        res.send("✅ 사용자 추가 및 스키마 반영 완료!");
    } catch (error) {
        console.error("❌ 데이터 추가 실패:", error.message);
        res.status(500).send("❌ 데이터 추가 실패: " + error.message);
    }
});

// ✅ 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
