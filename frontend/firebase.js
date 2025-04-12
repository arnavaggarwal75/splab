import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBsvyJjG3n7oD4--DtRtZbPKl_R5ZA_Sjg",
    authDomain: "splab-a26f8.firebaseapp.com",
    projectId: "splab-a26f8",
    storageBucket: "splab-a26f8.firebasestorage.app",
    messagingSenderId: "457389392597",
    appId: "1:457389392597:web:3eb2b61f1b0ef927a7585c",
    measurementId: "G-Q4LRW57XD6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
