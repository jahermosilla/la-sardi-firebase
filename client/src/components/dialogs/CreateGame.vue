<template>
  <v-card>
    <v-card-title class="headline">Crear nueva partida</v-card-title>

    <v-card-text style="height: 300px;" class="py-2">
      <v-form :disabled="isLoading">
        <v-select
            v-model="playersQtt"
            :items="playersQttItems"
            label="Número de jugadores"
            outlined
        />

        <v-select
            v-model="decksQtt"
            :items="decksQttItems"
            label="Número de barajas"
            outlined
        />

        <v-select
            v-model="dealedCardsQtt"
            :items="dealedCardsQttItems"
            label="Número de cartas inicial"
            outlined
        />
      </v-form>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-checkbox
        v-model="isPrivate"
        :disabled="isLoading"
        label="Partida privada"
        class="ma-0"
        hide-details />

      <v-spacer></v-spacer>

      <v-btn
        @click="createGame"
        text
        color="primary"
        :loading="isLoading"
      >CREAR</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as db from '@/db';

export default {
    data() {
        return {
            playersQttItems: Array.from({ length: 4 }).map((val, index) => index + 2),
            decksQttItems: Array.from({ length: 4 }).map((val, index) => index + 1),
            dealedCardsQttItems: [3, 6, 9],

            playersQtt: 2,
            decksQtt: 1,
            dealedCardsQtt: 3,

            isPrivate: false,

            isLoading: false
        }
    },

    methods: {
        async createGame() {
            this.isLoading = true;

            try {
                const isPrivate = this.isPrivate;
                const qtt = {
                  cards: this.dealedCardsQtt,
                  decks: this.decksQtt,
                  players: this.playersQtt
                };

                const { data: { key: gameId } } = await db.createGame({ isPrivate, qtt });
                this.$router.push({ name: 'Game', params: { gameId } })
            } catch (error) {
                // Do nothing
            } finally {
                this.isLoading = false;
            }
        }
    },

    watch: {
        isLoading(value) {
            this.$emit('loading', value);
        }
    }
}
</script>

<style>

</style>