// Conveniently import this file anywhere to use db
import axios from 'axios';
import firebase from 'firebase';
import 'firebase/firestore';

export const db = firebase
    .initializeApp({ 
        apiKey: "AIzaSyDbdk4jbvCudQYjhRTftKRpWxVx1QdrMgM",
        authDomain: "la-sardi-acd1a.firebaseapp.com",
        databaseURL: "https://la-sardi-acd1a.firebaseio.com",
        projectId: "la-sardi-acd1a",
        storageBucket: "la-sardi-acd1a.appspot.com",
        messagingSenderId: "130714585941",
        appId: "1:130714585941:web:5a0b0fd83bead6a0a1bddc",
        measurementId: "G-7RRDK5E1ZV"
    })
    .firestore();


// Export types that exists in Firestore - Uncomment if you need them in your app
// const { Timestamp, GeoPoint } = firebase.firestore
// export { Timestamp, GeoPoint }

export const SERVER_URL =
    "https://us-central1-la-sardi-acd1a.cloudfunctions.net/server";

axios.defaults.baseURL = SERVER_URL;


firebase
    .auth()
    .onAuthStateChanged(
        async (credentials) =>
            (axios.defaults.headers.common["Authorization"] = `Bearer ${await credentials.getIdToken()}`)
    );

export async function createGame() {
    return axios.post('/game', {});
}