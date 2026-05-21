import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { catchAsyncErrors } from "./catchAsyncError";
import ErrorHandler from "./errors";

export const requireAuth = catchAsyncErrors(async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    (req as any).session = session; // Attach session to request object
    (req as any).user = session.user; // Attach user to request object
    next();
  } catch (error) {
    new ErrorHandler("Unauthorized", 401);
  }
});
