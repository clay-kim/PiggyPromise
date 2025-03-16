import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Realtime Database import

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBbSMvkNIFUFO7lIkzNsXL_yDsebV4YuCI",
  authDomain: "piggypromise-e0c80.firebaseapp.com",
  projectId: "piggypromise-e0c80",
  storageBucket: "piggypromise-e0c80.firebasestorage.app",
  messagingSenderId: "559889092873",
  appId: "1:559889092873:web:00fcae71df2306b6ba83d8",
  measurementId: "G-8QS31FWXXM",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app); // Realtime Database 초기화

export { auth, database };
