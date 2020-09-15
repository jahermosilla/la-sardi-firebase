import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";
import createError from 'http-errors';

export default async function (req: Request, res: Response, next: NextFunction) {
  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")) &&
    !(req.cookies && req.cookies.__session)
  ) {
    return next(createError(403, 'Unauthorized'));
  }

  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else if (req.cookies) {
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    return next(createError(403, "Unauthorized"));
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    (req as any).user = decodedIdToken;
    return next();
  } catch (error) {
    return next(createError(403, "Unauthorized"));
  }
}