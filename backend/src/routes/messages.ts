import express from "express";
const router = express.Router();
import MessagesController from "../controllers/messages";

/**
 * get all messages
 */
router.post("/:channel_id/:room_id", MessagesController.getMessages);
/**
 * update a message
 */
router.put("/:message_id");
router.delete("/:message_id");

export default router;
