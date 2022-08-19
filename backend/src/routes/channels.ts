import express from "express";
const router = express.Router();
import UsersController from "../controllers/users";
import Validators from "../validators";
import asyncHandler from "express-async-handler";
import ChannelsController from "../controllers/channels";
import AuthMiddleware from "../middlewares/auth";

router.use(AuthMiddleware.authenticate());
router.post(
  "/",
  Validators.validateChannelAdd(),
  Validators.validationResult,
  asyncHandler(ChannelsController.createChannel)
);
router.get("/", asyncHandler(ChannelsController.getPublicChannels));
router.get("/:channel_id", asyncHandler(ChannelsController.getChannel));
router.get("/:channel_id/members", asyncHandler(ChannelsController.getMembers));
router.get("/:channel_id/rooms", asyncHandler(ChannelsController.getRooms));

router.put("/:channel_id", asyncHandler(ChannelsController.updateChannel));
router.delete("/:channel_id", asyncHandler(ChannelsController.deleteChannel));
export default router;
