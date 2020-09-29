<template>
  <v-card>
    <v-card-title class="headline">Unirse a una partida</v-card-title>

    <v-card-text style="height: 300px;" class="py-2">
      <v-form :disabled="isLoading">
        <v-text-field
            v-model="token"
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
        :disabled="!token"
        :loading="isLoading"
      >UNIRSE</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as db from '@/db';

export default {
    data() {
        return {
            token: null,

            isLoading: false
        }
    },

    methods: {
        async joinGame() {
            this.isLoading = true;
            try {
                const { data: { key: gameId } } = await db.join(this.token);
                this.$router.push({ name: 'Game', params: { gameId } })
            } catch (error) {
                // TODO SHOW ERROR
                console.error(error);              
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