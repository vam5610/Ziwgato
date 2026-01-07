// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "ziwgato.firebaseapp.com",
  projectId: "ziwgato",
  storageBucket: "ziwgato.firebasestorage.app",
  messagingSenderId: "825723317431",
  appId: "1:825723317431:web:cc24f0b2d4bf7703d6b132"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app)

export {app,auth}