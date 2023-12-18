// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-real-estate-marketplace.firebaseapp.com",
  projectId: "mern-real-estate-marketplace",
  storageBucket: "mern-real-estate-marketplace.appspot.com",
  messagingSenderId: "641770966153",
  appId: "1:641770966153:web:38d547f3cc5f41741f4a58",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
