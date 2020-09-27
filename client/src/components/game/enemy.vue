<template>
    <v-card max-height="20vh" class="mx-1">
        <v-card-text class="pa-1 d-flex flex-column align-center">
        <div class="enemy-name--text font-weight-bold">{{uid}}</div>
        <v-avatar :size="50" @animationend="playTurnAnimation = false" :class="{ 'user-turn': playTurnAnimation }">
            <img src="https://api.adorable.io/avatars/285/abott@adorable.png" alt="">
        </v-avatar>
        </v-card-text>
        <v-card-actions class="grey lighten-4">
            <v-spacer></v-spacer>            
            <v-avatar size="25" class="white--text pa-1" :color="badgeColor">{{cards}}</v-avatar>
        </v-card-actions>
    </v-card>
</template>

<script>
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
            playTurnAnimation: false
        }
    },

    computed: {
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