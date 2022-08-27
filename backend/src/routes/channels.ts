import express from "express";
const router = express.Router();

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

router.post("/search", asyncHandler(ChannelsController.searchChannels));
router.get("/", asyncHandler(ChannelsController.getPublicChannels));
router.get("/:channel_id", asyncHandler(ChannelsController.getChannel));
router.get("/:channel_id/members", asyncHandler(ChannelsController.getMembers));
router.post(
  "/:channel_id/member",
  asyncHandler(ChannelsController.checkMember)
);
router.get("/:channel_id/rooms", asyncHandler(ChannelsController.getRooms));
router.get(
  "/:channel_id/join",
  asyncHandler(ChannelsController.addMemberToChannel)
);
router.post(
  "/:channel_id/leave",
  asyncHandler(ChannelsController.removeMemberFromChannel)
);

router.put("/:channel_id", asyncHandler(ChannelsController.updateChannel));
router.delete("/:channel_id", asyncHandler(ChannelsController.deleteChannel));
export default router;
