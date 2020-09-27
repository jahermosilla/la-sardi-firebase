import firebase from 'firebase-admin';
import { IGameActionOptions } from "../interfaces/game";
import express from 'express';

export default function setRequestData(
  ...types: Array<RequestData>
): express.RequestHandler {
    return async (req, res, next) => {
        try {
            const userId = ((req as any).user as firebase.auth.DecodedIdToken).uid;
            const actions = { ...req.body, ...req.params, userId };
            const data = await getData(actions, ...types);
            (req as any).data = new Map([ ...((req as any).data || []), ...data ]);
    
            next();
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
};

async function getData(
    actions: Partial<IGameActionOptions> | IGameActionOptions,
    ...types: Array<RequestData>
) : Promise<Map<RequestData, any>> {
    const promises = types.map(type => toPromise(actions, type));
    return (await Promise.all(promises))
        .reduce((map, data, index) => map.set(types[index], data), new Map);
}

async function toPromise(actions: Partial<IGameActionOptions> | IGameActionOptions, type: RequestData) {
    const child = requestsMap.get(type)!(actions);
    return (await firebase.database().ref().child(child).once('value')).val();
}

export enum RequestData {
  GAME = "GAME",
  GAMESTATE = "GAMESTATE",
  GAMESTATUS = "GAMESTATUS",
  PLAYERGAME = "PLAYERGAME",
  OWNER = "OWNER",
  DECK = "DECK",
  HAND = "HAND",
  HANDS = "HANDS",
}

const requestsMap: Map<RequestData, (action: Partial<IGameActionOptions>) => string> = new Map();

requestsMap.set(RequestData.GAME, ({ gameId }) => `games/${gameId}`);
requestsMap.set(RequestData.GAMESTATE, ({ gameId }) => `games/${gameId}/state`);
requestsMap.set(RequestData.GAMESTATUS, ({ gameId }) => `games/${gameId}/status`);
requestsMap.set(RequestData.OWNER, ({ gameId }) => `games/${gameId}/owner`);
requestsMap.set(RequestData.DECK, ({ gameId }) => `decks/${gameId}`);
requestsMap.set(RequestData.HANDS, ({ gameId }) => `hands/${gameId}`);
requestsMap.set(RequestData.HAND, ({ gameId, userId }) => `hands/${gameId}/${userId}`);
requestsMap.set(RequestData.PLAYERGAME, ({ userId }) => `users/${userId}/game`);
