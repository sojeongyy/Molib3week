

const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const KakaoUser = require('../models/kakao_profile');
const UserProfile = require('../models/user_profile');
const jwt = require('jsonwebtoken');

// ✅ Passport 전략 설정 (함수 호출 X)
passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    callbackURL: process.env.KAKAO_REDIRECT_URI
}, async (accessToken, refreshToken, profile, done) => {
    console.log("✅ Passport KakaoStrategy 실행됨");
    try {
            const exKakaoUser = await KakaoUser.findOne({ 
            $or: [
                { snsId: profile.id },
                { email: profile._json.kakao_account.email }
            ]
        });

        if (exKakaoUser) {
            const token = jwt.sign({ id: exKakaoUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            // 이메일 출력
            console.log(`📧 카카오 이메일: ${profile._json.kakao_account.email}`);
            console.log(`✅ 기존 사용자 로그인: ${exKakaoUser.nickname}`);
            return done(null, exKakaoUser, { token });
        } else {
            console.log("✅ 새로운 사용자 생성 중...");
            const newUser = await KakaoUser.create({
                email: profile._json.kakao_account.email,
                nickname: profile.displayName,
                snsId: profile.id,
                providerType: 'kakao',
            });

            // ✅ 연동된 사용자 프로필 생성
            await UserProfile.create({
                userId: newUser._id,
                username: "새 사용자",
                photo: "/images/people/default_profile.jpeg",
                status: "single",
                similarity: 0,
                intro: "소개 정보 없음",
                ideal: "이상형 정보 없음",
                rating: 0
            });
            // ✅ JWT 발급 및 쿠키 저장 (새 사용자)
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            console.log(`✅ 신규 카카오 사용자 등록: ${newUser.nickname}`);
            // 새로운 사용자일 경우 signup 페이지로 리다이렉트
            return done(null, newUser, { token, redirectToSignup: true });
        }
    } catch (error) {
        console.error(error);
        return done(error);
    }
}));

// ✅ 직렬화 & 역직렬화
passport.serializeUser((user, done) => {
    console.log(`🗂️ 사용자 세션 직렬화: ${user.nickname}`);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await KakaoUser.findById(id);
        if (!user) {
            console.log("❌ 세션 복구 실패: 사용자 정보 없음");
            return done(null, false);  // ✅ 사용자 없을 경우 세션 제거
        }
        console.log(`🔑 세션 복구 사용자: ${user.nickname}`);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// ✅ 객체로 내보내기 (함수 아님)
module.exports = passport;
