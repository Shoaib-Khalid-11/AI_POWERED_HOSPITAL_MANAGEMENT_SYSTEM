import express from "express";
import { requireAuth } from "../middlewares/auth";
import {
  addActivityLog,
  getActivityLogs,
} from "../controllers/activity.controller";
import { checkRole } from "../middlewares/checkRole";
import { RoleEnum } from "../types/enums";

const activityLogRouter = express.Router();
activityLogRouter.get(
  "/all",
  requireAuth,
  checkRole([RoleEnum.ADMIN]),
  getActivityLogs,
);

activityLogRouter.post("/create", requireAuth, addActivityLog);

export default activityLogRouter;
