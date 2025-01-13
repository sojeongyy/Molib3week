const UserProfile = require('../models/user_profile.js');

// 사용자의 성격 저장
const savePersonality = async (req, res) => {
    const { kakaouserId, personality } = req.body;

    if (!Array.isArray(personality) || personality.length === 0) {
        return res.status(400).json({ message: '유효한 성격 배열을 제공해야 합니다.' });
    }

    try {
        // 기존 유저 확인 후 업데이트
        const updatedUser = await UserProfile.findOneAndUpdate(
            { kakaouser: kakaouserId },
            { $set: { personality: [...new Set(personality)] } }, // 중복 제거 후 업데이트
            { new: true, upsert: true }
        );

        res.status(200).json({ message: '성격 저장 완료!', updatedUser });
    } catch (error) {
        res.status(500).json({ message: '서버 오류 발생', error });
    }
};

module.exports = { savePersonality };
