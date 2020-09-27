import { IGameNode, IGameQuantities } from "./interfaces/game";
import { GameDirection } from "./enums/game-direction";

import { GameStatus } from "./enums/game-status";
import { uniqueId } from "lodash";

export function getEmpty({
  owner,
  isPrivate = true,
  qtt
} : {
  owner: string,
  isPrivate: boolean,
  qtt: IGameQuantities
}) : IGameNode {
  const createdAt = new Date().getTime();

  const token = isPrivate ? uniqueId() : null;

  return {
    owner,
    isPrivate,
    token,
    status: GameStatus.NOT_STARTED,
    properties: {
      createdAt,
      qtt
    },
    state: {
      turn: null,
      playedCard: null,
      direction: GameDirection.Clockwise,
      pass: {
        [owner]: false
      },
      counts: {
        cards: {
          [owner]: 0
        },
        acc: 0,
        // TODO Refactor deck size
        deck: qtt.decks * 48
      }
    },

    players: {
      [owner]: true
    },
  };
}