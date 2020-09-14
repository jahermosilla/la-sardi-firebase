import { GameDirection } from "../lib/enums/game-direction";
import { ICard, IGameActionOptions, IGameNode, IGameState } from "../lib/interfaces/game";
import { updateGameState } from "./game";

export async function playCard(card: ICard, game: IGameNode, { gameId, userId }: IGameActionOptions) {
  // Update the game based on played card
  const changes: Partial<IGameState> = {};

  changes.playedCard = card;

  if (card.value === 1 || card.value === 2) {
    const delta = card.value === 1 ? 6 : 2;
    changes.counts = {
      ...game.state.counts,
      acc: game.state.counts.acc + delta,
    };
  }

  if (card.value === 12) {
    changes.direction = game.state.direction === GameDirection.Clockwise
        ? GameDirection.Counterclockwise
        : GameDirection.Clockwise;
  }

  // Get new turn
  const turns = card.value === 11 ? 2 : 1;
  const newState = { ...game.state, ...changes };
  const newGame  = { ...game, state: newState };
  changes.turn = getNextPlayer(newGame, turns);

  updateGameState(gameId, changes);
}

export function getNextPlayer(game: IGameNode, turns = 1) : string {
    const direction = game.state.direction;
    const actualTurn = game.state.turn;
    const players = Object.keys(game.players);
    const index = players.findIndex(playerId => playerId === actualTurn);
    
    let actualIndex = null;

    if (direction === GameDirection.Clockwise) {
      actualIndex = index >= players.length - turns
          ? 0
          : index + turns;
    } else {
      actualIndex = index === 0
          ? players.length - turns
          : index - turns;
    }

    return players[actualIndex];
}

export function checkCard(card: ICard, state: IGameState) : boolean {
    const { playedCard, counts: { acc } } = state;
    
    if (acc > 0) {
        return card.value === (playedCard || {}).value;
    }

    return isCardPlayable(card, playedCard);
}

export function isCardPlayable(userCard: ICard, gameCard: ICard | null) {
    if (gameCard == null) {
      return true;
    }

    if (userCard.value === 10) {
        return true;
    }

    if (gameCard.value === 10) {
        return userCard.color === gameCard.color;
    }

    return userCard.value === gameCard.value
        || userCard.color === gameCard.color;
}

export function checkTurn(userId: string, state: IGameState) : boolean {
    return userId === state.turn;
}