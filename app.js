require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const { connectDB, mongoose } = require('./config/db'); // MongoDB 연결
const userRoutes = require('./routes/userRouter.js'); // 사용자 라우트
const passport = require('passport');
const cors = require('cors');
const kakaoAuthRouter = require('./auth/kakao');
const cookieParser = require('cookie-parser');
require('./passport/index');  // Passport 설정 파일 로드

const app = express();
connectDB();
//passport(app);

// ✅ CORS 및 미들웨어 등록 (순서 중요)
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ 
    secret: process.env.SESSION_SECRET || 'mySecretKey', 
    resave: false, 
    saveUninitialized: true 
}));
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
const KakaoUser = require('./models/kakao_profile.js');


// ✅ 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
