import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { GameStatus } from "../../lib/enums/game-status";

export const onePlayerLeft = functions.database.ref('games/{gameId}/players/').onUpdate(async (snapshot, context) => {
    let allPlayers = 0;
    let playersEnd = 0;
    snapshot.after.forEach(child =>{
        allPlayers++;
        const ended = child.val() as boolean;

        if (ended) {
            playersEnd++;
        }
    });

    if (allPlayers - playersEnd <= 1) {
        const { gameId } = context.params;

        await admin
          .database()
          .ref(`games/${gameId}/status`)
          .update(GameStatus.FINISHED);
    }
});

export const allPlayersPass = functions.database.ref('/games/{gameId}/pass').onUpdate(async (snapshot, context) => {
    let allPlayers = 0;
    let playersPass = 0;
    snapshot.after.forEach(child => {
        playersPass++;
        const pass = child.val() as boolean;
        if (pass) {
            playersPass++;
        }
    });

    if (playersPass === allPlayers) {
        // TODO: Game Ended
        const { gameId } = context.params;
        await admin
          .database()
          .ref(`games/${gameId}/status`)
          .update(GameStatus.FINISHED);
    }
});