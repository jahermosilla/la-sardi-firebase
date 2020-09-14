import authorizationMiddleware from "../middlewares/authorization";
import { NextFunction, Request, Response, Router } from "express";

import canPlayCard from '../middlewares/player/can-play-card';
import canPass from "../middlewares/player/can-pass";
import canTakeFromDeck from "../middlewares/player/can-take-from-deck";
import getGame from "../middlewares/get-game";

const router = Router();

router.use(authorizationMiddleware);

router
  .post("/player/game/:gameId/card/play", getGame, canPlayCard, playCard)
  .post("/player/game/:gameId/pass", canPass, pass)
  .post("/player/game/:gameId/deck/take", canTakeFromDeck, takeFromDeck);

async function playCard(req: Request, res: Response, next: NextFunction) {}

async function pass(req: Request, res: Response, next: NextFunction) {}

async function takeFromDeck(req: Request, res: Response, next: NextFunction) {}

export default router;
