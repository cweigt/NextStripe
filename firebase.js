// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXAm3MZUsoF5FqI_aWyfxQnZHy0iokudw",
  authDomain: "martial-arts-102cd.firebaseapp.com",
  databaseURL: "https://martial-arts-102cd-default-rtdb.firebaseio.com",
  projectId: "martial-arts-102cd",
  storageBucket: "martial-arts-102cd.firebasestorage.app",
  messagingSenderId: "991764331032",
  appId: "1:991764331032:web:66efe3173d33cd05b2a16d",
  measurementId: "G-MLPCE9R2M7"
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

//ensure Firebase is initialized
if (!app) {
    throw new Error('Firebase failed to initialize');
}

export { auth, db };
