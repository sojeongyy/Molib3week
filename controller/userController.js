const passport = require('passport');

// // ✅ 카카오 로그인 콜백 처리 (컨트롤러) --> userRouter.js에서 이미 사용
// exports.kakaoCallback = passport.authenticate('kakao', {
//     failureRedirect: '/login',
//     successRedirect: '/'
// });

exports.kakaoCallback = (req, res) => {
    console.log(`✅ 로그인 성공! 사용자: ${req.user.nickname}`);
    res.redirect('http://localhost:3000/');  // ✅ 성공 시 메인 페이지로 리다이렉트
};

// ✅ 사용자 데이터 조회 (예제 추가)
const KakaoUser = require('../models/kakao_profile');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await KakaoUser.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: '서버 오류 발생' });
    }
};
// exports.kakaoCallback = (req, res) => {
//     res.json({ message: "카카오 로그인 성공!", user: req.user });
// };