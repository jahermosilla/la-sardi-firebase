<template>
    <v-badge bordered bottom  offset-x="22px" offset-y="22px" ripple :size="30" @click="() => {}" style="cursor: pointer;" overlap :value="true" :content="`${cards}`" :color="badgeColor" class="user-turn">
        <v-card class="pa-2 d-flex flex-column justify-center align-center">
            <v-img class="rounded"  src="https://api.adorable.io/avatars/285/abott@adorable.png"></v-img>
            <div class="subtitle py-2" style="text-overflow: ellipsis; max-width: 50%; overflow: hidden; white-space: nowrap;">{{uid}}</div>
        </v-card>
    </v-badge>
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

    computed: {
        badgeColor() {
            return this.turn ? 'green' : 'grey';
        }
    }
}
</script>

<style>

</style>

<style>
.user-turn {
    animation: user-turn-animation;
    animation-duration: 0.2s;
    animation-iteration-count: infinite;
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