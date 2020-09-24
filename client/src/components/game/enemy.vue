<template>
    <div
        class="child-flex"
        @animationend="playTurnAnimation = false"
        :class="{ 'user-turn': playTurnAnimation }"
    >
        <v-badge
            bordered
            bottom
            offset-x="22px"
            offset-y="22px"
            ripple
            :size="30"
            @click="() => {}"
            style="cursor: pointer;"
            overlap
            :value="true"
            :content="`${cards}`"
            :color="badgeColor"
        >
            <v-card class="pa-2 d-flex flex-column justify-center align-center">
                <v-img class="rounded"  src="https://api.adorable.io/avatars/285/abott@adorable.png"></v-img>
                <div class="subtitle py-2 enemy-name--text">{{uid}}</div>
            </v-card>
        </v-badge>
    </div>
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
    max-width: 50%;
    overflow: hidden;
    white-space: nowrap;
    user-select: none;
}

.user-turn {
    animation: user-turn-animation;
    animation-duration: 0.2s;
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