import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import express from "express";
import cookieParserFactory from 'cookie-parser';
import corsFactory from 'cors';

import gameRouter from './controllers/game';

// import { IGameActionOptions, IGame, ICard, IGameState } from './lib/interfaces/game';
// import { GameDirection } from './lib/enums/game-direction';

admin.initializeApp(functions.config().firebase);

const cookieParser = cookieParserFactory();
const cors = corsFactory({ origin: true });
const app = express();

app.use(cors);
app.use(cookieParser);

app.use(gameRouter);

export const server = functions.https.onRequest(app);


// function getNextPlayer(game: IGame, turns = 1) : string {
//     const direction = game.state.direction;
//     const actualTurn = game.state.turn;
//     const index = game.players.findIndex(playerId => playerId === actualTurn);
    
//     let actualIndex = null;

//     if (direction === GameDirection.Clockwise) {
//       actualIndex = index >= game.players.length - turns
//           ? 0
//           : index + turns;
//     } else {
//       actualIndex = index === 0
//           ? game.players.length - turns
//           : index - turns;
//     }

//     return game.players[actualIndex];
// }

// // Cuando el jugador pulse una carta
// async function playCard(card: ICard, { gameId, userId }: IGameActionOptions) {
//   const game = await getGameById(gameId);

//   if (!checkTurn(userId, game.state)) {
//     throw new Error("Is not your turn");
//   }

//   if (!checkCard(card, game.state)) {
//     throw new Error("Card is not playable");
//   }

//   // Update the game based on played card
//   const changes: Partial<IGameState> = {};

//   changes.playedCard = card;

//   if (card.value === 1 || card.value === 2) {
//     const delta = card.value === 1 ? 6 : 2;
//     changes.acc = game.state.acc + delta;
//   }

//   if (card.value === 12) {
//     changes.direction = game.state.direction === GameDirection.Clockwise
//         ? GameDirection.Counterclockwise
//         : GameDirection.Clockwise;
//   }

//   // Get new turn
//   const turns = card.value === 11 ? 2 : 1;
//   const newState = { ...game.state, ...changes };
//   const newGame  = { ...game, state: newState };
//   changes.turn = getNextPlayer(newGame, turns);

//   updateGameState(gameId, changes);
// }

// function checkCard(card: ICard, state: IGameState) : boolean {
//     const { playedCard, acc } = state;
    
//     if (acc > 0) {
//         return card.value === (playedCard || {}).value;
//     }

//     return isCardPlayable(card, playedCard);
// }

// function isCardPlayable(userCard: ICard, gameCard: ICard | null) {
//     if (gameCard == null) {
//       return true;
//     }

//     if (userCard.value === 10) {
//         return true;
//     }

//     if (gameCard.value === 10) {
//         return userCard.color === gameCard.color;
//     }

//     return userCard.value === gameCard.value
//         || userCard.color === gameCard.color;
// }

// function checkTurn(userId: string, state: IGameState) : boolean {
//     return userId === state.turn;
// }