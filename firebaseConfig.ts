import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration réelle du projet Raf Way
const firebaseConfig = {
  apiKey: "AIzaSyBQl1qyAm9HYhCbJL1lF9YFqowyk6vk730",
  authDomain: "raf-way.firebaseapp.com",
  projectId: "raf-way",
  storageBucket: "raf-way.firebasestorage.app",
  messagingSenderId: "916664315426",
  appId: "1:916664315426:web:f8f9cf9259e7cc20e0247b",
  measurementId: "G-MCLB93S87M"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Export des services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
