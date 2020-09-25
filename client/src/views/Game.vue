<template>
  <v-container fluid class="py-0 fill-height d-flex flex-column" :style="containerStyle">
    <!-- Animated Card -->
    <transition @after-enter="animatedCard = null" name="move-card">
        <game-card v-if="!!animatedCard" v-bind="animatedCard" class="animated-card"></game-card>
    </transition>

    <!-- Enemies -->
    <enemies :game-ref="gameRef" ref="enemies" />

    <!-- Table -->
    <game-table :game-ref="gameRef" ref="gameTable" />

    <!-- Player -->
    <player :game-id="gameId" :game-ref="gameRef">
        <template #player-actions="props">
            <player-actions v-bind="props" :direction="direction" />
        </template>
    </player>
      
  </v-container>
</template>

<script>
import GameTable from '@/components/game/table';
import Enemies from '@/components/game/enemies';
import GameCard from '@/components/game/card';
import Player from '@/components/game/player';
import PlayerActions from '@/components/game/player-actions';

import firebase from 'firebase/app';
import 'firebase/database';

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
        Player,
        PlayerActions
    },

    data() {
        return {
            gameRef: null,
            handRef: [],
            animatedCard: null
        }
    },

    // mounted() {
    //     setInterval(() => {
    //         const card = {
    //             color: 'NONE',
    //             value: 2
    //         }

    //         this.drawCardFromPlayerToTable(card, 2)
    //     }, 500);
    // },

    methods: {
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
            gameRef: firebase.database().ref(this.gameId),
        }
    },

    computed: {
        containerStyle() {
            return {
                background: this.$vuetify.theme.themes.light.primary
            }
        },

        direction() {
            if (!this.gameRef) {
                return 0;
            }

            return this.gameRef.state.direction;
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

    :root {
        --animated-card-dx: 0;
        --animated-card-dy: 0;
        --animated-card-top: 0;
        --animated-card-left: 0;
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