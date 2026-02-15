import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// настройки Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDQ3WpDv6ON7wOY3Y-todJtRO49CSY3tiU",
  authDomain: "project-soc-c00af.firebaseapp.com",
  projectId: "project-soc-c00af",
  storageBucket: "project-soc-c00af.appspot.com",
  messagingSenderId: "936580037727",
  appId: "1:936580037727:web:fda14f93affa12dab6afea"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// экспорт
export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
};
