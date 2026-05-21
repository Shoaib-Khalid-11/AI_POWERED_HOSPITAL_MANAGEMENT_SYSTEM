import { Router } from "express";
import {
  createUser,
  getUserByID,
  setUserRoleByID,
} from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth";
import { checkRole } from "../middlewares/checkRole";
import { RoleEnum } from "../types/enums";

const router = Router();

router.post(
  "/create",
  //   requireAuth,
  //   checkRole([RoleEnum.DOCTOR, RoleEnum.NURSE, RoleEnum.ADMIN]),
  createUser,
);
router.get("/:id", requireAuth, checkRole([RoleEnum.ADMIN]), getUserByID);
router.put(
  "/set-role",
  requireAuth,
  checkRole([RoleEnum.ADMIN]),
  setUserRoleByID,
);
// router.get("/all", getAllUsers);

export default router;
