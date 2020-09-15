// Conveniently import this file anywhere to use db

import firebase from 'firebase/app';
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
