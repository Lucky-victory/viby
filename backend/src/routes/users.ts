import asyncHandler from "express-async-handler";
import express from "express";
import ChannelsController from "../controllers/channels";
import AuthMiddleware from "../middlewares/auth";
import UsersController from "../controllers/users";
const router = express.Router();

router.use(AuthMiddleware.authenticate());
router.get("/", UsersController.getUserProfile);
router.get("/others/:user_id", asyncHandler(UsersController.getUser));
router.get("/channels", asyncHandler(ChannelsController.getChannelsForUser));
router.get("/friends", asyncHandler(UsersController.getFriends));
router.get("/messages", asyncHandler(UsersController.getDirectMessages));
router.post("/update-profile", asyncHandler(UsersController.updateProfile));

export default router;
