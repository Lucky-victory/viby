import asyncHandler from "express-async-handler";
import express from "express";
import ChannelsController from "../controllers/channels";
import AuthMiddleware from "../middlewares/auth";
const router = express.Router();

router.use(AuthMiddleware.authenticate());
router.get("/@me");
router.get("/channels", asyncHandler(ChannelsController.getChannelsForUser));
router.post("/update-picture");
router.post("/update-cover");
router.post("/update-profile");

export default router;
