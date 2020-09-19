import * as firebase from 'firebase-admin';
import { getEmpty } from '../lib/game';
import { ICard, IGameNode, IGameState, IHandNode } from '../lib/interfaces/game';
import Deck from '../lib/deck';

export async function create(owner: string, isPrivate: boolean) : Promise<string> {
  const deck = Deck.createShuffledDeck();
  const game = getEmpty(owner, isPrivate);

  const gameKey = `games/${(await firebase.database().ref('games').push()).key}`;
  const deckKey = `decks/${gameKey}`;
  const userKey = `users/${owner}/game`;

  const updates = {
    [gameKey]: game,
    [deckKey]: deck,
    [userKey]: gameKey
  };

  await firebase.database().ref().update(updates);

  return gameKey;
}

export async function start(gameId: string) {
  const numCards = 3;
  const game = await getGameById(gameId);

  if (Object.keys(game.players).length < 2) {
    throw new Error('At least two players');
  }

  const deck = await getDeckByGameId(gameId);
  const hands: IHandNode = {};

  game.state.playedCard = deck.pop() as ICard;

  for (let i = 0; i < numCards; i++) {
    for (const playerId of Object.keys(game.players)) {
      hands[playerId] = [
        ...(hands[playerId] || []),
        deck.pop() as ICard,
      ];
    }
  }

  const gameKey = `games/${gameId}`;
  const deckKey = `decks/${gameId}`;
  const handsKey = `hands/${gameId}`;

  const updates = {
    [gameKey]: game,
    [deckKey]: deck,
    [handsKey]: hands
  }

  await firebase.database().ref().update(updates);
}

export async function join(playerId: string, token: string) {
  const snapshot = await getGameByToken(token);
  const game = snapshot.val();
  const gameId = snapshot.key;

  const gameKey = `games/${gameId}/players`;
  const userKey = `users/${playerId}/game`;

  const changes = {
    [gameKey]: { ...game.players, [playerId]: true },
    [userKey]: gameId
  };

  await firebase.database().ref().update(changes);
}

export async function leave(playerId: string, gameId: string) {
  await firebase.database().ref("games").child(gameId).child("players").child(playerId).remove();
  await firebase.database().ref("hands").child(gameId).child(playerId).remove();
  await firebase.database().ref("users").child(playerId).child("game").remove();
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
    .once("value");
}

export async function getPlayerHand(gameId: string, playerId: string): Promise<Array<ICard>> {
  return (await firebase
    .database()
    .ref("hands")
    .child(gameId)
    .child(playerId)
    .once("value")).val();
}

export async function updateGameState(
  gameId: string,
  changes: Partial<IGameState>
) {
  try {
    await firebase
      .database()
      .ref("games")
      .child(gameId)
      .child("state")
      .update(changes);
  } catch (e) {
    console.error(e);
    // Do nothing
  }
}

export async function getDeckByGameId(gameId: string): Promise<Array<ICard>> {
  return (
    await firebase.database().ref("decks").child(gameId).once("value")
  ).val();
}