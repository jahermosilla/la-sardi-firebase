import { NextFunction, Request, Response } from "express";
import firebase from "firebase-admin";
import { checkCard, checkTurn } from "../../services/player";
// import firebase from "firebase-admin";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = ((req as any).user as firebase.auth.DecodedIdToken).uid;
  const { game, body: { card } } = req as any;

  if (!checkTurn(userId, game.state)) {
    next(new Error("Is not your turn"));
  }

  if (!checkCard(card, game.state)) {
    next(new Error("Card is not playable"));
  }

  next();
}
