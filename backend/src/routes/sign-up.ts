import express from "express";
const router = express.Router();
import UsersController from "../controllers/users";
import Validators from "../validators";

router.post(
  "/",
  Validators.validateSignUp(),
  Validators.validationResult,
  UsersController.createNewUser
);

export default router;
