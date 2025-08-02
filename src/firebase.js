// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"; // ✅ Add Firestore import

const firebaseConfig = {
  apiKey: "AIzaSyB6uKNxaoHaheJgoZg6FJ2f0COU_sX-jtc",
  authDomain: "movie-db-d7c32.firebaseapp.com",
  projectId: "movie-db-d7c32",
  storageBucket: "movie-db-d7c32.appspot.com",
  messagingSenderId: "678458513404",
  appId: "1:678458513404:web:0138ee03bd54b4a11f0479",
  measurementId: "G-VBNJ45142Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app); // ✅ Export Firestore instance
