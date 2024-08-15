import { cert, initializeApp } from "firebase-admin/app";
import serviceAccountKey from "./serviceAccountKey.json" with { type: "json" };
import { getFirestore } from "firebase-admin/firestore";

export const app = initializeApp({
  credential: cert(serviceAccountKey),
});

export const firestore = getFirestore();
