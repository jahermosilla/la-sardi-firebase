import { NextFunction, Request, Response } from "express";
import { GameStatus } from "../lib/enums/game-status";
import { RequestData } from "../lib/helpers";
import createError from "http-errors";

export default (expectedStatus: GameStatus) => async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const data: Map<RequestData, any> = (req as any).data;
  const status: GameStatus = data.get(RequestData.GAMESTATUS);

  console.log(status, data);

  if (status !== expectedStatus) {
    return next(
      createError(400, "Game status is not valid for the operation")
    );
  }

  next();
}
