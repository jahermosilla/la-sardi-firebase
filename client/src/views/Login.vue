<template>
  <v-container class="fill-height" fluid :style="containerStyle">
    <v-row align="center" justify="center">
      <v-col cols="12" md="3" class="text-center">
        <v-btn text block dark @click="loginWithGoogle">INICIAR SESIÓN CON GOOGLE</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "firebase";

export default {
  computed: {
    containerStyle() {
      return {
        background: this.$vuetify.theme.themes.light.primary
      }
    }
  },

  methods: {
    async loginWithGoogle() {
      try {
        const credentials = await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
        
        if(credentials) {
          this.$router.push({ path: '/' });
        }
      } catch (error) {
        console.info(error);
        // Do nothing
      }
    }
  }
}
</script>

<style>

</style>