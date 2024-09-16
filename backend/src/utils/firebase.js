import { cert, initializeApp } from "firebase-admin/app";
import serviceAccountKey from "../../serviceAccountKey.json" with { type: "json" };
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from 'firebase-admin/storage'
import dotenv from 'dotenv'
dotenv.config()

export const app = initializeApp({
  credential: cert(serviceAccountKey),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

export const firestore = getFirestore();
export const storage = getStorage().bucket()
