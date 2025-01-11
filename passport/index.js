

const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const KakaoUser = require('../models/kakao_profile');

// ✅ Passport 전략 설정 (함수 호출 X)
passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    callbackURL: process.env.KAKAO_REDIRECT_URI
}, async (accessToken, refreshToken, profile, done) => {
    try {
                const exUser = await KakaoUser.findOne({ 
            $or: [
                { snsId: profile.id },
                { email: profile._json.kakao_account.email }
            ]
        });

        if (exUser) {
            return done(null, exUser);
        } else {
            const newUser = await KakaoUser.create({
                email: profile._json.kakao_account.email,
                nickname: profile.displayName,
                snsId: profile.id,
                providerType: 'kakao',
            });
            return done(null, newUser);
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
        console.log(`🔑 세션 복구 사용자: ${user.nickname}`);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// ✅ 객체로 내보내기 (함수 아님)
module.exports = passport;
