import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js'
import { getAuth, signInWithEmailAndPassword,createUserWithEmailAndPassword,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import { getStorage,ref,uploadBytesResumable,getDownloadURL} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
import { getFirestore, setDoc , doc,getDoc,addDoc,collection,getDocs} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyAfWQlJmaJtqjsvnJsII6I5Gzhu2y8QFxw",
  authDomain: "for-login-and-sign-up.firebaseapp.com",
  projectId: "for-login-and-sign-up",
  storageBucket: "for-login-and-sign-up.appspot.com",
  messagingSenderId: "289504623376",
  appId: "1:289504623376:web:4772277e38f1ccd1d04395"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)
export{
    auth,
    app,
    db,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    setDoc,
    doc,
    onAuthStateChanged,
    signOut,
    getDoc,
    addDoc,
    collection,
    getDocs,
    ref,
    storage,
    uploadBytesResumable,
    getDownloadURL
}