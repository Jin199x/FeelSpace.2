// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBXRwHdHZDwqq2eb2cLFXR1arrsO6bXRDA",
  authDomain: "feelspace-7.firebaseapp.com",
  projectId: "feelspace-7",
  messagingSenderId: "3685822280",
  appId: "1:3685822280:web:a1e99ec4d597cf248b4d7d",
  measurementId: "G-GGSWFV3GKM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
