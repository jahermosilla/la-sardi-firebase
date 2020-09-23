import { NextFunction, Request, Response } from "express";
import firebase from "firebase-admin";
import { RequestData } from "../lib/helpers";
import { IGameNode } from "../lib/interfaces/game";
import createError from "http-errors";

export default async function (req: Request, res: Response, next: NextFunction) {
  const userId = ((req as any).user as firebase.auth.DecodedIdToken).uid;

  const data: Map<RequestData, any> = (req as any).data;
  const game: IGameNode = data.get(RequestData.GAME);

  if (game.owner !== userId) {
    return next(createError(400, 'Only the owner can start the game'));
  }

  next();
}