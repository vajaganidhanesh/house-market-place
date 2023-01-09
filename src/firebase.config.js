import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGdkLiBH_oNxW3f3nnq-Wnw4kpz89uKo4",
  authDomain: "house-marketplace-app-a609d.firebaseapp.com",
  projectId: "house-marketplace-app-a609d",
  storageBucket: "house-marketplace-app-a609d.appspot.com",
  messagingSenderId: "851853102730",
  appId: "1:851853102730:web:8d7e635571a3be86cf2773"
};

// Initialize Firebase
initializeApp(firebaseConfig)
export const db = getFirestore()