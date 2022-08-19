import express from "express";
import AuthMiddleware from "../middlewares/auth";
const router = express.Router();

router.use(AuthMiddleware.authenticate());
router.get("/@me");
router.post("/update-picture");
router.post("/update-cover");
router.post("/update-profile");

export default router;
