import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyAJGcs19ku4IlwQeq8pGSQl38SGSkaSyas",
    authDomain: "e-vaksinchat.firebaseapp.com",
    projectId: "e-vaksinchat",
    storageBucket: "e-vaksinchat.appspot.com",
    messagingSenderId: "742869410297",
    appId: "1:742869410297:web:8e297f1eb6e9d4b866dd28",
    measurementId: "G-3GF6KVB3NF"
};


const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db };