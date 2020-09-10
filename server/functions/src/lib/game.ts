import { IGame } from "./interfaces/game";
import { GameDirection } from "./enums/game-direction";
import Deck from "./deck";




export function createEmptyGameObject(
  owner: string,
  isPrivate: boolean
): IGame {
  const token = "Hello";
  const deck = Deck.createShuffledDeck();
  const createdAt = new Date().getTime();
  // const playedCard = deck.pop();

  return {
    owner,
    properties: {
      isPrivate,
      token,
      createdAt,
    },
    state: {
      deck,
      turn: null,
      playedCard: null,
      acc: 0,
      direction: GameDirection.Clockwise,
      hands: {
        [owner]: []
      },
    },

    players: [owner],
  };
}
