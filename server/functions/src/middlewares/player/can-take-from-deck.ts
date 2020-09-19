import { NextFunction, Request, Response } from "express";
// import firebase from "firebase-admin";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // @TODO: Create logic
  next();
}
