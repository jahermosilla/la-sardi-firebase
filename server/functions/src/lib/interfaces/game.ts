import { GameDirection } from "../enums/game-direction";
import { CardColor } from "../enums/card-color";


export declare interface IDeck extends Array<ICard> {
  deal(
    playerId: string,
    numCards: number,
    gameState: IGameState
  ): Partial<IGameState>;
}

export declare interface IGameActionOptions {
    gameId: string,
    userId: string
}

export declare interface IGame {
    owner: string,
    properties: IGameProperties,
    state: IGameState,
    players: Array<string>
};

export declare interface IGameProperties {
    isPrivate: boolean,
    token: string,
    createdAt: number
};

export declare interface IGameState {
    deck: IDeck,
    turn: string | null,
    playedCard: ICard | null | undefined,
    direction: GameDirection,
    acc: number,
    hands: IPlayersHands
};

export declare interface IPlayersHands {
    [key: string]: Array<ICard>
};

export declare interface ICard {
    value: number,
    color: CardColor,

    equals: (other: ICard) => boolean
}