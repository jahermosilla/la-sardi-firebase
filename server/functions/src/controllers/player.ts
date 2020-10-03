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
import checkGameStatus from '../middlewares/check-game-status';
import { GameStatus } from '../lib/enums/game-status';

const router = Router();

router
  .use(authorizationMiddleware)
  .post(
    "/player/game/:gameId/card/play",
    setRequestData(
      RequestData.HAND,
      RequestData.GAME,
      RequestData.DECK,
      RequestData.GAMESTATUS
    ),
    checkGameStatus(GameStatus.PLAYING),
    checkCardInHand,
    checkPlayerTurn,
    canPlayCard,
    playCard
  )
  .post(
    "/player/game/:gameId/pass",
    // eslint-disable-next-line
    setRequestData(
      RequestData.GAME,
      RequestData.DECK,
      RequestData.GAMESTATUS
    ),
    checkGameStatus(GameStatus.PLAYING),
    checkPlayerTurn,
    checkDeckEmpty(true),
    pass
  )
  .post(
    "/player/game/:gameId/deck/take",
    setRequestData(
      RequestData.GAME,
      RequestData.DECK,
      RequestData.HAND,
      RequestData.GAMESTATUS
    ),
    checkGameStatus(GameStatus.PLAYING),
    checkPlayerTurn,
    checkDeckEmpty(false),
    takeFromDeck
  );

async function playCard(req: Request, res: Response, next: NextFunction) {
  try {
    const { card } = req.body;
    const { gameId } = req.params;

    const data: Map<RequestData, any> = (req as any).data;
    const game: IGameNode = data.get(RequestData.GAME);
    const hand: Array<ICard> = data.get(RequestData.HAND);
    const deck: Array<ICard> = data.get(RequestData.DECK);

    const userId = ((req as any).user as firebase.auth.DecodedIdToken).uid;

    await service.playCard(card, { gameId, userId, game, hand, deck });

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}

async function pass(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId } = req.params;
    const userId = ((req as any).user as firebase.auth.DecodedIdToken).uid;

    await service.pass({ gameId, userId });

    res.json({ ok: true });
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

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}

export default router;
