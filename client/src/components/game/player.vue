<template>
    <div v-resize="onResize" class="card-list pt-2 game-row d-flex flex-row justify-space-between">
        <div class="actions px-1">
            <v-btn @click="selectedOrder = 'P'" icon class="white--text headline" :color="selectedOrder === 'P' ? 'green' : 'none'">P</v-btn>
            <v-btn @click="selectedOrder = 'V'" icon class="white--text headline" :color="selectedOrder === 'V' ? 'green' : 'none'">V</v-btn>
        </div>

        <div
            v-sardi-draggable="{
                inertia: true,
                startAxis: 'x',
                onmove: onListScrollMove
            }"
            ref="scrollWrapper"
            style="overflow: hidden;"
            class="flex-grow-1"
        >
            <transition-group @after-enter="onResize" ref="scrollChild" :style="scrollStyle" style="white-space: nowrap; width: fit-content;" name="list" tag="ul" mode="in-out">
                <li style="list-decoration: none; display: inline-flex;" v-for="(card, i) in handOrdered" :key="`${card.value}${card.color}${i}`">
                    <game-card
                        v-bind="card"
                        :with-back="false"
                        class="mx-1"
                        :disabled="!myTurn || !isCardPlayable(card)"
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
            wrap: false
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
            return {
                transform: `translateX(${this.scrollPositionX}px)`
            }
        },

        handOrdered() {            
            const colorOrder = ['OROS', 'COPAS', 'ESPADAS', 'BASTOS'];
            if (this.selectedOrder === 'V') {
                return this.handRef.slice().sort((a, b) => a.value - b.value);
            }

            return this.handRef.slice().sort((a, b) => {
                if (a.color === b.color) {
                    return a.value - b.value;
                }

                return colorOrder.indexOf(a.color) - colorOrder.indexOf(b.color)
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
        async onResize() {
            await this.$nextTick();
            const parentWidth = +getComputedStyle(this.$refs.scrollWrapper).width.replace('px', '');
            const totalWidth = +getComputedStyle(this.$refs.scrollChild.$el).width.replace('px', '');

            if (totalWidth <= parentWidth) {
                this.scrollPositionX = (parentWidth - totalWidth) / 2;
            }
        },

        onListScrollMove(event) {
            const parentWidth = +getComputedStyle(this.$refs.scrollWrapper).width.replace('px', '');
            const totalWidth = +getComputedStyle(this.$refs.scrollChild.$el).width.replace('px', '');

            console.log(parentWidth, totalWidth);

            if (totalWidth <= parentWidth) {
                return this.scrollPositionX = (parentWidth - totalWidth) / 2;
            }

            if (Math.sign(event.dx) === 1 && 
                (this.scrollPositionX + event.dx) > 0) 
            {
                return this.scrollPositionX = 0;
            }

            if (Math.sign(event.dx) === -1 &&
                Math.abs(this.scrollPositionX + event.dx) > (totalWidth - parentWidth))
            {
                return this.scrollPositionX = -(totalWidth - parentWidth);
            }

            this.scrollPositionX += event.dx;
        },

        onstart(card) {
            return (event) => {
                this.$emit('onstart', { card, event });
            }
        },

        onend(card) {
            return (event) => {
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
    },

    watch: {
        handRef: 'onResize'
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