import { CardColor } from "./enums/card-color";
import { ICard } from "./interfaces/game";

export default class Card implements ICard {
    private _color!: CardColor;

    private _value!: number;

    constructor() {}

    static from(value: number, color: CardColor) {
        const card = new Card();
        card.color = color;
        card.value = value;

        return card;
    }

    get color() {
        return this._color;
    }

    set color(color) {
        this._color = color;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    equals(other: ICard) {
        return this.color === other.color
            && this.value === other.value;
    }
}