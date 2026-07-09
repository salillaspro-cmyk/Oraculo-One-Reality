import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from "firebase/firestore";

const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyBgnn4NgJd3WW7P-a2q5XEORYxPfvq7I6Q",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0950560904.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0950560904",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0950560904.firebasestorage.app",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "348566305291",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:348566305291:web:eb1c14b3a16bec5b91250e"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Use custom Database ID if specified. If using custom project ID on Vercel and no Database ID is set, default to '(default)'.
const isCustomConfig = !!metaEnv.VITE_FIREBASE_PROJECT_ID;
const dbId = metaEnv.VITE_FIREBASE_DATABASE_ID || (isCustomConfig ? "(default)" : "ai-studio-loretreegrandlin-c303bda7-ac5e-49de-8905-9d431ebace1b");

const db = dbId === "(default)" ? getFirestore(app) : getFirestore(app, dbId);

export { 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc
};
export type { FirebaseUser };
