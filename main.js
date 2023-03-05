import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {getFirestore, collection, setDoc, addDoc, doc, query, where, getDocs} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, sendEmailVerification} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"

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
const db = getFirestore(firebaseApp);
const student_info = collection(db, "student info");
const tutor_info = collection(db, "tutors");
const teacher_rating = collection(db, "teacher ratings")

// Defining the database as a variable
// const filestorage = collection(getFirestore(firebaseApp), "portfolio_storage");

const auth = getAuth();

const login_submit = document.getElementById("login_submit");
const logout_button = document.getElementById("logout_button");
const register_button = document.getElementById("register_button");
const login_button = document.getElementById("login_button");
const register_submit = document.getElementById("register_submit");
const tutor_search_submit = document.getElementById("tutor_search_submit");
const rate_teacher_button = document.getElementById("submit_rating");

if (login_submit) {
    login_submit.addEventListener("click", function(){
        console.log("clicked");
        login();
    });
}
if (logout_button) {
    logout_button.addEventListener("click", function(){
        console.log("clicked");
        logout();
    });
}
if (register_submit) {
    register_submit.addEventListener("click", function(){
        console.log("clicked");
        register();
    });
}
if (tutor_search_submit) {
    tutor_search_submit.addEventListener("click", function(){
        console.log("clicked");
        tutor_search();
    });
}
if (rate_teacher_button) {
    rate_teacher_button.addEventListener("click", function(){
        console.log("clicked");
        rateTeacher();
    });
}

async function register(){
    const email_register = document.getElementById("email_register").value;
    const password_register = document.getElementById("password_register").value;
    const name_register = document.getElementById("name_register").value;
    const school_register = document.getElementById("school_register").value;
    const grade_register = document.getElementById("grade_register").value;
    const dob_register = document.getElementById("dob_register").value;
    await createUserWithEmailAndPassword(auth, email_register, password_register).then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user)
        setDoc(doc(student_info, user.uid), {
            name: name_register,
            school: school_register,
            grade: grade_register,
            dob: dob_register
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        console.log(errorCode, errorMessage, email);
    });
    // await sendEmailVerification(auth.currentUser).then(() => {
    // 
    // })
    // .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     const email = error.email;
    //     console.log(errorCode, errorMessage, email);
    // });
    await updateProfile(auth.currentUser, {
        displayName: name_register
    }).then(() => {

    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        console.log(errorCode, errorMessage, email);
    });

}

async function rateTeacher() {
    const school_name = document.getElementById("school_name").value;
    const teacher_name = document.getElementById("teacher_name").value;
    const course_taught = document.getElementById("course_taught").value;
    const teacher_email = document.getElementById("teacher_email").value;
    const rating = document.getElementById("rating").value;
    const review = document.getElementById("review").value;

    // setDoc(doc(teacher_rating, teacher_email), {
    //     school: school_name,
    //     name: teacher_name,
    //     course: course_taught,
    //     rating: rating,
    //     review: review
    // });
    await addDoc(teacher_rating, {
        school: school_name,
        name: teacher_name,
        course: course_taught,
        email: teacher_email,
        rating: rating,
        review: review
    });
}

async function login(){
    const email = document.getElementById("email_login").value;
    const password = document.getElementById("password_login").value;
    await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        document.getElementById("name").innerHTML = `${user.displayName}`
        login_button.style.display = "none";
        logout_button.style.display = "block";
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        console.log(errorCode, errorMessage, email);
    });
}

async function logout(){
    await signOut(auth).then(() => {
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        console.log(errorCode, errorMessage, email);
    });
}

await onAuthStateChanged(auth, (user) => {
    if (user) {
        login_button.style.display = "none";
        register_button.style.display = "none";
        logout_button.style.display = "block";
        const student_info_table = document.getElementById("student_info_table");

        if (student_info_table) {
            student_info_table.rows[0].cells[1].innerHTML=``;
        }

        const navbar_name = document.getElementById("name");
        if (navbar_name) {
            document.getElementById("name").innerHTML = `${user.displayName}`
        }
    } else {
        document.getElementById("name").innerHTML = "";
        login_button.style.display = "block";
        register_button.style.display = "block";
        logout_button.style.display = "none";
    }
});

function delete_rows(table_id){
    document.getElementById(table_id).getElementsByTagName("tbody")[0].innerHTML = "";
}

async function data_read(search_parameter, search_input){
    const tutor_query = query(tutor_info, where(search_parameter, "==", search_input));
    const tutor_docs = await getDocs(tutor_query);
  
    delete_rows("results_table");
    
    tutor_docs.forEach((doc) => {
        const doc_data = doc.data()
        const tutor_name = doc_data.name;
        const tutor_subject = doc_data.subject;
        const tutor_rating = doc_data.rating;
        add_rows("results_table", tutor_name, tutor_subject, tutor_rating);
    });
}

function add_rows(table_id, tutor_name, tutor_subject, tutor_rating){
    const results_table_body = document.getElementById(table_id).getElementsByTagName("tbody")[0];
    const row = results_table_body.insertRow(-1);
    const name_cell = row.insertCell(0);
    const subject_cell = row.insertCell(1);
    const rating_cell = row.insertCell(2);
  
    name_cell.innerHTML = tutor_name;
    subject_cell.innerHTML = tutor_subject;
    rating_cell.innerHTML = tutor_rating;
}

async function tutor_search(){
    const tutor_filter = document.getElementById("tutor_filter").value;
    const search_input = document.getElementById("tutor_search").value;
    data_read(tutor_filter, search_input);
}