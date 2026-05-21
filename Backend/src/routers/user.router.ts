import { Router } from "express";
import { getUserByID } from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth";

const userRouter = Router();

userRouter.get("/:id", requireAuth, getUserByID);

export default userRouter;
