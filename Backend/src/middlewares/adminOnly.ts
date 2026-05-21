import { auth } from "../lib/auth";
import { RoleEnum } from "../types/enums";
import { catchAsyncErrors } from "./catchAsyncError";
import ErrorHandler from "./errors";

export const checkAdmin = catchAsyncErrors(async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: req.headers, // 👈 IMPORTANT FIX
  });
  if (!session?.user) {
    return new ErrorHandler("Unauthorized", 401);
  }
  if (session.user.role !== RoleEnum.ADMIN) {
    return new ErrorHandler("Only admin can change roles", 403);
  }
});
