import authorizationMiddleware from "../middlewares/authorization";

import canPlayCard from '../middlewares/player/can-play-card';
import canPass from "../middlewares/player/can-pass";
import canTakeFromDeck from "../middlewares/player/can-take-from-deck";
import getGame from "../middlewares/get-game";
import firebase from 'firebase-admin';

import * as service from '../services/player';

import { NextFunction, Request, Response, Router } from "express";
import { getGameById } from "../services/game";
import getData, { RequestData } from "../lib/helpers";
import setRequestData from "../lib/helpers";

const router = Router();

router
  .use(authorizationMiddleware)
  .post("/player/game/:gameId/card/play", 
    setRequestData(RequestData.GAME), 
    canPlayCard, 
    playCard
  )
  .post("/player/game/:gameId/pass",
    canPass,
    pass
  )
  .post("/player/game/:gameId/deck/take",
    canTakeFromDeck,
    takeFromDeck
  );

async function playCard(req: Request, res: Response, next: NextFunction) {
  try {
    const { card } = req.body;
    const { gameId } = req.params;
    const userId = ((req as any).user as firebase.auth.DecodedIdToken).uid; 
    const game = await getGameById(gameId);

    await service.playCard(card, game, { gameId, userId });
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
    const { gameId } = req.params;
    const userId = ((req as any).user as firebase.auth.DecodedIdToken).uid; 
    await service.takeFromDeck({ gameId, userId });
  } catch (error) {
    next(error);
  }
}

export default router;
