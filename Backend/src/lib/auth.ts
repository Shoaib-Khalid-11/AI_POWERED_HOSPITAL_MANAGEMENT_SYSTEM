import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { MongoClient } from "mongodb";

// import { ac, roles } from "./permissions";
import { RoleEnum } from "../types/enums";
const client = new MongoClient(process.env.MONGODB_URI_LOCAL!);
// await client.connect();
const db = client.db("HOSPITAL_MANAGEMENT_SYSTEM");

export const auth = betterAuth({
  database: mongodbAdapter(db),

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [process.env.FRONT_END || "http://localhost:5173"],

  emailAndPassword: { enabled: true },

  plugins: [
    admin({
      // ac,
      defaultRole: RoleEnum.USER,
      // roles,
      adminRole: ["admin", "superAdmin"],
    }),
  ],
});
