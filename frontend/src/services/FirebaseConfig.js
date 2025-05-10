// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWPfYUSpj8NXoCJy4BIaLOI0Pg7hgeOhA",
  authDomain: "ai-trip-planner-d4f97.firebaseapp.com",
  projectId: "ai-trip-planner-d4f97",
  storageBucket: "ai-trip-planner-d4f97.firebasestorage.app",
  messagingSenderId: "936341815966",
  appId: "1:936341815966:web:f1fa517ba6d0d7f48d718f",
  measurementId: "G-ZQKWTW7Q4S",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
