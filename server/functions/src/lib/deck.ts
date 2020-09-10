import { ICard, IDeck, IGameState } from "./interfaces/game";
import { shuffle } from "lodash";
import { CardColor } from "./enums/card-color";
import Card from "./card";

export default class Deck extends Array<ICard> implements IDeck {
    deal(playerId: string, numCards: number, gameState: IGameState) : Partial<IGameState> {
        let consumed = numCards;
        const cards: Array<ICard> = [];
        while(consumed-- && this.length > 0) {
            cards.push((this.pop() as ICard));
        }

        return {
            hands: {
                ...gameState.hands,
                [playerId]: [
                    ...gameState.hands[playerId],
                    ...cards
                ]
            }
        }
    }

    static createShuffledDeck(): IDeck {
        const orderedDeck = CardColor.asList().reduce(
            (list: Array<ICard>, color) => [...list, ...this.createCardsFor(color)],
            []
        );

        return shuffle(orderedDeck);
    }

    private static createCardsFor(color: CardColor) : IDeck {
        const length = 12;

        return Array.from({ length }).map(
            (_, value: number) => new Card(value + 1, color)
        );
    }    
}
