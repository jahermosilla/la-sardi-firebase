import authorizationMiddleware from "../middlewares/authorization";
import { NextFunction, Request, Response, Router } from "express";
import * as service from '../services/game';
import canCreate from "../middlewares/game/can-create-game";
import canStart from '../middlewares/game/can-start-game';
import canJoin from "../middlewares/game/can-join-game";
import firebase from "firebase-admin";


const router = Router();

router.use(authorizationMiddleware);

router
  .post("/game", canCreate, create)
  .post("/game/:gameId/join", canJoin, join)
  .post("/game/:gameId/start", canStart, start);


async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const owner = ((req as any).user as firebase.auth.DecodedIdToken).uid;
    const { isPrivate } = req.body;

    console.log('[USER ID]: ', owner);

    const key = await service.create(owner, isPrivate);

    res.json({ key });
  } catch (error) {
    next(error);  
  }
}

async function join(req: Request, res: Response, next: NextFunction) {
  try {
    const playerId = ((req as any).user as firebase.auth.DecodedIdToken).uid;
    const { token } = req.body;

    await service.join(playerId, token);

    res.json({ message: 'OK' });
  } catch (error) {
    next(error);
  }
}

async function start(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId } = req.body;  
    await service.start(gameId);  
  } catch (error) {
    next(error);  
  }
}

export default router;