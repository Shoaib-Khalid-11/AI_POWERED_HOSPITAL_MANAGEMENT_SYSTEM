import mongoose, { Document } from "mongoose";

export interface IActivityLog extends Document {
  user: mongoose.Types.ObjectId; // Who did it?
  action: string; // "Created Exam", "Registered Student"
  details?: string;
  createdAt: Date;
}
