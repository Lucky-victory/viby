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
/**
 * update a room info
 */
router.put("/:room_id", asyncHandler(RoomsController.updateRoom));
router.delete("/:room_id", asyncHandler(RoomsController.deleteRoom));

export default router;
