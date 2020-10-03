<template>
    <div class="card-list pt-2 game-row d-flex flex-row justify-space-between">
        <div class="actions px-1">
            <v-btn @click="selectedOrder = 'P'" icon class="white--text headline" :color="selectedOrder === 'P' ? 'green' : 'none'">P</v-btn>
            <v-btn @click="selectedOrder = 'V'" icon class="white--text headline" :color="selectedOrder === 'V' ? 'green' : 'none'">V</v-btn>
        </div>

        <div
            v-sardi-draggable="{
                inertia: true,
                autoScroll: true,
                startAxis: 'x',
                onstart: onListScrollMoveStart,
                onmove: onListScrollMove,
                onend: onListScrollMoveEnd
            }"
            ref="scrollWrapper"
            style="overflow: hidden; touch-action: none;"
            class="flex-grow-1"
        >
            <transition-group ref="scrollChild" class="mx-auto" :style="scrollStyle" style="white-space: nowrap; width: fit-content;" name="list" tag="ul" mode="out-in">
                <li
                    style="list-decoration: none; display: inline-flex;"
                    v-for="(card, i) in handOrdered"
                    :key="`${card.value}${card.color}${i}`"
                    :style="{ transitionDelay: `${0.05 * i}s` }"
                >
                    <game-card
                        v-bind="card"
                        :with-back="false"
                        class="mx-1"
                        :disabled="isMovingCard || !myTurn || !isCardPlayable(card)"
                        :class="{ handle: myTurn && isCardPlayable(card) }"
                        v-sardi-draggable="{
                            enabled: myTurn && isCardPlayable(card),
                            startAxis: myTurn ? 'y' : 'xy',
                            onstart: onstart(card),
                            onend: onend(card),
                            onmove: onmove(card)
                        }"
                    />
                </li>
            </transition-group>
        </div>

        <slot name="player-actions" v-bind="{ gameRef, myTurn, imOwner }" />
    </div>
</template>

<script>
import GameCard from '@/components/game/card';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { COLORS } from "@/constants";

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
            isMoving: false,
            isMovingCard: false
        }
    },

    firebase() {
        const playerId = firebase.auth().currentUser.uid;

        return {
            handRef: firebase.database().ref(`hands/${this.gameId}/${playerId}`)
        }
    },

    computed: {
        scrollStyle() {
            console.log(this.isMoving);
            return {
                transform: `translateX(${this.scrollPositionX}px)`,
                transition: this.isMoving ? 'none' : '.3s cubic-bezier(.25,.8,.5,1)'
            }
        },

        handOrdered() {            
            if (this.selectedOrder === 'V') {
                return this.handRef.slice().sort((a, b) => a.value - b.value);
            }

            return this.handRef.slice().sort((a, b) => {
                if (a.color === b.color) {
                    return a.value - b.value;
                }

                return COLORS.indexOf(a.color) - COLORS.indexOf(b.color)
            });
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
        onListScrollMoveStart() {
            console.log('started scroll', this)
            this.isMoving = true;
        },

        onListScrollMoveEnd() {
            const parentWidth = +getComputedStyle(this.$refs.scrollWrapper).width.replace('px', '');
            const totalWidth = +getComputedStyle(this.$refs.scrollChild.$el).width.replace('px', '');


            this.isMoving = false;

            if (totalWidth < parentWidth) {
                return this.scrollPositionX = 0;
            }

            
            if (this.scrollPositionX < -(totalWidth - parentWidth)) {
                this.scrollPositionX = -(totalWidth - parentWidth);
            }

            if (this.scrollPositionX > 0) {
                this.scrollPositionX = 0;
            }


        },


        onListScrollMove(event) {
            this.scrollPositionX += event.dx;
        },

        onstart(card) {
            return (event) => {
                this.isMovingCard = true;
                this.$emit('onstart', { card, event });
            }
        },

        onend(card) {
            return (event) => {
                this.isMovingCard = false;
                this.$emit('onend', { card, event });
            }
        },

        onmove(card) {
            return (event) => {
                this.$emit('onmove', { card, event });
            }
        },

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
  transform: translate(-1000px, 1000px);
  visibility: hidden;
}
</style>