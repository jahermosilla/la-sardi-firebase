import firebase from 'firebase-admin';

import authorizationMiddleware from "../middlewares/authorization";
import checkCardInHand from "../middlewares/check-card-in-hand";
import checkPlayerTurn from "../middlewares/check-player-turn";
import checkDeckEmpty from "../middlewares/check-deck-empty";
import canPlayCard from '../middlewares/can-play-card';

import * as service from '../services/player';

import { NextFunction, Request, Response, Router } from "express";
import { ICard, IGameNode } from "../lib/interfaces/game";
import setRequestData, { RequestData } from "../lib/helpers";

const router = Router();

router
  .use(authorizationMiddleware)
  .post(
    "/player/game/:gameId/card/play",
    setRequestData(RequestData.HAND),
    checkCardInHand,
    setRequestData(RequestData.GAME),
    checkPlayerTurn,
    canPlayCard,
    playCard
  )
  .post(
    "/player/game/:gameId/pass",
    setRequestData(RequestData.GAME),
    checkPlayerTurn,
    setRequestData(RequestData.DECK),
    checkDeckEmpty(true),
    pass
  )
  .post(
    "/player/game/:gameId/deck/take",
    setRequestData(RequestData.GAME),
    checkPlayerTurn,
    setRequestData(RequestData.DECK),
    checkDeckEmpty(false),
    setRequestData(RequestData.HAND),
    takeFromDeck
  );

async function playCard(req: Request, res: Response, next: NextFunction) {
  try {
    const { card } = req.body;
    const { gameId } = req.params;

    const data: Map<RequestData, any> = (req as any).data;
    const game: IGameNode = data.get(RequestData.GAME);
    const hand: Array<ICard> = data.get(RequestData.HAND);

    const userId = ((req as any).user as firebase.auth.DecodedIdToken).uid;

    await service.playCard(card, { gameId, userId, game, hand });
  } catch (error) {
    next(error);
  }
}

async function pass(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId } = req.params;
    const userId = ((req as any).user as firebase.auth.DecodedIdToken).uid;

    await service.pass({ gameId, userId });
  } catch (error) {
    next(error);
  }
}

async function takeFromDeck(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = ((req as any).user as firebase.auth.DecodedIdToken).uid;
    const data: Map<RequestData, any> = (req as any).data;
    const game: IGameNode = data.get(RequestData.GAME);
    const deck: Array<ICard> = data.get(RequestData.DECK);
    const hand: Array<ICard> = data.get(RequestData.HAND);

    const { gameId } = req.params;
    await service.takeFromDeck({ gameId, userId, deck, game, hand });
  } catch (error) {
    next(error);
  }
}

export default router;
