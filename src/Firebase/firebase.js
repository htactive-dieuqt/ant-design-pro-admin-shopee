import firebase from "firebase";
import "firebase/database";
import "firebase/storage";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyABrIvZP5oWarhwLGp0FlRu53aS-jsP8d8",
  authDomain: "pnv-ecommerce-3.firebaseapp.com",
  databaseURL: "https://pnv-ecommerce-3.firebaseio.com",
  projectId: "pnv-ecommerce-3",
  storageBucket: "pnv-ecommerce-3.appspot.com",
  messagingSenderId: "87259718235",
  appId: "1:87259718235:web:366ebd4fbae334a688d57e",
  measurementId: "G-F0SRKR7MF5",
};

firebase.initializeApp(config);
const firebaseAuth = firebase.auth();
const firebaseDB = firebase.database();
const firebaseStorage = firebase.storage();
const firestore = firebase.firestore();

export { firebaseStorage, firebaseAuth, firebaseDB, firestore, firebase };