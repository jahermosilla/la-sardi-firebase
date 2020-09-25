import { CardColor } from "./enums/card-color";
import { ICard } from "./interfaces/game";

export default class Card implements ICard {
    color!: CardColor;

    value!: number;

    constructor() {
        console.warn('Card created without values. Make sure to set values later');
    }

    static from(value: number, color: CardColor) {
        const card = new Card();
        card.color = color;
        card.value = value;

        return card;
    }

    static equals(a: ICard, b: ICard) {
        return a.color === b.color
            && a.value === b.value;
    }
}