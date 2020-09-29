import { NextFunction, Request, Response } from "express";
import { RequestData } from "../lib/helpers";
import createError from "http-errors";
import { getGameByToken } from "../services/game";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { token } = req.body;

  const snapshot = await getGameByToken(token);

  const wrapper = snapshot.val();
  const gameId = Object.keys(wrapper || {})[0];
  console.log(token, gameId);

  if (!gameId) {
    return next(createError(400, 'NO game found matching token'));
  }

  const game = wrapper[gameId];
  console.log(game);
  const map : Map<RequestData, any> = new Map;
  map.set(RequestData.GAME, game);

  req.body.gameId = gameId;
  (req as any).data = new Map([...((req as any).data || []), ...map]);

  next();
}
