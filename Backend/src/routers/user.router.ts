import { Router } from "express";
import {
  getAllUsers,
  getUserByID,
  updateUser,
} from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth";
import { checkRole } from "../middlewares/checkRole";
import { RoleEnum } from "../types/enums";

const userRouter = Router();

userRouter.get(
  "/allusers",
  requireAuth,
  checkRole([RoleEnum.ADMIN, RoleEnum.DOCTOR, RoleEnum.NURSE]),
  getAllUsers,
);
userRouter.get("/:id", requireAuth, getUserByID);
userRouter.put(
  "/update/:id",
  requireAuth,
  checkRole([RoleEnum.ADMIN, RoleEnum.DOCTOR, RoleEnum.NURSE]),
  updateUser,
);

export default userRouter;
