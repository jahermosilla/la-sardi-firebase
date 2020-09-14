import { NextFunction, Request, Response } from "express";
import firebase from "firebase-admin";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = ((req as any).user as firebase.auth.DecodedIdToken).uid;

  const hasGame = (await firebase.database().ref(`users/${userId}`).child('game').once('value')).val() !== null;

  if (hasGame) {
    return next(new Error('You cant create game if youre yet playing'));
  }

  next();
}
