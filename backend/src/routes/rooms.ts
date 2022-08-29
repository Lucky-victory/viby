import express from "express";
const router = express.Router();
import RoomsController from "../controllers/rooms";
import AuthMiddleware from "../middlewares/auth";
import asyncHandler from "express-async-handler";
import Validators from "../validators";

// add an authentication middleware to all routes;
router.use(AuthMiddleware.authenticate());
/**
 * create new room
 */
router.post(
  "/:channel_id",
  Validators.validateRoomAdd(),
  Validators.validationResult,
  asyncHandler(RoomsController.createRoom)
);
router.get("/:room_id/members", asyncHandler(RoomsController.getMembers));
router.post("/:room_id/member", asyncHandler(RoomsController.checkMember));
router.get("/:room_id/join", asyncHandler(RoomsController.addMemberToRoom));
router.get("/:room_id", asyncHandler(RoomsController.getRoom));
router.post(
  "/:room_id/leave",
  asyncHandler(RoomsController.removeMemberFromRoom)
);

/**
 * update a room info
 */
router.put("/:room_id", asyncHandler(RoomsController.updateRoom));
router.delete("/:room_id", asyncHandler(RoomsController.deleteRoom));

export default router;
