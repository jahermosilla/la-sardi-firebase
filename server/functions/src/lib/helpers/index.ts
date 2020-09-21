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
            (req as any).data = data;
    
            next();
        } catch (error) {
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
    const child = map.get(type)!(actions);
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

const map: Map<RequestData, (action: Partial<IGameActionOptions>) => string> = new Map();

map.set(RequestData.GAME, ({ gameId }) => `games/${gameId}`);
map.set(RequestData.GAMESTATE, ({ gameId }) => `games/${gameId}/state`);
map.set(RequestData.GAMESTATUS, ({ gameId }) => `games/${gameId}/status`);
map.set(RequestData.OWNER, ({ gameId }) => `games/${gameId}/owner`);
map.set(RequestData.DECK, ({ gameId }) => `decks/${gameId}`);
map.set(RequestData.HANDS, ({ gameId }) => `hands/${gameId}`);
map.set(RequestData.HAND, ({ gameId, userId }) => `hands/${gameId}/${userId}`);
map.set(RequestData.PLAYERGAME, ({ userId }) => `users/${userId}/game`);
