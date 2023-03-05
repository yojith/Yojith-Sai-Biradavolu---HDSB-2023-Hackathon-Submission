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
// const filestorage = collection(getFirestore(firebaseApp), "portfolio_storage");

// Google authorization
const auth = getAuth();
const provider = new GoogleAuthProvider();

const login_button = document.getElementById("login");
const logout_button = document.getElementById("logout");

if (login) {
    login_button.addEventListener("click", function(){
        google_login();
        console.log("clicked");
    });
    logout_button.addEventListener("click", function(){
        logout();
    });
}

async function google_login(){
    await signInWithPopup(auth, provider).then((result) => {
        document.getElementById("name").innerHTML = `${result.user.displayName}`
        login_button.style.display = "none";
        logout_button.style.display = "block";
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage, email, credential);
    });
}

async function logout(){
    await signOut(auth).then(() => {
      document.getElementById("name").innerHTML = ""
      login_button.style.display = "block";
      logout_button.style.display = "none";
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorCode, errorMessage, email, credential);
    });
}
  var ProfDB = firebase.database().ref().child('Professor Database');
    ProfDB.once("value").then(function(snapshot){
    var prof_info=snapshot.val();
    document.getElementById("teacher-rating-form").addEventListener("submit",function(e){
      e.preventDefault();
      var prof_name = document.getElementById("teacher_name").value;
      console.log(Object.keys(prof_info).length);
      const prof_keys= Object.keys(prof_info);
      for (let i = 0; i < prof_keys.length; i++) {
        prof_dict = prof_keys[i]
        if (prof_info[prof_dict].teacher_name === teacher_name) {
          var found_school_name = prof_info[prof_dict].school_name
          var found_teacher_name = prof_info[prof_dict].teacher_name
          var found_rating = prof_info[prof_dict].rating
          var found_subject = prof_info[prof_dict].subject
          document.getElementById("p_teacher_name").innerHTML = teacher_name
          document.getElementById("p_school_name").innerHTML = school_name
          document.getElementById("p_rating").innerHTML = rating
          document.getElementById("p_class").innerHTML = subject
        } else {
           console.log("none found");
        }
      }
    });
  });
