import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {getFirestore, collection, setDoc, doc, query, where, getDocs, getDoc} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"
import {getStorage, ref, uploadBytes, listAll, getMetadata} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js"
 
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
const auth = getAuth();
const student_info = collection(db, "student info");
const tutor_info = collection(db, "tutors");

// Defining the database as a variable

const login_submit = document.getElementById("login_submit");
const logout_button = document.getElementById("logout_button");
const register_button = document.getElementById("register_button");
const login_button = document.getElementById("login_button");
const register_submit = document.getElementById("register_submit");
const tutor_search_submit = document.getElementById("tutor_search_submit");
const student_info_table = document.getElementById("student_info_table");
const upload_button = document.getElementById("upload_button");
const update_button = document.getElementById("update_button");
const save_button = document.getElementById("save_button");

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
if (upload_button) {
    upload_button.addEventListener("click", function(){
        console.log("clicked");
        upload_file();
    });
}
if (update_button) {
    update_button.addEventListener("click", function(){
        console.log("clicked");
        update_user();
    });
}
if (save_button) {
    save_button.addEventListener("click", function(){
        console.log("clicked");
        save_user();
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
    await updateProfile(auth.currentUser, {
        displayName: name_register
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        console.log(errorCode, errorMessage, email);
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

async function display_student_info() {
    const student_doc = await getDoc(doc(student_info, auth.currentUser.uid));
    const student_data = student_doc.data();
    const name_cell = document.getElementById("name_cell");
    const school_cell = document.getElementById("school_cell");
    const grade_cell = document.getElementById("grade_cell");
    const dob_cell = document.getElementById("dob_cell");
    const email_cell = document.getElementById("email_cell");

    name_cell.innerHTML=`${student_data.name}`;
    school_cell.innerHTML=`${student_data.school}`;
    grade_cell.innerHTML=`${student_data.grade}`;
    dob_cell.innerHTML=`${student_data.dob}`;
    email_cell.innerHTML=`${auth.currentUser.email}`;
}

await onAuthStateChanged(auth, (user) => {
    if (user) {
        login_button.style.display = "none";
        register_button.style.display = "none";
        logout_button.style.display = "block";
        document.getElementById("name").innerHTML = `${user.displayName}`
        if (student_info_table) {
            student_info_table.display="block"
            document.getElementById("file_table").display="block"
            display_student_info();
            display_student_files();
        }
    } else {
        document.getElementById("name").innerHTML = "";
        login_button.style.display = "block";
        register_button.style.display = "block";
        logout_button.style.display = "none";
        if (student_info_table) {
            student_info_table.display="none"
            document.getElementById("file_table").display="none"
        }
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

async function upload_file(){
    const storage = getStorage();
    const file = document.getElementById("select_file").files[0];
    const name = auth.currentUser.uid + "/" + file.name;
    const storageRef = ref(storage, "portfolio_storage" + "/" + name);

    await uploadBytes(storageRef, file).then((snapshot) => {
        console.log('Uploaded a file!');
    });
}

async function display_student_files(){
    const storage = getStorage();
    const listRef = ref(storage, "portfolio_storage" + "/" + auth.currentUser.uid);
    await listAll(listRef).then((res) => {
    res.items.forEach((itemRef) => {
        getMetadata(itemRef).then((metadata) => {
            const name = metadata.name;
            const date = metadata.timeCreated.slice(0, 10);
            
            const results_table_body = document.getElementById("file_table").getElementsByTagName("tbody")[0];
            const row = results_table_body.insertRow(-1);
            const name_cell = row.insertCell(0);
            const date_cell = row.insertCell(1);
    
            name_cell.innerHTML = name;
            date_cell.innerHTML = date; 
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
    });
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
    });
}

function update_user(){
    const name_cell = document.getElementById("name_cell");
    const school_cell = document.getElementById("school_cell");
    const grade_cell = document.getElementById("grade_cell");
    const dob_cell = document.getElementById("dob_cell");
    const email_cell = document.getElementById("email_cell");

    name_cell.contentEditable = "true";
    name_cell.style.border = "3px solid #ADD8E6";
    name_cell.style.borderRadius = "1px";
    name_cell.style.backgroundColor = "#FDFD96";
    school_cell.contentEditable = "true";
    school_cell.style.border = "3px solid #ADD8E6";
    school_cell.style.borderRadius = "1px";
    school_cell.style.backgroundColor = "#FDFD96";
    grade_cell.contentEditable = "true";
    grade_cell.style.border = "3px solid #ADD8E6";
    grade_cell.style.borderRadius = "1px";
    grade_cell.style.backgroundColor = "#FDFD96";
    dob_cell.contentEditable = "true";
    dob_cell.style.border = "3px solid #ADD8E6";
    dob_cell.style.borderRadius = "1px";
    dob_cell.style.backgroundColor = "#FDFD96";
}
async function save_user(){
    const name_cell = document.getElementById("name_cell");
    const school_cell = document.getElementById("school_cell");
    const grade_cell = document.getElementById("grade_cell");
    const dob_cell = document.getElementById("dob_cell");
    name_cell.contentEditable = "false";
    school_cell.contentEditable = "false";
    grade_cell.contentEditable = "false";
    dob_cell.contentEditable = "false";
    await setDoc(doc(student_info, auth.currentUser.uid), {
        name: name_cell.innerHTML,
        school: school_cell.innerHTML,
        grade: grade_cell.innerHTML,
        dob: dob_cell.innerHTML
    });
    await updateProfile(auth.currentUser, {
        displayName: name_cell.value
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        console.log(errorCode, errorMessage, email);
    });
    location.reload(); 
}