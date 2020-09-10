import * as functions from 'firebase-functions';
import * as firebase from 'firebase';
import * as admin from 'firebase-admin';

import express from "express";
import cookieParserFactory from 'cookie-parser';
import corsFactory from 'cors';

import authorizationMiddleware from "./middlewares/authorization";

import { IGameActionOptions, IGame, ICard, IGameState } from './lib/interfaces/game';
import { GameDirection } from './lib/enums/game-direction';
import { createEmptyGameObject } from './lib/game';

admin.initializeApp();

const cookieParser = cookieParserFactory();
const cors = corsFactory({ origin: true });
const app = express();

app.use(cors);
app.use(cookieParser);
app.use(authorizationMiddleware);

app.post('/game', async (req, res, next) => {
  try {
    const { isPrivate } = req.body;
    const userId = (req as any).user.id;
    const game = createEmptyGameObject(userId, isPrivate);
    await firebase.database().ref("games").push(game);
  
    // TODO: Store the relation between user and game
    res.status(201).json({ created: true });
  } catch (error) {
    res.status(500).json({ created: false, error });    
  }
});

app.post('/game/:gameId/join', (req, res, next) => {});

app.post('/game/:gameId/playCard', (req, res, next) => {
  try {
    const card: ICard = req.body.card;
    const userId = (req as any).user.id;
    const { gameId } = req.params;
    playCard(card, { userId, gameId });
  } catch (error) {
    
  }
});

export const server = functions.https.onRequest(app);


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   // functions.logger.info("Hello logs!", {structuredData: true});
//   // response.send("Hello from Firebase!");
// });


async function getGameById(gameId: string) : Promise<IGame> {
    return (await firebase.database().ref("games").child(gameId).once("value")).val();
}

// Cuando el jugador le de al botón de pasar
async function nextTurn({ gameId, userId }: IGameActionOptions) {
  const game = await getGameById(gameId);

  if (!checkTurn(userId, game.state)) {
    throw new Error("Is not your turn");
  }

  if (game.state.acc > 0) {
    throw new Error(`You cant. Either play a valid card or get ${game.state.acc} cards from deck`);
  }

  const changes = {
    turn: getNextPlayer(game)
  }

  updateGameState(gameId, changes);
}

async function updateGameState(gameId: string, changes: Partial<IGameState>) {
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

function getNextPlayer(game: IGame, turns = 1) : string {
    const direction = game.state.direction;
    const actualTurn = game.state.turn;
    const index = game.players.findIndex(playerId => playerId === actualTurn);
    
    let actualIndex = null;

    if (direction === GameDirection.Clockwise) {
      actualIndex = index >= game.players.length - turns
          ? 0
          : index + turns;
    } else {
      actualIndex = index === 0
          ? game.players.length - turns
          : index - turns;
    }

    return game.players[actualIndex];
}

// Cuando el jugador pulse una carta
async function playCard(card: ICard, { gameId, userId }: IGameActionOptions) {
  const game = await getGameById(gameId);

  if (!checkTurn(userId, game.state)) {
    throw new Error("Is not your turn");
  }

  if (!checkCard(card, game.state)) {
    throw new Error("Card is not playable");
  }

  // Update the game based on played card
  const changes: Partial<IGameState> = {};

  changes.playedCard = card;

  if (card.value === 1 || card.value === 2) {
    const delta = card.value === 1 ? 6 : 2;
    changes.acc = game.state.acc + delta;
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

function checkCard(card: ICard, state: IGameState) : boolean {
    const { playedCard, acc } = state;
    
    if (acc > 0) {
        return card.value === playedCard.value;
    }

    return isCardPlayable(card, playedCard);
}

function isCardPlayable(userCard: ICard, gameCard: ICard) {
    if (userCard.value === 10) {
        return true;
    }

    if (gameCard.value === 10) {
        return userCard.color === gameCard.color;
    }

    return userCard.value === gameCard.value
        || userCard.color === gameCard.color;
}

function checkTurn(userId: string, state: IGameState) : boolean {
    return userId === state.turn;
}