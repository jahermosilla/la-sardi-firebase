import * as service from '../services/game';

import firebase from "firebase-admin";

import authorizationMiddleware from "../middlewares/authorization";
import checkIfOwner from '../middlewares/check-if-owner';
import checkIfPlaying from '../middlewares/check-if-playing';
import checkGameStatus from "../middlewares/check-game-status";
import checkPlayersNumber from "../middlewares/check-players-number";
import checkMaxPlayersNumber from '../middlewares/check-max-players-number';
import findGameByToken from '../middlewares/find-game-by-token';
import checkPlayerAlreadyInGame from '../middlewares/check-player-already-in-game';

import setRequestData, { RequestData } from "../lib/helpers";
import { ICard, IGameNode } from "../lib/interfaces/game";
import { NextFunction, Request, Response, Router } from "express";
import { GameStatus } from '../lib/enums/game-status';


const router = Router();

router.use(authorizationMiddleware);

router
  .post(
    "/game",
    setRequestData(RequestData.PLAYERGAME),
    checkIfPlaying,
    create
  )
  .post(
    "/game/private/join",
    findGameByToken,
    setRequestData(
      RequestData.PLAYERGAME,
      RequestData.GAMESTATUS
    ),
    checkIfPlaying,
    checkGameStatus(GameStatus.NOT_STARTED),
    checkPlayerAlreadyInGame,
    checkMaxPlayersNumber,
    join
  )
  .post(
    "/game/:gameId/join",
    setRequestData(
      RequestData.PLAYERGAME,
      RequestData.GAMESTATUS
    ),
    checkIfPlaying,
    checkGameStatus(GameStatus.NOT_STARTED),
    checkPlayerAlreadyInGame,
    checkMaxPlayersNumber,
    join
  )
  .post(
    "/game/:gameId/start",
    setRequestData(
      RequestData.GAME,
      RequestData.DECK,
      RequestData.GAMESTATUS
    ),
    checkIfOwner,
    checkPlayersNumber,
    checkGameStatus(GameStatus.NOT_STARTED),
    start
  );


async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const owner = ((req as any).user as firebase.auth.DecodedIdToken).uid;
    const { isPrivate, qtt } = req.body;

    const key = await service.create({ owner, isPrivate, qtt });

    res.json({ key });
  } catch (error) {
    next(error);
  }
}

async function join(req: Request, res: Response, next: NextFunction) {
  try {
    const playerId = ((req as any).user as firebase.auth.DecodedIdToken).uid;
    const { gameId } = req.body;

    await service.join(playerId, gameId);

    res.json({ key: gameId });
  } catch (error) {
    next(error);
  }
}

async function start(req: Request, res: Response, next: NextFunction) {
  try {
    const data: Map<RequestData, any> = (req as any).data;
    const game: IGameNode = data.get(RequestData.GAME);
    const deck: Array<ICard> = data.get(RequestData.DECK);
    const { gameId } = req.params;

    await service.start(gameId, { game, deck });

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    next(error);  
  }
}

export default router;