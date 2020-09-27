import { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";

export default (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
)  => res.status(error.status || 500).json(error);