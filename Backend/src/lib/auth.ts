import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI_LOCAL;
if (!uri) {
  throw new Error("MONGODB_URI_LOCAL is not defined");
}
const client = new MongoClient(process.env.MONGODB_URI_LOCAL!);
// await client.connect();
const db = client.db("HOSPITAL_MANAGEMENT_SYSTEM");

export const auth = betterAuth({
  database: mongodbAdapter(db),

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173"],

  emailAndPassword: { enabled: true },

  plugins: [
    admin({
      // ac,
      defaultRole: "patient",
      // roles,
      adminRole: ["admin", "superAdmin"],
    }),
  ],
  user: {
    additionalFields: {
      specialization: {
        type: "string",
        required: false, // Only for doctors
      },
      department: {
        type: "string",
        required: false,
      },
      gender: {
        type: "string",
        required: false,
      },
      bloodgroup: {
        type: "string",
        required: false,
      },
      medicalHistory: {
        type: "string",
        required: false,
      },
      age: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "active",
      },
      prescriptions: {
        type: "string[]",
        required: false,
      },
      appointments: {
        type: "string[]",
      },
    },
  },
});
