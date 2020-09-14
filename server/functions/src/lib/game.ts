import { IGameNode } from "./interfaces/game";
import { GameDirection } from "./enums/game-direction";

import Deck from "./deck";

export function getEmpty(owner: string, isPrivate: boolean = true) : IGameNode {
  const deck = Deck.createShuffledDeck();
  const createdAt = new Date().getTime();

  return {
    owner,
    properties: {
      createdAt,
    },
    state: {
      turn: null,
      playedCard: null,
      direction: GameDirection.Clockwise,
      counts: {
        cards: {
          [owner]: 0
        },
        acc: 0,
        deck: deck.length
      }
    },

    players: {
      [owner]: true
    },
  };
}