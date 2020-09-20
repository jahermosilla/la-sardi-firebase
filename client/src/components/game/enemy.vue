<template>
    <v-badge overlap :value="true" :content="`${cards}`" :color="badgeColor">
        <v-card max-width="100">
            <v-card-text>{{uid}}</v-card-text>
            <v-card-actions>
            </v-card-actions>
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