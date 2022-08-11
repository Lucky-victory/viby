import express from "express";
const router = express.Router();

router.get("/@me");
router.post("/update-picture");
router.post("/update-cover");
router.post("/update-profile");

export default router;
