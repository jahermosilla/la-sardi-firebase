import { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import * as functions from 'firebase-functions';

export default (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
)  => {
  functions.logger.error(error);
  res.status(error.status || 500).json(error);
};