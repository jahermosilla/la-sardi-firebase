<template>
    <div style="background: rgba(0, 0, 0, 0.25); min-width: 90%;" class="elevation-4 mx-4 mb-4 pa-0 rounded d-flex flex-grow-1 flex-row flex-column justify-center align-center">
        <div class="my-2">
            <div class="text-center">Jugadores</div>
            <div class="text-center">{{actualPlayers}} / {{maxPlayers}}</div>
        </div>
        
        <v-btn @click="startGame" :disabled="actualPlayers < 2" color="green" text v-if="imOwner" :loading="loading">
            <span class="white--text">EMPEZAR PARTIDA</span>
            <v-spacer></v-spacer>
            <v-icon right>mdi-send</v-icon>
        </v-btn>
        <div v-else class="white--text text-center px-2 d-flex flex-column">
            Esperando a que el creador empiece la partida
            <v-icon color="green lighten-2">mdi-dots-horizontal</v-icon>
        </div>
    </div>
</template>

<script>
import * as db from '@/db';
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
    props: {
        gameRef: {
            required: true
        }
    },

    data() {
        return {
            loading: false
        }
    },

    methods: {
        async startGame() {
            this.loading = true;

            try {
                await db.startGame(this.gameRef['.key']);
            } catch (error) {
                // TODO: Show error message
                console.error(error);
            } finally {
                this.loading = false;
            }
        }
    },

    computed: {
        imOwner() {
            return this.gameRef
                ? this.gameRef.owner === firebase.auth().currentUser.uid
                : false;
        },

        maxPlayers() {
            return this.gameRef
                ? this.gameRef.properties.qtt.players
                : 0;
        },

        actualPlayers() {
            return this.gameRef
                ? Object.keys(this.gameRef.players || {}).length
                : 0;
        }
    }
}
</script>

<style>

</style>