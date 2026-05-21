import type { Request, Response, NextFunction } from "express";

/* =========================
   Custom Error Class
========================= */
class ErrorHandler extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperational = true;

    // Error.captureStackTrace(this, this.constructor);
  }
}

/* =========================
   App Error Type
========================= */
interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  code?: number;
  keyValue?: Record<string, any>;
  path?: string;
  errors?: Record<string, { message: string }>;
}

/* =========================
   Normalize Specific Errors
========================= */
const handleSpecificErrors = (err: AppError): ErrorHandler => {
  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : "field";

    return new ErrorHandler(
      `Duplicate value for ${field}. Please use another value.`,
      400,
    );
  }

  // JWT invalid
  if (err.name === "JsonWebTokenError") {
    return new ErrorHandler("Invalid token. Please login again.", 401);
  }

  // JWT expired
  if (err.name === "TokenExpiredError") {
    return new ErrorHandler("Your token has expired. Please login again.", 401);
  }

  // CastError (invalid Mongo ID)
  if (err.name === "CastError") {
    return new ErrorHandler(`Invalid ${err.path}: ${err.message}`, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError" && err.errors) {
    const errors = Object.values(err.errors).map((el) => el.message);

    return new ErrorHandler(`Invalid input data: ${errors.join(". ")}`, 400);
  }

  // fallback: unknown error
  return new ErrorHandler(err.message, 500);
};

/* =========================
   Global Error Middleware
========================= */
export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = handleSpecificErrors(err);

  const statusCode = error.statusCode || 500;

  // Development mode
  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      success: false,
      status: error.status,
      message: error.message,
      // stack: error.stack,
      error,
    });
  }

  // Production mode
  if (error.isOperational) {
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }

  console.error("💥 UNEXPECTED ERROR:", err);

  return res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
};
export default ErrorHandler;
