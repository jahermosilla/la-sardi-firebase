<template>
  <v-container fluid class="py-0 px-0 fill-height d-flex flex-column" :style="containerStyle">
    <!-- Animated Card -->
    <transition @after-enter="animatedCard = null" name="move-card">
        <game-card v-if="!!animatedCard" v-bind="animatedCard" class="animated-card" />
    </transition>

    <!-- Enemies -->
    <enemies :game-ref="gameRef" ref="enemies" />

    <!-- Table -->
    <!-- <game-table :game-ref="gameRef" ref="gameTable" /> -->
    <transition name="scale-transition" mode="out-in">
        <component :is="middleComponent" :game-ref="gameRef" ref="gameTable" />
    </transition>

    <!-- Player Card -->
    <game-card class="player-card" v-show="showCard" v-bind="playerCard" :style="playerCardStyle"/>

    <!-- Player -->
    <player
        v-if="playing"
        :game-id="gameId"
        :game-ref="gameRef"
        @onstart="onCardMoveStart"
        @onmove="onCardMove"
        @onend="onCardMoveEnd"
    >
        <template #player-actions="props">
            <player-actions class="px-1" v-bind="props" :direction="direction" />
        </template>
    </player>
      
  </v-container>
</template>

<script>
import GameTable from '@/components/game/table';
import WaitingTable from '@/components/game/waiting';
import Enemies from '@/components/game/enemies';
import GameCard from '@/components/game/card';
import Player from '@/components/game/player';
import PlayerActions from '@/components/game/player-actions';

import firebase from 'firebase/app';
import 'firebase/database';

const fakeCard = {
    color: 'NONE',
    value: 2
};

export default {
    props: {
        gameId: {
            required: true,
            type: String
        }
    },

    components: {
        GameTable,
        WaitingTable,
        Enemies,
        GameCard,
        Player,
        PlayerActions
    },

    data() {
        return {
            gameRef: null,
            handRef: [],
            animatedCard: null,
            playerCard: fakeCard,
            showCard: false,
            playerCardPosition: {
                x: 0,
                y: 0,
                dx: 0,
                dy: 0
            }
        }
    },

    methods: {
        onCardMoveStart({ card, event }) {
            const { x, y } = event.target.getBoundingClientRect();
            const { dx, dy } = event;
            this.playerCard = card;
            this.playerCardPosition.x = x;
            this.playerCardPosition.y = y;
            this.playerCardPosition.dx = dx;
            this.playerCardPosition.dy = dy;
            this.showCard = true;
        },

        onCardMove({ event }) {
            const { dx, dy } = event;
            this.playerCardPosition.dx += dx;
            this.playerCardPosition.dy += dy;     
        },

        onCardMoveEnd() {
            this.playerCard = fakeCard;
            this.showCard = false;
        },

        animateCard(card, from, to) {
            const startX = from.getBoundingClientRect().left;
            const startY = from.getBoundingClientRect().top;

            const endX = to.getBoundingClientRect().left;
            const endY = to.getBoundingClientRect().top;

            const dx = endX - startX;
            const dy = endY - startY;

            document.documentElement.style.setProperty('--animated-card-left', `${startX}px`);
            document.documentElement.style.setProperty('--animated-card-top', `${startY}px`);
            document.documentElement.style.setProperty('--animated-card-dx', `${dx}px`);
            document.documentElement.style.setProperty('--animated-card-dy', `${dy}px`);
            
            this.animatedCard = card;
        },

        drawCardFromPlayerToTable(card, playerIndex) {
            const playedCard = this.$refs.gameTable.$children[1].$el;
            const player = this.$refs.enemies.$children[playerIndex].$el;


            this.animateCard(card, player, playedCard);           
        },

        drawCardFromDeckToPlayer(card, playerIndex) {
            const deck = this.$refs.gameTable.$children[0].$el;
            const player = this.$refs.enemies.$children[playerIndex].$el;

            this.animateCard(card, deck, player);
        },
    },

    firebase() {
        return {
            gameRef: firebase.database().ref(`games/${this.gameId}`),
        }
    },

    computed: {
        middleComponent() {
            return this.notStarted
                ? 'waiting-table'
                : 'game-table'
        },

        playerCardStyle() {
            const { x, y, dx, dy } = this.playerCardPosition;
            return {
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                transform: `translate3D(${dx}px, ${dy}px, 0) !important`
            };
        },

        notStarted() {
            return this.gameRef
                ? this.gameRef.status === 0
                : true;
        },

        playing() {
            return this.gameRef
                ? this.gameRef.status === 1
                : false;
        },

        finished() {
            return this.gameRef
                ? this.gameRef.status === 2
                : false;
        },

        containerStyle() {
            return {
                background: this.$vuetify.theme.themes.light.primary
            }
        },

        direction() {
            return this.gameRef
                ? this.gameRef.state.direction
                : 0;
        }
    }
}
</script>

<style>
    * {
        overscroll-behavior: none;
    }
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

    :root {
        --animated-card-dx: 0;
        --animated-card-dy: 0;
        --animated-card-top: 0;
        --animated-card-left: 0;
    }

    .player-card {
        z-index: 2;
    }

    .animated-card {
        position: absolute;
        top: var(--animated-card-top);
        left: var(--animated-card-left);   
    }

    .move-card-enter-active {
        animation: move-card-animation 0.5s cubic-bezier(0.445, 0.05, 0.55, 0.95);
    }

    @keyframes move-card-animation {
        0% {
            transform: rotate(-30deg);
        }

        100%  {
            transform: translate(var(--animated-card-dx), var(--animated-card-dy)) rotate(0deg); 
        }
    }
</style>