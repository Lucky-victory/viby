import express from "express";
const router = express.Router();
import UsersController from "../controllers/users";
import Validators from "../validators";
import asyncHandler from 'express-async-handler';
import ChannelsController from "../controllers/channels";

router.post(
  "/",
  Validators.validateChannelAdd(),
  Validators.validationResult,asyncHandler(
ChannelsController.createChannel)
);
router.get("/", asyncHandler(ChannelsController.getPublicChannels))
router.get("/:channel_id", asyncHandler(ChannelsController.getChannel))

export default router;
