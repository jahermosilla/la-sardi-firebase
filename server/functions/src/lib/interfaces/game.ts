import { GameDirection } from "../enums/game-direction";
import { CardColor } from "../enums/card-color";
import { GameStatus } from "../enums/game-status";


/**
 * Structure of "game" record in "games" node
 */
export declare interface IGameNode {
    owner: string,
    properties: IGameProperties,
    state: IGameState,
    status: GameStatus,
    players: IPlayers
};

/**
 * Strcuture of "hand" record in hands node
 */
export declare interface IHandNode {
    [key: string]: Array<ICard>
};

/**
 * Strcuture of "deck" record in decks node
 */
export declare interface IDeckNode {
    [key: string]: Array<ICard>
};

export declare interface IGameActionOptions {
    gameId: string,
    userId: string
}

/**
 * The boolean value represents if the user has ended or not
 */
export declare interface IPlayers {
    [key: string]: boolean
};

export declare interface IGameProperties {
    createdAt: number,
    isPrivate: boolean,
    qtt: IGameQuantities
};

export declare interface IGameQuantities {
    cards: number,
    decks: number,
    players: number
} 

export declare interface IGameState {
    turn: string | null,
    playedCard: ICard | null,
    direction: GameDirection,
    pass: IPlayersPass,
    counts: {
        cards: IPlayerCardCount,
        acc: number,
        deck: number
    }
};

export declare interface IPlayersPass {
    [key: string]: boolean
}

export declare interface IPlayerCardCount {
    [key: string]: number
};

export declare interface ICard {
    value: number,
    color: CardColor
}