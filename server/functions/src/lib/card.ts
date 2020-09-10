import { CardColor } from "./enums/card-color";
import { ICard } from "./interfaces/game";

export default class Card implements ICard {
    private _color: CardColor;

    private _value: number;

    constructor(value: number, color: CardColor) {
        this._color = color;
        this._value = value;
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