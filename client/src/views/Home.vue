<template>
  <v-container class="fill-height" fluid :style="containerStyle">
    <v-app-bar app color="primary" class="elevation-0">
      <v-btn icon>
        <v-avatar :size="40">
          <img :src="user.photoURL" :alt="user.displayName">
        </v-avatar>
      </v-btn>
      
      <v-toolbar-title>{{user.displayName}}</v-toolbar-title>
    </v-app-bar>

    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-img :src="backgroundImage" contain max-height="45vh"></v-img>
      </v-col>

      <v-col cols="12" class="text-center text-h4">
        LA SARDI
      </v-col>

      <v-col cols="12" md="3" class="text-center">
        <v-btn text block dark @click="dialogs.createGame.opened = true">CREAR PARTIDA</v-btn>
      </v-col>
      <v-col cols="12" md="3" class="text-center">
        <v-btn text block dark @click="dialogs.joinGame.opened = true">UNIRSE</v-btn>
      </v-col>
    </v-row>


    <v-dialog
      v-model="dialogs.createGame.opened"
      :persistent="dialogs.createGame.persistent"
      scrollable
      max-width="300px"
    >
      <create-game @loading="(value) => dialogs.createGame.persistent = value"/>
    </v-dialog>

    <v-dialog
      v-model="dialogs.joinGame.opened"
      :persistent="dialogs.joinGame.persistent"
      scrollable
      max-width="300px"
    >
      <join-game @loading="(value) => dialogs.joinGame.persistent = value"/>
    </v-dialog>
  </v-container>
</template>

<script>
import CreateGame from '@/components/dialogs/CreateGame';
import JoinGame from '@/components/dialogs/JoinGame';
import backgroundImage from '@/assets/back.svg';
import firebase from 'firebase';

export default {
  name: 'Home',

  components: {
    CreateGame,
    JoinGame
  },

  data() {
    return {
      backgroundImage,
      user: null,
      dialogs: {
        createGame: {
          opened: false,
          persistent: false
        },
        joinGame: {
          opened: false,
          persistent: false
        }
      }
    }
  },

  created() {
    this.user = firebase.auth().currentUser;
  },

  computed: {
    containerStyle() {
      return {
        background: this.$vuetify.theme.themes.light.primary
      }
    }
  }
}
</script>
<style>
  .full {
    flex: 1 1 !important;
  }
</style>