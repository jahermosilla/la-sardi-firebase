<template>
  <button @click="loginWithGoogle">Hello</button>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'Home',

  created() {
    firebase.auth().onAuthStateChanged(user => console.log('User', user));
  },
  methods: {
    async loginWithGoogle() {
      const response = await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
      console.log(response);
    }
  }
}
</script>
