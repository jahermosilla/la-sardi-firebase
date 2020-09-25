import { ICard } from "./interfaces/game";
import { shuffle } from "lodash";
import { asList, CardColor } from "./enums/card-color";
import Card from "./card";

export default class Deck extends Array<ICard> {
  static createShuffledDeck(length: number): Array<ICard> {
    const orderedDecks = Array.from({ length })
      .map((e, i) => this._createShuffledDeck())
      .reduce((a, b) => a.concat(b));

    return shuffle(orderedDecks);
  }

  static _createShuffledDeck(): Array<ICard> {
    const orderedDeck = asList().reduce(
      (list: Array<ICard>, color) => [...list, ...this.createCardsFor(color)],
      []
    );

    return shuffle(orderedDeck);
  }

  private static createCardsFor(color: CardColor): Array<ICard> {
    const length = 12;

    return Array.from({ length }).map(
      (_, value: number) => Card.from(value + 1, color)
    );
  }
}
