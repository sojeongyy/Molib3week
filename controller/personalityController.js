const UserProfile = require('../models/user_profile.js');

// ✅ 현재 로그인된 사용자의 personality 업데이트
const savePersonality = async (req, res) => {
    // ✅ passport를 사용하여 현재 로그인된 사용자 정보 접근
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: '사용자가 인증되지 않았습니다.' });
    }

    const { personality } = req.body;

    if (!Array.isArray(personality) || personality.length === 0) {
        return res.status(400).json({ message: '유효한 성격 배열을 제공해야 합니다.' });
    }

    try {
        // ✅ 현재 로그인된 사용자를 기준으로 찾기
        const existingUser = await UserProfile.findOne({ userId: req.user.id });

        if (!existingUser) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        // ✅ 기존 personality 업데이트 (중복 제거)
        existingUser.personality = [...new Set([...existingUser.personality, ...personality])];
        await existingUser.save();

        console.log("✅ 성격 업데이트 완료:", existingUser);
        res.status(200).json({ message: '✅ 성격이 성공적으로 업데이트되었습니다!', updatedUser: existingUser });
    } catch (error) {
        console.error("❌ 데이터베이스 오류:", error);
        res.status(500).json({ message: '서버 오류 발생', error });
    }
};

module.exports = { savePersonality };
