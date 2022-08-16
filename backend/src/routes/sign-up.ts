import express from "express";
const router = express.Router();
import UsersController from "../controllers/users";

router.get("/sign-up", UsersController.createNewUser);
router.get("/sign-up/:id", UsersController.getUsername);

export default router;
