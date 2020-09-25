<template>
    <v-container fluid class="py-0">
        <v-row justify="space-between">
            <v-col class="d-flex child-flex" v-for="enemy in enemies" :key="enemy.uid" :cols="3" :sm="2" :lg="1">
                <enemy v-bind="enemy"/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Enemy from '@/components/game/enemy';
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
    props: {
        gameRef: {
            required: true
        }
    },

    components: {
        Enemy
    },

    methods: {
        mapEnemy(uid) {
            return {
                uid,
                turn: this.gameRef.state.turn === uid,
                cards: this.gameRef.state.counts.cards[uid] || 0
            }
        }
    },

    computed: {
        enemies() {
            if (!this.gameRef) {
                return [];
            }

            const playerId = firebase.auth().currentUser.uid;

            return Object
                .keys(this.gameRef.players)
                .filter(pid => pid !== playerId)
                .map(this.mapEnemy);
        }
    }
}
</script>