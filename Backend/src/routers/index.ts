import express from "express";
import authRouter from "./auth.router.ts";
import userRouter from "./user.router.ts";
import activityLogRouter from "./activity.router.ts";
const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/activity-logs", activityLogRouter);
export default router;
