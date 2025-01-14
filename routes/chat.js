// routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const chatMessageController = require("../controller/chatMessageController");

// Route to save a chat message
router.post("/messages", chatMessageController.saveMessage);

// Route to get all chat messages
router.get("/messages", chatMessageController.getAllMessages);

// Route to delete a specific chat message
router.delete("/messages/:id", chatMessageController.deleteMessage);

module.exports = router;
