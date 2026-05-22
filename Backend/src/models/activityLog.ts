import mongoose, { Schema } from "mongoose";
import type { IActivityLog } from "../types/interface";

const activityLogSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    details: String,
  },
  { timestamps: true },
);
export const ActivityLog = mongoose.model<IActivityLog>(
  "ActivityLog",
  activityLogSchema,
);
