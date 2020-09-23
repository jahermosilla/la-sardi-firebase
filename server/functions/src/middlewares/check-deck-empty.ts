import { NextFunction, Request, Response } from "express";
import { RequestData } from "../lib/helpers";
import { ICard } from "../lib/interfaces/game";
import createError from "http-errors";

export default (shouldBeEmpty: boolean) => async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const data: Map<RequestData, any> = (req as any).data;
  const deck: Array<ICard> = data.get(RequestData.DECK) || [];

  if (shouldBeEmpty && deck.length > 0) {
    return next(createError(400, 'Deck is not empty'));
  }

  if (!shouldBeEmpty && deck.length === 0) {
    return next(createError(400, "Deck is empty"));
  }

  next();
}
