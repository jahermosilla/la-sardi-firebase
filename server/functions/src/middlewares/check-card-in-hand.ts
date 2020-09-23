import { NextFunction, Request, Response } from "express";
import { RequestData } from "../lib/helpers";
import { ICard } from "../lib/interfaces/game";
import createError from "http-errors";
import transformInstance from "../lib/helpers/transform-instance";
import Card from "../lib/card";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const data: Map<RequestData, any> = (req as any).data;
  const hand: Array<ICard> = data.get(RequestData.HAND);

  
  const { card }: { card: ICard } = req.body;
  const cardIndex = hand
    .map(c => transformInstance(c, new Card))
    .findIndex(card.equals.bind(card));
  
  if (cardIndex < 0) {
    return next(createError(400, "You cant play a card you dont own"));
  }

  next();
}
