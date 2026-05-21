import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { catchAsyncErrors } from "../middlewares/catchAsyncError";
import ErrorHandler from "../middlewares/errors.ts";

import type {
  CreateUsersInterface,
  SetUserRoleInterface,
} from "../types/api/index.ts";
import { RoleEnum } from "../types/enums/user.enum.ts";
import { checkAdmin } from "../middlewares/adminOnly.ts";

export const createUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const query = req.body as CreateUsersInterface;
    const { email, password, name, role, data } = query;

    if (!email || !password || !name) {
      next(new ErrorHandler("email, password and name are required", 400));
    }

    const newUser = await auth.api.createUser({
      body: {
        email,
        password,
        name,
        role: role || RoleEnum.USER, // default role
        data: data || {}, // extra custom fields
      },
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error: any) {
    next(new ErrorHandler(error?.message || "Failed to create user", 400));
  }
});

export const getUserByID = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return next(new ErrorHandler("User id is required", 400));
  }

  const user = await auth.api.getUser({
    query: {
      id,
    },
    headers: fromNodeHeaders(req.headers),
  });

  return res.status(200).json({
    success: true,
    user,
  });
});
export const setUserRoleByID = catchAsyncErrors(async (req, res, next) => {
  checkAdmin(req, res, next);
  const query = req.body as SetUserRoleInterface;
  const { id, role } = query;
  if (!id && !role) {
    return next(new ErrorHandler("User id and role are required", 400));
  }

  const user = await auth.api.setRole({
    body: {
      userId: id,
      role: role, // required
    },
    // This endpoint requires session cookies.
    headers: fromNodeHeaders(req.headers),
  });

  return res.status(200).json({
    success: true,
    message: `User role updated successfully to ${role}`,
    user,
  });
});

// export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const query = req.query as QueryInterface;
//     const {
//       searchValue,
//       searchField,
//       searchOperator,
//       limit,
//       offset,
//       sortBy,
//       sortDirection,
//       filterField,
//       filterValue,
//       filterOperator,
//     } = query;

//     const users = await auth.api.listUsers({
//       query: {
//         searchValue,
//         searchField,
//         searchOperator,

//         limit: limit || 10,
//         offset: offset || 0,

//         sortBy: sortBy || "createdAt",
//         sortDirection: sortDirection || "desc",

//         filterField,
//         filterValue,
//         filterOperator,
//       },
//       headers: fromNodeHeaders(req.headers),
//     });
//     const total = users.total || 0;

//     // 🔢 Pagination calculations
//     const totalPages = Math.ceil(total / Number(limit));
//     const currentPage = Math.floor(Number(offset) / Number(limit)) + 1;

//     const nextOffset =
//       Number(offset) + Number(limit) >= total
//         ? null
//         : Number(offset) + Number(limit);

//     const prevOffset =
//       Number(offset) - Number(limit) < 0
//         ? null
//         : Number(offset) - Number(limit);

//     return res.status(200).json({
//       success: true,
//       users: users.users,
//       pagination: {
//         total,
//         limit,
//         offset,

//         totalPages,
//         currentPage,

//         nextOffset,
//         prevOffset,
//       },
//     });
//   } catch (error: any) {
//     next(new ErrorHandler(error?.message || "Bad Request", 400));
//   }
// });
