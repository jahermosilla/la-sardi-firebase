import * as firebase from 'firebase-admin';
import { getEmpty } from '../lib/game';
import { ICard, IGameNode, IGameQuantities, IHandNode } from '../lib/interfaces/game';
import Deck from '../lib/deck';
import { GameStatus } from '../lib/enums/game-status';

export async function create({
  owner,
  isPrivate = true,
  qtt,
}: {
  owner: string;
  isPrivate: boolean;
  qtt: IGameQuantities;
}): Promise<string> {
  const deck = Deck.createShuffledDeck(qtt.decks);
  const game = getEmpty({ owner, isPrivate, qtt });

  const key = (await firebase.database().ref("games").push()).key;

  const gameKey = `games/${key}`;
  const deckKey = `decks/${key}`;
  const userKey = `users/${owner}/game`;

  const updates = {
    [gameKey]: game,
    [deckKey]: deck,
    [userKey]: key,
  };

  await firebase.database().ref().update(updates);

  return key as string;
}

export async function start(gameId: string, { game, deck }: { game: IGameNode, deck: Array<ICard> }) {
  const numCards = game.properties.qtt.cards;
  const playerKeys = Object.keys(game.players) || [];
  const numPlayers = playerKeys.length;
  const randomIndex = Math.floor(Math.random() * numPlayers);
  const hands: IHandNode = {};

  game.state.playedCard = deck.pop() as ICard;
  game.status = GameStatus.PLAYING;
  game.state.turn = playerKeys[randomIndex];

  for (let i = 0; i < numCards; i++) {
    for (const playerId of playerKeys) {
      hands[playerId] = [...(hands[playerId] || []), deck.pop() as ICard];
    }
  }

  game.state.counts.deck = game.state.counts.deck - (numCards * numPlayers);

  for (const playerId of Object.keys(game.players)) {
    game.state.counts.cards[playerId] = hands[playerId].length;
  }

  const gameKey = `games/${gameId}`;
  const deckKey = `decks/${gameId}`;
  const handsKey = `hands/${gameId}`;

  const updates = {
    [gameKey]: game,
    [deckKey]: deck,
    [handsKey]: hands,
  };
  
  await firebase.database().ref().update(updates);
}

export async function join(playerId: string, gameId: string) {
  const gameKey = `games/${gameId}/players/${playerId}`;
  const userKey = `users/${playerId}/game`;

  const changes = {
    [gameKey]: false,
    [userKey]: gameId
  };

  await firebase.database().ref().update(changes);
}

export async function leave(playerId: string, gameId: string) {
  const updates = {
    [`games/${gameId}/players/${playerId}`]: null,
    [`hands/${gameId}/${playerId}`]: null,
    [`users/${playerId}/game`]: null
  };

  // await firebase.database().ref("games").child(gameId).child("players").child(playerId).remove();
  // await firebase.database().ref("hands").child(gameId).child(playerId).remove();
  // await firebase.database().ref("users").child(playerId).child("game").remove();

  await firebase.database().ref().update(updates);
}

export async function getGameById(gameId: string): Promise<IGameNode> {
  return (
    await firebase.database().ref("games").child(gameId).once("value")
  ).val();
}

export async function getGameByToken(token: string): Promise<firebase.database.DataSnapshot> {
  return firebase
    .database()
    .ref("games")
    .orderByChild("token")
    .equalTo(token)
    .limitToFirst(1)
    .once("value");
}