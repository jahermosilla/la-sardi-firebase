<template>
    <v-card
        @animationend="playTurnAnimation = false"
        :class="{ 'user-turn': playTurnAnimation }"
        class="mx-1"
        max-height="20vh"
    >
        <v-card-text class="pa-1 d-flex flex-column align-center">
        <div class="enemy-name--text font-weight-bold">{{name}}</div>
        <v-avatar :size="50">
            <img :src="photoURL" alt="">
        </v-avatar>
        </v-card-text>
        <v-card-actions class="grey lighten-4">
            <v-spacer></v-spacer>            
            <v-avatar size="25" class="white--text pa-1" :color="badgeColor">{{cards}}</v-avatar>
        </v-card-actions>
    </v-card>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';

export default {
    props: {
        uid: {
            required: true,
            type: String
        },

        turn: {
            required: true,
            type: Boolean
        },

        cards: {
            required: true,
            type: Number
        }
    },

    data() {
        return {
            playTurnAnimation: false,
            userData: null
        }
    },

    firebase() {
        return {
            userData: firebase.database().ref(`users/${this.uid}`)
        }
    },

    computed: {
        name() {
            return this.userData ? this.userData.name : this.uid;
        },

        photoURL() {
            return this.userData
                ? this.userData.photoURL
                : 'https://api.adorable.io/avatars/285/abott@adorable.png';
        },

        badgeColor() {
            return this.turn ? 'green' : 'grey';
        }
    },

    watch: {
        turn: {
            immediate: true,
            handler(val) {
                val && (this.playTurnAnimation = true);
            }
        }
    }
}
</script>

<style>

</style>

<style>
.enemy-name--text {
    text-overflow: ellipsis;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    user-select: none;
}

.user-turn {
    animation: user-turn-animation;
    animation-duration: 0.2s;
    animation-iteration-count: 4;
    animation-timing-function: cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

@keyframes user-turn-animation {
    25% {
        transform: rotateZ(-5deg);
    }

    75% {
        transform: rotateZ(5deg);
    }
}
</style>