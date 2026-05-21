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
export const updateUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role, password, ...customFields } = req.body;

    const queryId =
      id?.length === 24 ? new mongoose.Types.ObjectId(id as string) : id;
    const collection = mongoose.connection.collection("user");
    const existingUser = await collection.findOne({
      _id: queryId as mongoose.Types.ObjectId,
    });
    if (!existingUser) {
      return next(new ErrorHandler("User not found", 404));
    }
    const updatedPayload = {
      name,
      email,
      role,
      ...customFields,
    };
    // Remove undefine/null keys from the update payload
    Object.keys(updatedPayload).forEach((key) => {
      (updatedPayload[key] === undefined || updatedPayload[key] === null) &&
        delete updatedPayload[key];
    });
    const result = await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(id as string) },
      {
        $set: updatedPayload,
      },
    );
    if (result.matchedCount === 0) {
      return next(new ErrorHandler("User not found", 404));
    }
    res.json({
      message: "User updated successfully",
      updateUser: result,
    });
  } catch (error) {
    next(new ErrorHandler("Server error", 500));
  }
});
