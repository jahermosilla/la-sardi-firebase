<template>
  <v-container fluid class="fill-height d-flex flex-column" :style="containerStyle">
    <!-- Enemies -->
    <div class="game-row d-flex justify-space-around">
        <enemy v-for="enemy in enemies" :key="enemy.uid" v-bind="enemy"/>
    </div>

    <!-- Tablero -->
    <div class="game-row d-flex flex-grow-1 flex-row justify-space-around align-center">
        <div>
            <game-card :val="2" color="NONE" style="cursor: pointer;"></game-card>
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
            <transition name="slide-x-reverse-transition">
                <game-card
                    v-bind="playedCard"
                    :disabled="false"
                    no-pointer
                    style="position: absolute; top:0; left:0;"
                />
            </transition>
        </div>

        <v-btn v-if="acc > 0">{{acc}}</v-btn>
        <div v-else></div>
    </div>

    <!-- Player -->
    <div class="game-row d-flex flex-row justify-space-between">
        <div class="actions">
            DKDSHKHS
        </div>
        <div style="overflow-x: scroll; overflow-y: hidden; white-space: nowrap; max-width: 80vw;">
            <draggable
                :list="playerCards"
                group="cards"
                :sort="false"
                ghost-class="chosen"
                handle=".handle"
            >
                <game-card
                    v-for="(card, i) in playerCards"
                    :key="i" v-bind="card"
                    class="mx-1"
                    style="display: inline-block;"
                    :disabled="!myTurn || !isCardPlayable(card)"
                    :class="{ handle: myTurn && isCardPlayable(card) }"
                />
            </draggable>
        </div>

        <div class="actions">
            DKDSHKHS
        </div>
    </div>
      
  </v-container>
</template>

<script>
import Enemy from '@/components/game/enemy';
import GameCard from '@/components/game/card';
import Draggable from 'vuedraggable';
import firebase from 'firebase';

export default {
    props: {
        gameId: {
            required: true,
            type: String
        }
    },

    components: {
        Enemy,
        GameCard,
        Draggable
    },

    data() {
        return {
            gameRef: null,

            playedCards: [],
            userPlayedCard: null,

            playerCards: Array.from({ length: 12 }).map((v, i) => ({ color: 'ESPADAS', val: i + 1 }))
        }
    },

    methods: {
        onCardPlayed({ added: { element } }) {
            this.userPlayedCard = element;

            // TODO: Handle play card
        },

        isCardPlayable(card) {
            const playedCard = this.translateCard(this.gameRef.state.playedCard);
            const acc = this.gameRef.state.counts.acc;
            console.log(playedCard, card);

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
        return {
            gameRef: firebase.database().ref(this.gameId)
        }
    },

    computed: {
        myTurn() {
            if (!this.gameRef) {
                return false;
            }

            return this.gameRef.state.turn === firebase.auth().currentUser.uid;
        },

        playedCard() {
            const defaultCard = { color: 'NONE', val: 1 };
            return this.userPlayedCard || this.translateCard(this.gameRef.state.playedCard) || defaultCard;
        },

        containerStyle() {
            return {
                background: this.$vuetify.theme.themes.light.primary
            }
        },

        acc() {
            if (!this.gameRef) {
                return 0;
            }

            return this.gameRef.state.counts.acc;
        },

        deckSize() {
            return this.gameRef.state.counts.deck;
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
    .game-row {
        width: 100%;
    }

    .chosen {
        background: red !important;
    }
</style>