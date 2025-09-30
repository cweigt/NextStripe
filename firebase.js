// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import FIREBASE_KEYS from './config/firebase';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_KEYS.API_KEY,
  authDomain: FIREBASE_KEYS.AUTH_DOMAIN,
  databaseURL: FIREBASE_KEYS.DATABASE_URL,
  projectId: FIREBASE_KEYS.PROJECT_ID,
  storageBucket: FIREBASE_KEYS.STORAGE_BUCKET,
  messagingSenderId: FIREBASE_KEYS.MESSAGING_SENDER_ID,
  appId: FIREBASE_KEYS.APP_ID,
  measurementId: FIREBASE_KEYS.MEASUREMENT_ID,
};

// Initialize Firebase
//initialize Firebase
const app = initializeApp(firebaseConfig);

//initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

//initialize Database
const db = getDatabase(app);

//initialize Storage
const storage = getStorage(app);

//ensure Firebase is initialized
if (!app) {
    throw new Error('Firebase failed to initialize');
}

export { auth, db, storage };
