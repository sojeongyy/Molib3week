// 몽고디비 구성 파일 생성성

/* config/mongo-db.js */

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB에 연결되었습니다.');
    } catch (error) {
        console.error('⛔ MongoDB 연결 실패:', error);
        process.exit(1); // 서버 종료
    }
};



module.exports = {
    connectDB,
    mongoose
};