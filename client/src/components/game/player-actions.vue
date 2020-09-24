<template>
    <div class="actions">
        <v-btn icon v-show="imOwner" @click="startGame">
            <v-icon style="font-size: 1.9rem;">send</v-icon>
        </v-btn>
        <v-btn icon @click="pass">
            <v-icon style="font-size: 2.5rem;">{{directionIcon}}</v-icon>
        </v-btn>
    </div>
</template>

<script>
import * as db from '@/db';

export default {
    props: {
        gameRef: {
            required: true
        },

        myTurn: {
            type: Boolean,
            required: true
        },

        imOwner: {
            type: Boolean,
            required: true
        },

        direction: {
            type: Number,
            required: true
        }
    },

    computed: {
        directionIcon() {
            return this.direction === 0 ? 'switch_right' : 'switch_left';
        }
    },

    methods: {
        async startGame() {
            await db.startGame(this.gameRef()['.key']);
        },

        async pass() {
            await db.pass(this.gameRef()['.key']);
        },
    }

}
</script>

<style>
.actions {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-content: center;
}
</style>