// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAZWRKsEGX6xqLfp1qdj3Z5JsTnADicdO0",
    authDomain: "samsung-ld-planner.firebaseapp.com",
    projectId: "samsung-ld-planner",
    storageBucket: "samsung-ld-planner.firebasestorage.app",
    messagingSenderId: "869435751510",
    appId: "1:869435751510:web:8ba7f7936de9de44734ff7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
