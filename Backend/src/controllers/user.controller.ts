import mongoose from "mongoose";
import { catchAsyncErrors } from "../middlewares/catchAsyncError";
import ErrorHandler from "../middlewares/errors.ts";
import { logActivity } from "../lib/activity.ts";

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
    await logActivity((req as any).user.id, "updateUser", `User updated ${id}`);
    res.json({
      message: "User updated successfully",
      updateUser: result,
    });
  } catch (error) {
    next(new ErrorHandler("Server error", 500));
  }
});
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  try {
    //  Pagination Params (Default: Page 1, Limit 10)
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
    const skip = (page - 1) * limit;
    const filter: any = {};
    const role = req.query.role as string;
    // Only add role to filter if it exists and isn't empty/all
    if (role && role !== "all" && role !== "") {
      filter.role = role;
    }

    const collection = mongoose.connection.collection("user");
    // total count for pagination
    const totalUsers = await collection.countDocuments(filter);
    const users = await collection
      .find(
        filter, // 👈 Just pass the filter directly now
        {
          projection: {
            password: 0,
            headers: 0,
            emailVerified: 0,
          },
        },
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    res.json({
      res: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalData: totalUsers,
        limit,
      },
    });
  } catch (error) {
    next(new ErrorHandler("Server error", 500));
  }
});
