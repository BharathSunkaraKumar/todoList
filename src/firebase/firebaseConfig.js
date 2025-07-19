// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1oKMpHCBtapfB2QYdED575xxHQZ5l7Z4",
  authDomain: "todo-list-ad3c0.firebaseapp.com",
  projectId: "todo-list-ad3c0",
  storageBucket: "todo-list-ad3c0.firebasestorage.app",
  messagingSenderId: "706641369030",
  appId: "1:706641369030:web:0c58a9c32574f8e4b684c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);