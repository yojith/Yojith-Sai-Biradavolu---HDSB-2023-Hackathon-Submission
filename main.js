import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {getFirestore, collection, addDoc, query, where, getDocs} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import {getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"

const firebaseConfig = {
    apiKey: "AIzaSyA7pKGge0F1sj3ZFJHvnfnH5OVdFW4R078",
    authDomain: "hdsb-41db2.firebaseapp.com",
    projectId: "hdsb-41db2",
    storageBucket: "hdsb-41db2.appspot.com",
    messagingSenderId: "925376326261",
    appId: "1:925376326261:web:6c1ecfbd0b9e399984263c",
    measurementId: "G-1M7KLMM3JX"
};

const firebaseApp = initializeApp(firebaseConfig);

// Defining the database as a variable
const filestorage = collection(getFirestore(firebaseApp), "portfolio_storage");

// Google authorization
const auth = getAuth();
const provider = new GoogleAuthProvider();

