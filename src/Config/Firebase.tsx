// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsOy-PPzV2twNVynsk0lGGMr-nY0ghKYc",
  authDomain: "fir-tut-d2174.firebaseapp.com",
  projectId: "fir-tut-d2174",
  storageBucket: "fir-tut-d2174.appspot.com",
  messagingSenderId: "114118318521",
  appId: "1:114118318521:web:65ff27d7e3edf695a97e68",
  measurementId: "G-E3BWRNK32Y"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
