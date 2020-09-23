import * as firebase from 'firebase-admin';
import { getEmpty } from '../lib/game';
import { ICard, IGameNode, IGameQuantities, IGameState, IHandNode } from '../lib/interfaces/game';
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
  const deck = Deck.createShuffledDeck();
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

  return gameKey;
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
    for (const playerId of Object.keys(game.players)) {
      hands[playerId] = [...(hands[playerId] || []), deck.pop() as ICard];
    }
  }

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

  console.log(updates);

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