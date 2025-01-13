const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const token = req.cookies.token; // ✅ 쿠키에서 토큰 추출
    if (!token) {
        return res.status(401).json({ message: "인증 토큰이 필요합니다." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); // ✅ 다음 미들웨어 실행
    } catch (error) {
        res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
};

module.exports = verifyJWT;
