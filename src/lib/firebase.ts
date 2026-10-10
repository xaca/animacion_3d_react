import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Web config is safe to ship to the browser: access is controlled by firestore.rules
const firebaseConfig = {
    apiKey: "AIzaSyBoibwHjlCCEEVRYbuNHggSPdsNiUdxhPQ",
    authDomain: "jeopardy-76b82.firebaseapp.com",
    projectId: "jeopardy-76b82",
    storageBucket: "jeopardy-76b82.firebasestorage.app",
    messagingSenderId: "253571491875",
    appId: "1:253571491875:web:10fcfa1bb5772570b1a996",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
