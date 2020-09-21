import firebase from 'firebase-admin';
import { GameDirection } from "../lib/enums/game-direction";
import { ICard, IGameActionOptions, IGameNode, IGameState } from "../lib/interfaces/game";
import { getGameById, updateGameState } from "./game";

export async function playCard(card: ICard, { gameId, userId, game, hand }: { gameId: string, userId: string, game: IGameNode, hand: Array<ICard> }) {
  // Update the game based on played card
  const changes: IGameState = { ...game.state };

  // TODO: Check if user has the card
  // TODO: Update player hand

  changes.playedCard = card;

  if ([1, 2].indexOf(card.value) >= 0) {
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
  const newState = { ...game.state, ...changes };
  const newGame  = { ...game, state: newState };

  if ([3, 7].indexOf(card.value) < 0) {
    const turns = card.value === 11 ? 2 : 1;
    changes.turn = getNextPlayer(newGame, turns);
  }

  const cardIndex: number = hand.findIndex(card.equals.bind(card));
  const newHand = hand.splice(cardIndex, 1);

  const updates = {
    [`games/${gameId}/state`]: changes,
    [`hands/${gameId}/${userId}`]: newHand
  };
  await firebase.database().ref().update(updates);
}

export async function pass({ userId, gameId }: IGameActionOptions) {
  const game = await getGameById(gameId);

  if (game.state.turn !== userId) {
    throw new Error("Not your turn");
  }

  const changes = {
    turn: getNextPlayer(game, 1),
  };

  await updateGameState(gameId, changes);
}

export async function takeFromDeck({
  userId,
  gameId,
  deck,
  game,
  hand
}: IGameActionOptions & {
  deck?: Array<ICard>;
  game: IGameNode;
  hand: Array<ICard>;
}) {
  if (!deck || !deck.length) {
    return;
  }

  if (game.state.counts.acc) {
    let consumed = game.state.counts.acc;

    while (consumed-- && deck.length) {
      hand.push(deck.pop() as ICard);
    }

    game.state.counts.acc = 0;
  } else {
    hand.push(deck.pop() as ICard);
  }

  const updates = {
    [`hands/${gameId}/${userId}`]: hand,
    [`games/${gameId}/state/counts/acc`]: game.state.counts.acc,
    [`games/${gameId}/state/counts/cards/${userId}`]: hand.length,
  };

  await firebase.database().ref().update(updates);
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
    if (gameCard === null) {
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