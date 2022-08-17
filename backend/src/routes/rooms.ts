import express from "express";
const router = express.Router();
import RoomsController from "../controllers/rooms";
import AuthMiddleware from "../middlewares/auth";

// add an authentication middleware to all routes;
router.use(AuthMiddleware.authenticate());
/**
 * create new room
 */
router.post("/:channel_id", RoomsController.createRoom);
/**
 * update a room info
 */
router.put("/:room_id");
router.delete("/:room_id");

export default router;
