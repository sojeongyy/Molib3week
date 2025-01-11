// const passport = require('passport');
// const KakaoStrategy = require('passport-kakao').Strategy;
// const User = require('../models/User');

// // ✅ CommonJS 방식으로 내보내기
// module.exports = (app) => {
//     // ✅ Passport 초기화
//     app.use(passport.initialize());
//     app.use(passport.session());

//     // ✅ KakaoStrategy 설정
//     passport.use(new KakaoStrategy({
//             clientID: process.env.KAKAO_CLIENT_ID,
//             callbackURL: process.env.KAKAO_REDIRECT_URI
//         },
//         async (accessToken, refreshToken, profile, done) => {
//             try {
//                 const exUser = await User.findOne({ snsId: profile.id });
//                 if (exUser) {
//                     return done(null, exUser);
//                 } else {
//                     const newUser = await User.create({
//                         email: profile._json.kakao_account.email,
//                         nickname: profile.displayName,
//                         snsId: profile.id,
//                         providerType: 'kakao',
//                     });
//                     return done(null, newUser);
//                 }
//             } catch (error) {
//                 console.error(error);
//                 return done(error);
//             }
//         }
//     ));

//     // ✅ 세션 직렬화 (serializeUser)
//     passport.serializeUser((user, done) => {
//         done(null, user.id);
//     });

//     // ✅ 세션 역직렬화 (deserializeUser)
//     passport.deserializeUser(async (id, done) => {
//         try {
//             const user = await User.findById(id);
//             done(null, user);
//         } catch (error) {
//             done(error);
//         }
//     });
// };

const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/User');

// ✅ Passport 전략 설정 (함수 호출 X)
passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    callbackURL: process.env.KAKAO_REDIRECT_URI
}, async (accessToken, refreshToken, profile, done) => {
    try {
                const exUser = await User.findOne({ 
            $or: [
                { snsId: profile.id },
                { email: profile._json.kakao_account.email }
            ]
        });

        if (exUser) {
            return done(null, exUser);
        } else {
            const newUser = await User.create({
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
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// ✅ 객체로 내보내기 (함수 아님)
module.exports = passport;
