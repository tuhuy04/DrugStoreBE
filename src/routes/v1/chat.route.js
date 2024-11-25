import express from "express";
import { chatController } from "../../controllers/chat.controller.js";
import authenticateJWT from '../../middlewares/authenticateJWT.js';

const router = express.Router();

router.post("/send", authenticateJWT, chatController.saveMessage);
router.get("/messages", authenticateJWT, chatController.getMessages);
router.get("/history/:userId", authenticateJWT, chatController.getChatHistory);

export const chatRouter = router;
