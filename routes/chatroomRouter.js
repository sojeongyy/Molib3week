const express = require("express");
const { getChatRoomsByUserId } = require("../controller/chatroomController");
const { aiFeedback } = require("../controller/chatroomController");
//const { isAuthenticated } = require("../middleware/verifyJWT");
const router = express.Router();

// GET /api/chatrooms

router.get("/user", getChatRoomsByUserId);

router.post("/ai-feedback", aiFeedback);

module.exports = router;
