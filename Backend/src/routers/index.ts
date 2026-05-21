import express from "express";
import authRouter from "./auth.router.ts";
import userRouter from "./user.router.ts";
const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
export default router;
