import { NextFunction, Request, Response } from "express";
import { getGameById } from "../services/game";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const gameId = req.body.gameId || req.params.gameId;

  if (!gameId) {
    return next(new Error('No game id'));
  }

  const game = await getGameById(gameId);

  if (!game) {
    return next(new Error('No game for game id'));  
  }

  (req as any).game = game;
  next();
}