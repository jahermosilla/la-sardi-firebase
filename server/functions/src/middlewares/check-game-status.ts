import { NextFunction, Request, Response } from "express";
import { GameStatus } from "../lib/enums/game-status";
import { RequestData } from "../lib/helpers";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const data: Map<RequestData, any> = (req as any).data;
  const status: GameStatus = data.get(RequestData.GAMESTATUS);

  if (status !== GameStatus.NOT_STARTED) {
    return next(
      new Error("You cant join a game whose status is playing or finished")
    );
  }

  next();
}
