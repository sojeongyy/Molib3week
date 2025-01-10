const passport = require('passport');

// ✅ 카카오 로그인 콜백 처리 (컨트롤러)
exports.kakaoCallback = passport.authenticate('kakao', {
    failureRedirect: '/login',
    successRedirect: '/'
});

// ✅ 사용자 데이터 조회 (예제 추가)
const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: '서버 오류 발생' });
    }
};
