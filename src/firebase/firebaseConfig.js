import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC0FFKhKj32Qth_ZiusSB9PmAswZQwFRX4",
  authDomain: "pa-circulo-azul.firebaseapp.com",
  databaseURL: "https://pa-circulo-azul-default-rtdb.firebaseio.com",
  projectId: "pa-circulo-azul",
  storageBucket: "pa-circulo-azul.appspot.com",
  messagingSenderId: "974365063569",
  appId: "1:974365063569:web:5506d7c4f36d53bc814230",
  measurementId: "G-90ZVLY8F5E"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export {db,firebaseApp} ;