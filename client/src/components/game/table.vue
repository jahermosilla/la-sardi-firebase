<template>
    <div style="background: rgba(0, 0, 0, 0.25)" class="elevation-4 rounded game-row d-flex flex-grow-1 flex-row justify-space-around align-center">
        <div style="position: relative;" class="deck-deal">
            <game-card :val="2" color="NONE" style="cursor: pointer; position: relative;" />
            <div class="white--text headline" style="pointer-events: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">{{deckSize}}</div>
        </div>

        <div style="position: relative;">
            <draggable
                :list="playedCards"
                group="cards"
                handle="fake"
                @change="onCardPlayed"
                style="width: 100px; height: 153px; z-index: 2;"
            >
            </draggable>
            <game-card
                :color="playedCard._color" :val="playedCard._value"
                :disabled="false"
                no-pointer
                style="position: absolute; top:50%; left:50%; transform: translate(-50%, -50%);"
            />
        </div>

        <div v-if="acc > 0" class="d-flex flex-column align-center">
            <div class="white--text boing">
                <v-icon color="accent">keyboard_arrow_down</v-icon>
            </div>
            <v-btn color="green darken-4" dark fab>{{acc}}</v-btn>
        </div>
        <div v-else></div>
    </div>
</template>

<script>
import GameCard from '@/components/game/card';
import Draggable from 'vuedraggable';
import * as db from '@/db';

export default {
    props: {
        gameRef: {
            required: true
        }
    },

    components: {
        GameCard,
        Draggable
    },

    data() {
        return {
            playedCards: [],
        }
    },

    methods: {
        async onCardPlayed({ added: { element: card } }) {
            this.userPlayedCard = { color: card._color, val: card._value };

            await db.playCard(card, this.gameRef['.key']);
        },

        translateCard(card) {
            return {
                ...card,
                val: card.value
            }
        }
    },

    computed: {
        playedCard() {
            const defaultCard = { _color: 'NONE', _value: 1 };
            return this.gameRef && this.gameRef.state.playedCard
                    ? this.translateCard(this.gameRef.state.playedCard)
                    : defaultCard;
        },

        acc() {
            if (!this.gameRef) {
                return 0;
            }

            return this.gameRef.state.counts.acc;
        },

        deckSize() {
            if (!this.gameRef) {
                return 0;
            }
            
            return this.gameRef.state.counts.deck;
        },
    }
}
</script>

<style>
.boing {
    animation: boing-animation;
    animation-duration: 0.5s;
    animation-iteration-count: infinite;
    animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
}

.deck-deal {
    animation: deck-deal-animation;
    animation-duration: 0.5s;
    animation-iteration-count: infinite;
    animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
}

@keyframes boing-animation {
    50% {
        transform: translateY(-40px);
    }
}

@keyframes deck-deal-animation {
    100% {
        transform: rotateZ(360deg);
    }
}
</style>