import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';

export const SERVER_URL =
         "https://us-central1-la-sardi-acd1a.cloudfunctions.net/server";

axios.defaults.baseURL = SERVER_URL;


firebase
  .auth()
  .onAuthStateChanged(
    (credentials) =>
      (axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${credentials.getIdToken()}`)
  );

export async function createGame() {
    return axios.post('/game/create', {});
}