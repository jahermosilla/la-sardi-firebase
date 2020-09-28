import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { IUserNode } from "../../lib/interfaces/game";

const onUserCreated = functions.auth.user().onCreate(async (user, context) => {
    const userData: IUserNode[keyof IUserNode] = {
      name: (user.displayName || null) as string,
      photoURL: user.photoURL as string,
      rank: {
        wins: 0,
        lost: 0,
        played: 0,
      },
    };

    await admin.database().ref(`users/${user.uid}/`).update(userData);
});

export default onUserCreated;

