// Configuration Firebase pour votre galerie N'ART
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuration Firebase - Ces clés peuvent être publiques (ce ne sont pas des secrets)
// Firebase gère la sécurité via les règles Firestore côté serveur
const firebaseConfig = {
  apiKey: "AIzaSyD0CFN_L9aX7mXnPiSIc68UA2JAa-iS2ws",
  authDomain: "galerie-nart.firebaseapp.com",
  projectId: "galerie-nart",
  storageBucket: "galerie-nart.firebasestorage.app",
  messagingSenderId: "1013398114680",
  appId: "1:1013398114680:web:5c523cc0793122cd7e788d",
  measurementId: "G-74HV4SGR7P"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firestore
export const db = getFirestore(app);

export default app;
