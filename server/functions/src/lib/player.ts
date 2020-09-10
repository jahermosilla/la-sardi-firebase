import Card from "./card";

export class Player {
    name: String;

    hand: Array<Card>;

    constructor(name: String) {
        this.name = name;
        this.hand = [];
    }

    addToHand(card: Card) {
        this.hand.push()
    }
}