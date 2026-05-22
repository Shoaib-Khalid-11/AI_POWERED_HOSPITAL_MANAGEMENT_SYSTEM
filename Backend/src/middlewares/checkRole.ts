import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import type { RoleEnum } from "../types/enums/user.enum";
import { catchAsyncErrors } from "./catchAsyncError";
import ErrorHandler from "./errors";
import { cleanStores } from "better-auth/client";

export const checkRole = (allowedRoles: RoleEnum[]) => {
  return catchAsyncErrors(async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      if (!session) {
        return next(new ErrorHandler("Unauthorized", 401));
      }

      // Check if the user's role is in the allowed list
      // Note: The admin plugin adds the 'role' field to the user object
      const userRole: RoleEnum = (session.user as any).role;

      if (!allowedRoles.includes(userRole)) {
        return next(
          new ErrorHandler("Forbidden: Insufficient Permissions", 403),
        );
      }

      (req as any).user = session.user;
      next();
    } catch (error) {
      new ErrorHandler(`Error checking role: ${error}` || "Server error", 500);
    }
  });
};
