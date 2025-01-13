const express = require("express");
const app = express();
const port = 5000;
//const cors = require("cors");  // ✅ CORS 임포트 추가

//app.use(cors());

// ✅ 서버 시작 및 모델 로드
app.listen(port, async () => {
    await loadModels();
    console.log(`서버 실행 중: http://localhost:${port}`);
});
