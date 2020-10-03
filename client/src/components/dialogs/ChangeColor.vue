<template>
  <v-dialog width="fit-content" scrollable persistent :value="value">
      <v-card>
          <v-card-title>
              Cambiar palo
          </v-card-title>
          <v-card-text
            class="change-color-container px-4 py-2"
          >
              <game-card
                class="change-color-card mx-1"
                @click.native="color = card.color"
                :disabled="card.color !== color"
                v-for="card in cards"
                v-bind="card"
                :key="card.color" />
          </v-card-text>

          <v-card-actions color="primary">
              <v-spacer />
              <v-btn @click="submit" :disabled="!color" text color="primary">CAMBIAR</v-btn>
          </v-card-actions>
      </v-card>
  </v-dialog>
</template>

<script>
import GameCard from '@/components/game/card';
import { COLORS } from "@/constants";

export default {
    inheritAttrs: false,

    props: {
        value: {
            type: Boolean,
            required: true
        }
    },

    created() {
        // Reset last value
        this.color = null;
    },

    data() {
        return {
            color: null,
            cards: COLORS.map(color => ({ value: 10, color }))
        }
    },

    components: {
        GameCard
    },

    methods: {
        submit() {
            const card = this.cards.find(({ color }) => color === this.color);

            this.$emit('input', false);
            this.$emit('submit', card);
        }
    }
}
</script>

<style>
.change-color-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1em;
}

.change-color-card:nth-child(1) {
    grid-row: 1;
    grid-column: 1;
}

.change-color-card:nth-child(2) {
    grid-row: 1;
    grid-column: 2;
}

.change-color-card:nth-child(3) {
    grid-row: 2;
    grid-column: 1;
}

.change-color-card:nth-child(4) {
    grid-row: 2;
    grid-column: 2;
}
</style>