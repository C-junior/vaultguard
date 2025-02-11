import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDX0HwtY7yLsBeOaiga7OrbvRnW4vruai4",
    authDomain: "shell-4a649.firebaseapp.com",
    projectId: "shell-4a649",
    storageBucket: "shell-4a649.firebasestorage.app",
    messagingSenderId: "764121946285",
    appId: "1:764121946285:web:27c2d162f699d8b1454e24"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const provider = new GoogleAuthProvider()

export { auth, db, provider, signInWithPopup, collection, doc, setDoc, getDocs, deleteDoc }