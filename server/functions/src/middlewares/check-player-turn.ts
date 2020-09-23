import firebase from 'firebase-admin';
import { NextFunction, Request, Response } from "express";
import { RequestData } from "../lib/helpers";
import { IGameNode } from "../lib/interfaces/game";
import createError from "http-errors";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const data: Map<RequestData, any> = (req as any).data;
  const game: IGameNode = data.get(RequestData.GAME);
  const userId = ((req as any).user as firebase.auth.DecodedIdToken).uid;

  if (game.state.turn !== userId) {
    return next(createError(400, "Not your turn"));
  }

  next();
}
