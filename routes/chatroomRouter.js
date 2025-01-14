const express = require("express");
const { getChatRooms } = require("../controller/chatroomController");

const router = express.Router();

// GET /api/chatrooms/list
router.get("/list", getChatRooms);

module.exports = router;
