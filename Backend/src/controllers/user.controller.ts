import mongoose from "mongoose";
import { catchAsyncErrors } from "../middlewares/catchAsyncError";
import ErrorHandler from "../middlewares/errors.ts";

export const getUserByID = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    // Check permissions: A user can view their own profile,
    // or Admins/Medical staff can view patient profiles.
    if (currentUser.id !== id && currentUser.role === "patient") {
      return next(new ErrorHandler("Forbidden", 403));
    }

    const queryId =
      id?.length === 24 ? new mongoose.Types.ObjectId(id as string) : id;
    const collection = mongoose.connection.collection("user");
    const user = await collection.findOne(
      { _id: queryId as mongoose.Types.ObjectId },
      { projection: { password: 0 } },
    );
    console.log(queryId);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.json(user);
  } catch (error) {
    next(new ErrorHandler("Server error", 500));
  }
});
