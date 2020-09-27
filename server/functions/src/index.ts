import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as errors from './errors';
import express from "express";
import cookieParserFactory from 'cookie-parser';
import corsFactory from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import playerRouter from './controllers/player';
import gameRouter from './controllers/game';

admin.initializeApp(functions.config().firebase);

const cookieParser = cookieParserFactory();
const cors = corsFactory({ origin: true });
const app = express();

app.use(cors);
app.use(cookieParser);
app.use(helmet());
app.use(compression());

app.use(gameRouter);
app.use(playerRouter);

// Handle 404
app.use(errors.notFound);

// Error handler
app.use(errors.errorHandler);

export const server = functions.https.onRequest(app);
export { onePlayerLeft, allPlayersPass } from "./listeners/game-end";