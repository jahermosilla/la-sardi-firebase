import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { IPlayers } from "../../lib/interfaces/game";
import { Change } from "firebase-functions";
import { DataSnapshot } from "firebase-functions/lib/providers/database";

export const onePlayerLeft = functions.database.ref('games/{gameId}/players/').onUpdate(async (snapshot, context) => {
    const { total, trues } = getTotals(snapshot);

    if (total - trues <= 1) {
        const { gameId } = context.params;

        await removeGameData(gameId);
    }
});

export const allPlayersPass = functions.database.ref('/games/{gameId}/pass').onUpdate(async (snapshot, context) => {
    const { total, trues } = getTotals(snapshot);

    if (total === trues) {
        // TODO: Game Ended
        const { gameId } = context.params;
        await removeGameData(gameId)
    }
});

function getTotals(changes: Change<DataSnapshot>) : { total: number, trues: number } {
    let total = 0;
    let trues = 0;

    changes.after.forEach(child => {
        total++;

        if (child.val() as boolean) {
            trues++;
        }
    });

    return {
        total,
        trues
    };
}

async function removeGameData(gameId: string) {
  /**
   * To remove:
   *  - game/{gameId}
   * - hands/{gameId}
   * - players/{playerId}/game
   * - decks/{gameId}
   */
  const players: IPlayers = (
    await admin.database().ref(`games/${gameId}/players`).once('value')
  ).val();

  const updates = {
    [`games/${gameId}`]: null,
    [`hands/${gameId}`]: null,
    [`decks/${gameId}`]: null
  }

  for (const playerId of Object.keys(players || {})) {
    updates[`users/${playerId}/game`] = null;
  }

  await admin.database().ref().update(updates);
}