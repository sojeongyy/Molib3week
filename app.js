require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('./config/db'); // MongoDB 연결
const userRoutes = require('./routes/userRouter.js'); // 사용자 라우트
const passport = require('passport');
require('./passport/index');  // Passport 설정 파일 로드

const app = express();

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
app.use('/users', userRoutes);  // 일반 사용자 관련 라우트

// ✅ 기본 라우트
app.get('/', (req, res) => {
    res.send('✅ 카카오 소셜 로그인 서비스 시작!');
});

// ✅ 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
