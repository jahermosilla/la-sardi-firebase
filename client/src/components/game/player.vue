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
                    v-bind="card"
                    :key="i"
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
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

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
            return this.gameRef
                ? this.gameRef.state.turn === firebase.auth().currentUser.uid
                : false;
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
        isCardPlayable(card) {
            const playedCard = this.gameRef.state.playedCard;
            const acc = this.gameRef.state.counts.acc;

            if (acc > 0) {
                return playedCard.value === card.value;
            }

            if (card.value === 10) {
                return true;
            }

            if (playedCard.value === 10) {
                return playedCard.color === card.color || card.value === 10;
            }

            return playedCard.value === card.value || playedCard.color === card.color;
        },
    }
}
</script>

<style>
.chosen {
    background: rgba(0, 0, 0, 0.25) !important;
}
</style>