import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// NOTE: Ceci est une configuration fictive pour la démonstration.
// Dans un projet réel, utilisez vos vraies clés d'API depuis la console Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForDemoPurposesOnly",
  authDomain: "raf-way-demo.firebaseapp.com",
  projectId: "raf-way-demo",
  storageBucket: "raf-way-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Simulation de l'état "local" pour la démo si Firebase n'est pas connectée réellement
// Cela permet de tester l'UI sans configurer un backend réel immédiatement.
export const isDemoMode = true; 

export const mockUser = {
  uid: "demo-user-123",
  displayName: "Alex Dupont",
  email: "alex@example.com",
  photoURL: "https://picsum.photos/200",
  isPremium: false,
  messageCount: 0,
};