import { NextFunction, Request, Response } from "express";
import { RequestData } from "../lib/helpers";
import createError from "http-errors";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const data: Map<RequestData, any> = (req as any).data;
  const isPlaying: boolean = !!data.get(RequestData.PLAYERGAME);

  if (isPlaying) {
    return next(createError(400, "You cant create game if youre yet playing"));
  }

  next();
}
