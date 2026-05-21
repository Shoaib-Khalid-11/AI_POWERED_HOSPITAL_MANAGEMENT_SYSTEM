import type { Request, Response, NextFunction, RequestHandler } from "express";

export const catchAsyncErrors = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
