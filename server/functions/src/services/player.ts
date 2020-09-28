import firebase from 'firebase-admin';
import { GameDirection } from "../lib/enums/game-direction";
import { ICard, IGameActionOptions, IGameNode, IGameState } from "../lib/interfaces/game";
import { getGameById } from "./game";
import Card from '../lib/card';

export async function playCard(card: ICard, { gameId, userId, game, hand }: { gameId: string, userId: string, game: IGameNode, hand: Array<ICard> }) {
  const state : IGameState = {
    ...game.state,
    playedCard: card
  };
  const updates : any = {
    [`games/${gameId}/state/playedCard`]: card,
  };

  if ([1, 2].indexOf(card.value) >= 0) {
    const delta = card.value === 1 ? 6 : 2;
    const acc = game.state.counts.acc + delta;
    updates[`games/${gameId}/state/counts/acc`] = acc;
    state.counts.acc = acc;
  }

  if (card.value === 12) {
    const direction = game.state.direction === GameDirection.Clockwise
        ? GameDirection.Counterclockwise
        : GameDirection.Clockwise;
    updates[`games/${gameId}/state/direction`] = direction;
    state.direction = direction;
  }

  const playersLeft = Object.values(game.players).reduce((res, val) => res + (+!val), 0);

  if ([3, 7].indexOf(card.value) < 0) {
    let turns =
      card.value === 11 || (card.value === 12 && playersLeft <= 2) ? 2 : 1;

    const newGame = { ...game, state };

    updates[`games/${gameId}/state/turn`] = getNextPlayer(newGame, turns);
  }

  // Update hand
  const cardIndex: number = hand
    .findIndex(other => Card.equals(card, other));

  hand.splice(cardIndex, 1);
  
  updates[`hands/${gameId}/${userId}`] = hand;

  // Update player counts
  updates[`games/${gameId}/state/counts/cards/${userId}`] = hand.length;

  // Has finished?
  if (hand.length === 0) {
    updates[`games/${gameId}/players/${userId}`] = false;
  }

  await firebase.database().ref().update(updates);
}

export async function pass({ userId, gameId }: IGameActionOptions) {
  const game = await getGameById(gameId);

  const updates = {
    [`games/${gameId}/state/turn`]: getNextPlayer(game, 1),
    [`games/${gameId}/pass/${userId}`]: true
  };

  await firebase.database().ref().update(updates);
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
  if (game.state.counts.acc) {
    let consumed = game.state.counts.acc;

    while (consumed-- && deck?.length) {
      hand.push(deck.pop() as ICard);
    }

    game.state.counts.acc = 0;
  } else {
    hand.push(deck?.pop() as ICard);
  }

  const updates = {
    [`hands/${gameId}/${userId}`]: hand,
    [`games/${gameId}/state/counts/acc`]: game.state.counts.acc,
    [`games/${gameId}/state/counts/cards/${userId}`]: hand.length,
    [`games/${gameId}/state/counts/deck`]: deck?.length || 0,
    [`decks/${gameId}`]: deck,
  };

  await firebase.database().ref().update(updates);
}

export function getNextPlayer(game: IGameNode, turns = 1) : string {
    const direction = game.state.direction;
    const actualTurn = game.state.turn;
    const players = Object.keys(game.players).filter(playerId => !!game.players[playerId]);
    const index = players.findIndex(playerId => playerId === actualTurn);
    const sign = Math.sign(direction === GameDirection.Clockwise ? 1 : -1);
    let actualIndex = index + (turns * sign);

    if (actualIndex < 0) {
      actualIndex += players.length;
    } else if (actualIndex >= players.length) {
      actualIndex -= players.length;
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