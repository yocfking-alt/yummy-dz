import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB6NydBaeO0EmKEg9OCzhjQpVV47SDF6ZM",
  authDomain: "yummy-dz-app.firebaseapp.com",
  projectId: "yummy-dz-app",
  storageBucket: "yummy-dz-app.firebasestorage.app",
  messagingSenderId: "352213108979",
  appId: "1:352213108979:web:7e0029d2da3c4dff4f4f86",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
