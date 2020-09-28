<template>
    <div class="actions">
        <v-btn :disabled="!myTurn" icon @click="pass">
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

        direction: {
            type: Number,
            required: true
        }
    },

    computed: {
        directionIcon() {
            // return this.direction === 0 ? 'switch_right' : 'switch_left';
            return 'mdi-swap-horizontal';
        },

        gameStarted() {
            return this.gameRef.status === 1
        }
    },

    methods: {
        async pass() {
            await db.pass(this.gameRef['.key']);
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