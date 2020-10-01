import { NextFunction, Request, Response } from "express";
import { checkCard } from "../services/player";
import createError from 'http-errors';
import { RequestData } from "../lib/helpers";
import { IGameNode } from "../lib/interfaces/game";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { body: { card } } = req as any;
  // const userId = ((req as any).user as firebase.auth.DecodedIdToken).uid;
  const data: Map<RequestData, any> = (req as any).data;
  const game: IGameNode = data.get(RequestData.GAME);
  
  // if (!checkTurn(userId, game.state)) {
  //   next(createError(400, "Is not your turn"));
  // }

  if (!checkCard(card, game.state)) {
    next(createError(400, "Card is not playable"));
  }

  next();
}
