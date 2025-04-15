import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAR6oULFiGVEnBJUcLA3om_FL1sNUDZEdg",
  authDomain: "sectores-7b408.firebaseapp.com",
  projectId: "sectores-7b408",
  storageBucket: "sectores-7b408.appspot.com",
  messagingSenderId: "1035718463203",
  appId: "1:1035718463203:web:f9164b163381a2cdf77fd6",
  measurementId: "G-1EWF4CCETJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // ⬅️ exportación nombrada
