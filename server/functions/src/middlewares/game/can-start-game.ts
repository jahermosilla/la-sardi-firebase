import { NextFunction, Request, Response } from "express";
import firebase from "firebase-admin";

export default async function (req: Request, res: Response, next: NextFunction) {
  const { gameId } = req.body || {};
  const userId = ((req as any).user as firebase.auth.DecodedIdToken).uid;
  
  if (!gameId) {
    return next(new Error('No gameId'));
  }

  const owner = (await firebase.database().ref('/games').child(gameId).child('owner').once('value')).val();

  if (owner !== userId) {
    return next(new Error('Only the owner can start the game'));
  }

  next();
}