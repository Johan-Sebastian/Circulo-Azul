// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0FFKhKj32Qth_ZiusSB9PmAswZQwFRX4",
  authDomain: "pa-circulo-azul.firebaseapp.com",
  projectId: "pa-circulo-azul",
  storageBucket: "pa-circulo-azul.appspot.com",
  messagingSenderId: "974365063569",
  appId: "1:974365063569:web:5506d7c4f36d53bc814230",
  measurementId: "G-90ZVLY8F5E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);