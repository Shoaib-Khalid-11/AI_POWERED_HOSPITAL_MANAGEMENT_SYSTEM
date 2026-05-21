import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import type { RoleEnum } from "../types/enums/user.enum";
import { catchAsyncErrors } from "./catchAsyncError";
import ErrorHandler from "./errors";

export const checkRole = (allowedRoles: RoleEnum[]) => {
  return catchAsyncErrors(async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session) {
        // return res.status(401).json({ message: "Unauthorized" });
        return new ErrorHandler("Unauthorized", 401);
      }

      // Check if the user's role is in the allowed list
      // Note: The admin plugin adds the 'role' field to the user object
      const userRole = (session.user as any).role;

      if (!allowedRoles.includes(userRole)) {
        // return res
        //   .status(403)
        //   .json({ message: "Forbidden: Insufficient Permissions" });
        return new ErrorHandler("Forbidden: Insufficient Permissions", 403);
      }

      (req as any).user = session.user;
      next();
    } catch (error) {
      new ErrorHandler(`Error checking role: ${error}` || "Server error", 500);
    }
  });
};
