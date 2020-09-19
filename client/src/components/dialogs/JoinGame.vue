<template>
  <v-card>
    <v-card-title class="headline">Unirse a una partida</v-card-title>

    <v-card-text style="height: 300px;" class="py-2">
      <v-form :disabled="isLoading">
        <v-text-field
            v-model="gameId"
            label="Código de la partida"
            autofocus
            outlined
        />
      </v-form>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        @click="joinGame"
        text
        color="primary"
        :disabled="!gameId"
        :loading="isLoading"
      >UNIRSE</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
    data() {
        return {
            gameId: null,

            isLoading: false
        }
    },

    methods: {
        joinGame() {
            // TODO: call service
            this.isLoading = true;
            setTimeout(() => this.isLoading = false, 2000);
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