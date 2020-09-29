<template>
    <div style="background: rgba(0, 0, 0, 0.25); min-width: 95%;" class="elevation-4 px-4 rounded d-flex flex-grow-1 flex-row justify-center align-center">
        <!-- Dialog for changing card color (10) -->
        <change-color-dialog v-model="changeColorOpened" @submit="onChangeColor"></change-color-dialog>
        
        <div
            @click="takeFromDeck"
            style="position: relative;"
            :style="{ pointerEvents: myTurn ? 'auto' : 'none' }"
            :class="{ 'deck-deal': showDeckAnimation }"
        >
            <game-card :disabled="!myTurn" :value="2" color="NONE" style="cursor: pointer; position: relative;" />
            <div class="white--text headline deck-size--text">{{deckSize}}</div>
        </div>

        <game-card
            ref="playedCard"
            v-bind="playedCard"
            :disabled="false"
            no-pointer
            class="px-4"
            style="pointer-events: none;"

        />

        <div v-if="acc > 0" class="d-flex flex-column align-center">
            <div class="white--text boing">
                <v-icon color="accent">mdi-arrow-down</v-icon>
            </div>
            <v-btn color="green darken-4" dark fab>{{acc}}</v-btn>
        </div>
        <div v-else></div>
    </div>
</template>

<script>
import GameCard from '@/components/game/card';
import ChangeColorDialog from '@/components/dialogs/ChangeColor';
import * as db from '@/db';
import firebase from 'firebase/app';
import 'firebase/auth';
import interact from 'interactjs';

export default {
    props: {
        gameRef: {
            required: true
        }
    },

    components: {
        GameCard,
        ChangeColorDialog
    },

    data() {
        return {
            changeColorOpened: false,
            showDeckAnimation: false
        }
    },

    mounted() {
        interact(this.$refs.playedCard.$el).dropzone({
            ondrop: (event) => {
                const { target } = event.draggable;
                const props = JSON.parse(target.getAttribute('data-app'));
                
                this.onCardPlayed(props);
            }
        });
    },

    beforeDestroy() {
        interact(this.$refs.playedCard.$el).unset();
    },

    methods: {
        async onCardPlayed(props) {
            const card = {
                color: props.color,
                value: props.value
            };

            if (card.value === 10) {
                return (this.changeColorOpened = true);
            }

            this.userPlayedCard = card;

            await db.playCard(card, this.gameRef['.key']);
        },

        async onChangeColor(card) {
            this.userPlayedCard = card;

            await db.playCard(card, this.gameRef['.key']);
        },

        async takeFromDeck() {
            await db.takeFromDeck(this.gameRef['.key']);
        }
    },

    computed: {
        playedCard() {
            const defaultCard = { color: 'NONE', value: 1 };
            return this.gameRef && this.gameRef.state.playedCard
                    ? this.gameRef.state.playedCard
                    : defaultCard;
        },

        acc() {
            return this.gameRef
                ? this.gameRef.state.counts.acc
                : 0;
        },

        deckSize() {
            return this.gameRef
                ? this.gameRef.state.counts.deck
                : 0;
        },

        myTurn() {
            return this.gameRef
                ? this.gameRef.state.turn === firebase.auth().currentUser.uid
                : false;
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

.deck-size--text {
    pointer-events: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    user-select: none;
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