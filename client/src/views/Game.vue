<template>
  <v-container fluid class="py-0 fill-height d-flex flex-column" :style="containerStyle">
    <enemies :enemies="enemies" />

    <!-- Tablero -->
    <game-table :gameRef="gameRef" />

    <!-- Player -->
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
            >
                <game-card
                    v-for="(card, i) in (handRef || [])"
                    :key="`${card._value}${card._color}-${i}`" :color="card._color" :val="card._value"
                    class="mx-1"
                    style="display: inline-block;"
                    :disabled="!myTurn || !isCardPlayable(card)"
                    :class="{ handle: myTurn && isCardPlayable(card) }"
                />
            </draggable>
        </div>

        <div class="actions">
            <v-btn icon @click="startGame">
                <v-icon style="font-size: 1.9rem;">send</v-icon>
            </v-btn>
            <v-btn icon @click="pass">
                <v-icon style="font-size: 2.5rem;">{{directionIcon}}</v-icon>
            </v-btn>
        </div>
    </div>
      
  </v-container>
</template>

<script>
import GameTable from '@/components/game/table';
import Enemies from '@/components/game/enemies';
import GameCard from '@/components/game/card';
import Draggable from 'vuedraggable';
import firebase from 'firebase';
import * as db from '@/db';

export default {
    props: {
        gameId: {
            required: true,
            type: String
        }
    },

    components: {
        GameTable,
        Enemies,
        GameCard,
        Draggable
    },

    created() {
        this.playerId = firebase.auth().currentUser.uid;
    },

    data() {
        return {
            gameRef: null,
            handRef: [],

            playerId: null,

            userPlayedCard: null,

            playerCards: Array.from({ length: 12 }).map((v, i) => ({ color: 'ESPADAS', val: i + 1 }))
        }
    },

    methods: {
        async startGame() {
            await db.startGame(this.gameRef['.key']);
        },

        async pass() {
            await db.pass(this.gameRef['.key']);
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

        translateCard(card) {
            return {
                ...card,
                val: card.value
            }
        }
    },

    firebase() {
        const playerId = firebase.auth().currentUser.uid;
        return {
            gameRef: firebase.database().ref(this.gameId),
            handRef: firebase.database().ref(`hands/${this.gameId.replace('games/', '')}/${playerId}`)
        }
    },

    computed: {
        directionIcon() {
            return this.direction === 0 ? 'switch_right' : 'switch_left';
        },

        direction() {
            if (!this.gameRef) {
                return 0;
            }

            return this.gameRef.state.direction;
        },

        imOwner() {
            if (!this.gameRef) {
                return false;
            }

            return this.playerId === this.gameRef.owner;
        },

        myTurn() {
            if (!this.gameRef) {
                return false;
            }

            return this.gameRef.state.turn === firebase.auth().currentUser.uid;
        },

        containerStyle() {
            return {
                background: this.$vuetify.theme.themes.light.primary
            }
        },

        enemies() {
            if (!this.gameRef) {
                return [];
            }

            console.log(this.gameRef.state.turn, this.gameRef.players)

            const playerId = firebase.auth().currentUser.uid;

            return Object.keys(this.gameRef.players || {})
                .filter(pid => pid !== playerId)
                .map(uid => ({
                    uid,
                    turn: this.gameRef.state.turn === uid,
                    cards: this.gameRef.state.counts.cards[uid] || 0
                }));
        }
    }
}
</script>

<style>
    /* *::-webkit-scrollbar {
      display: none;
    } */

    *::-webkit-scrollbar {
        width: 0px;
    }
    
    /* *::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(27,94,32,0); 
        border-radius: 10px;
    }

    *::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 6px rgba(27,94,32);
    } */

    .game-row {
        width: 100%;
    }

    .chosen {
        background: red !important;
    }

    .actions {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-content: center;
    }
</style>