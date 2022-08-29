import express from "express";
const router = express.Router();
import UsersController from "../controllers/users";
import Validators from "../validators";
import asyncHandler from 'express-async-handler';

router.post(
  "/",
  Validators.validateSignIn(),
  Validators.validationResult,asyncHandler(
  UsersController.loginUser)
);

export default router;
