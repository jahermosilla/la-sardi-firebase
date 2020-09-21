import { NextFunction, Request, Response } from "express";
import { RequestData } from "../lib/helpers";
import { IGameNode } from "../lib/interfaces/game";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const data: Map<RequestData, any> = (req as any).data;
  const game: IGameNode = data.get(RequestData.GAME);

  if (Object.keys(game.players).length < 2) {
    return next(new Error("At least two players"));
  }

  next();
}
