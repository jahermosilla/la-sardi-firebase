<template>
  <v-dialog width="fit-content" scrollable persistent v-model="value">
      <v-card>
          <v-card-title>
              Cambiar palo
          </v-card-title>
          <v-card-text style="max-height: 50vh;" class="d-flex align-center px-4 py-2">
              <game-card
                class="change-color-card d-inline-block mx-1"
                :class="{ selected: card.color === color }"
                @click.native="color = card.color"
                :disabled="false"
                v-for="card in cards"
                v-bind="card"
                :key="card.color"></game-card>
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

export default {
    inheritAttrs: false,

    props: {
        value: {
            type: Boolean,
            required: true
        }
    },

    data() {
        return {
            color: null,
            cards: ['OROS', 'COPAS', 'ESPADAS', 'BASTOS'].map(color => ({ value: 10, color }))
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
.change-color-card {
    opacity: 0.5;
    transition: opacity 0.35s ease-in-out;
}

.change-color-card.selected {
    opacity: 1;
}
</style>