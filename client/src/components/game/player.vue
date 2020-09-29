<template>
    <div class="card-list pt-2 game-row d-flex flex-row justify-space-between">
        <div class="actions">
            <v-btn @click="selectedOrder = 'P'" icon class="white--text headline" :color="selectedOrder === 'P' ? 'green' : 'none'">P</v-btn>
            <v-btn @click="selectedOrder = 'V'" icon class="white--text headline" :color="selectedOrder === 'V' ? 'green' : 'none'">V</v-btn>
        </div>

            <div ref="scrollWrapper" style="overflow: hidden; max-width: 80vw;" >
                <transition-group ref="scrollChild" :style="scrollStyle" style="white-space: nowrap; width: fit-content;" name="list" tag="ul" mode="in-out">
                    <li style="list-decoration: none; display: inline-block;" v-for="(card, i) in handOrdered" :key="`${card.value}${card.color}${i}`">
                        <game-card
                            v-bind="card"
                            :with-back="false"
                            class="mx-1"
                            style="display: inline-block; z-index: 100;"
                            :disabled="!myTurn || !isCardPlayable(card)"
                            :class="{ handle: myTurn && isCardPlayable(card) }"
                        />
                    </li>
                </transition-group>
            </div>

        <slot name="player-actions" v-bind="{ gameRef, myTurn, imOwner }" />
    </div>
</template>

<script>
import interact from 'interactjs';
import GameCard from '@/components/game/card';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
// import { debounce } from 'lodash';

export default {
    components: {
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
            handRef: [],
            selectedOrder: 'P',
            scrollPositionX: 0,
            wrap: false,
            // debounceSetPosition: debounce(val => this.scrollPositionX = val, 50)
        }
    },

    firebase() {
        const playerId = firebase.auth().currentUser.uid;

        return {
            handRef: firebase.database().ref(`hands/${this.gameId}/${playerId}`)
        }
    },

    mounted() {
        interact(this.$refs.scrollWrapper)
        .draggable({
            inertia: true,
            startAxis: 'x',
            onmove: (event) => {
                const parentWidth = +getComputedStyle(this.$refs.scrollWrapper).width.replace('px', '');
                const totalWidth = +getComputedStyle(this.$refs.scrollChild.$el).width.replace('px', '');

                if (Math.sign(event.dx) === 1 && (this.scrollPositionX + event.dx) > 0) {
                    // this.debounceSetPosition(0);
                    return this.scrollPositionX = 0;
                }

                if (Math.sign(event.dx) === -1 && Math.abs(this.scrollPositionX + event.dx) > (totalWidth - parentWidth)) {
                    // this.debounceSetPosition(-(totalWidth - parentWidth));
                    return this.scrollPositionX = -(totalWidth - parentWidth);
                }

                this.scrollPositionX += event.dx;
            },

            // onend: () => {
            //     const parentWidth = +getComputedStyle(this.$refs.scrollWrapper).width.replace('px', '');
            //     const totalWidth = +getComputedStyle(this.$refs.scrollChild.$el).width.replace('px', '');
            //     const gap = 20;

            //     console.log(parentWidth, totalWidth, this.scrollPositionX);

            //     if (this.scrollPositionX >= gap) {
            //         this.scrollPositionX = 0;
            //     } else if (Math.abs(this.scrollPositionX) >= totalWidth - gap) {
            //         this.scrollPositionX = -(totalWidth - parentWidth);
            //     }
            // }
        });
    },

    computed: {
        scrollStyle() {
            return {
                transform: `translateX(${this.scrollPositionX}px)`
            }
        },

        handOrdered() {
            const colorOrder = ['OROS', 'COPAS', 'ESPADAS', 'BASTOS'];
            if (this.selectedOrder === 'P') {
                return this.handRef.slice().sort((a, b) => {
                    if (a.color === b.color) {
                        return a.value - b.value;
                    }

                    return colorOrder.indexOf(a.color) - colorOrder.indexOf(b.color)
                });
            }

            return this.handRef.slice().sort((a, b) => a.value - b.value);
        },
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
        setPosition(val) {
            this.scrollPositionX = val;
        },

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
.list-enter-active, .list-leave-active {
  transition: all 0.8s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  width: 0px;
  transform: translate(-100px, 100px);
}
</style>