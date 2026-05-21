import { Router } from "express";
import { getUserByID, updateUser } from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth";

const userRouter = Router();

userRouter.get("/:id", requireAuth, getUserByID);
userRouter.put("/update/:id", requireAuth, updateUser);

export default userRouter;
