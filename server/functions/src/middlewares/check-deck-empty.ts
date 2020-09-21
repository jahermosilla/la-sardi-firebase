import { NextFunction, Request, Response } from "express";
import { RequestData } from "../lib/helpers";
import { ICard } from "../lib/interfaces/game";

export default (shouldBeEmpty: boolean) => async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const data: Map<RequestData, any> = (req as any).data;
  const deck: Array<ICard> = data.get(RequestData.DECK) || [];

  if (shouldBeEmpty && deck.length > 0) {
    return next(new Error('Deck is not empty'));
  }

  if (!shouldBeEmpty && deck.length === 0) {
    return next(new Error("Deck is empty"));
  }

  next();
}
