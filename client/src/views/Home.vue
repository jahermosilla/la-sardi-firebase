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

import firebase from 'firebase/app';
import 'firebase/auth';

import { shuffle, sampleSize } from "lodash";
import { COLORS } from "@/constants";

export default {
  name: 'Home',

  components: {
    CreateGame,
    JoinGame
  },

  data() {
    return {
      randomCards: [],
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
    
    const deck = COLORS
      .map(color => Array.from({ length: 12 }).map((_, i) => ({ color, value: i + 1 })))
      .reduce((a, b) => a.concat(b));

    this.randomCards = sampleSize(shuffle(deck), 5);
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

  .cards-container {
    position: absolute;
    display: flex;
    max-width: 90vw;
    overflow: hidden;
  }

  .cards-container * {
    margin:10px;
  }

  .home-game-card  {
    animation: home-game-card-animation 1s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
  }

  .home-game-card:nth-child(1)  {
    animation-delay: 30ms;
  }

  .home-game-card:nth-child(2)  {
    animation-delay: 200ms;
  }

  .home-game-card:nth-child(3)  {
    animation-delay: 700ms;
  }

  .home-game-card:nth-child(4)  {
    animation-delay: 900ms;
  }

  .home-game-card:nth-child(5)  {
    animation-delay: 1000ms;
  }

  @keyframes home-game-card-animation {
    0% {
      transform: translateY(-1000px);
    }

    100% {
      transform: translateY(1000px) rotateY(random(360)deg);
    }
  }
</style>