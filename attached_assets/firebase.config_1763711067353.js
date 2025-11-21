// firebase.config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "tyt-ayt-tracker.firebaseapp.com",
  projectId: "tyt-ayt-tracker",
  storageBucket: "tyt-ayt-tracker.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
  measurementId: "G-XXXXXXXXXX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const messaging = getMessaging(app);

export default app;