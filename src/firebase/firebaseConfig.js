import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB6IKkhRs3zd4Tsi7Jst_XWwvIXHT7A_uw",
  authDomain: "proyecto-ia-abb41.firebaseapp.com",
  projectId: "proyecto-ia-abb41",
  storageBucket: "proyecto-ia-abb41.appspot.com",
  messagingSenderId: "120081486842",
  appId: "1:120081486842:web:8fe00f4292dfbe06b38a43"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export {db,firebaseApp} ;