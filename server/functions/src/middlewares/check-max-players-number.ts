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

  const maxPlayers = game.properties.qtt.players;
  const actualPlayers = Object.keys(game.players || {}).length;

  if (actualPlayers === maxPlayers) {
    return next(createError(400, 'Game is full'));
  }

  next();
}
