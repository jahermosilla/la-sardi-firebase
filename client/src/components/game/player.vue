<template>
    <div class="pt-2 game-row d-flex flex-row justify-space-between">
        <div class="actions">
            <v-btn icon></v-btn>
        </div>
        <div style="overflow-x: scroll; overflow-y: hidden; white-space: nowrap; max-width: 80vw;">
            <draggable
                :list="handRef"
                group="cards"
                ghost-class="chosen"
                handle=".handle"
                :ordered="false"
            >
                <game-card
                    v-for="(card, i) in (handRef || [])"
                    :key="i" :color="card._color" :val="card._value"
                    class="mx-1"
                    style="display: inline-block;"
                    :disabled="!myTurn || !isCardPlayable(card)"
                    :class="{ handle: myTurn && isCardPlayable(card) }"
                />
            </draggable>
        </div>

        <slot name="player-actions" v-bind="{ gameRef, myTurn, imOwner }" />
    </div>
</template>

<script>
import Draggable from 'vuedraggable';
import GameCard from '@/components/game/card';
import firebase from 'firebase';

export default {
    components: {
        Draggable,
        GameCard
    },

    props: {
        gameRef: {
            required: true
        },

        gameId: {
            type: String,
            required: true
        }
    },

    data() {
        return {
            handRef: []
        }
    },

    firebase() {
        const playerId = firebase.auth().currentUser.uid;

        return {
            handRef: firebase.database().ref(`hands/${this.gameId.replace('games/', '')}/${playerId}`)
        }
    },

    computed: {
        myTurn() {
            if (!this.gameRef) {
                return false;
            }

            return this.gameRef.state.turn === firebase.auth().currentUser.uid;
        },

        imOwner() {
            if (!this.gameRef) {
                return false;
            }

            const playerId = firebase.auth().currentUser.uid;

            return playerId === this.gameRef.owner;
        }
    },

    methods: {
        translateCard(card) {
            return {
                ...card,
                val: card.value
            }
        },

        isCardPlayable(card) {
            const playedCard = this.translateCard(this.gameRef.state.playedCard);
            const acc = this.gameRef.state.counts.acc;

            if (acc > 0) {
                return playedCard.val === card.val;
            }

            if (card.val === 10) {
                return true;
            }

            if (playedCard.val === 10) {
                return playedCard.color === card.color || card.val === 10;
            }

            return playedCard.val === card.val || playedCard.color === card.color;
        },
    }
}
</script>

<style>
.chosen {
    background: rgba(0, 0, 0, 0.25) !important;
}
</style>