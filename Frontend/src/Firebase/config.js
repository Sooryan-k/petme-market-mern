import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBlL5eOnt5hu3uh8fw0EASUsaMOKiHQXik",
  authDomain: "petme-d2a0c.firebaseapp.com",
  projectId: "petme-d2a0c",
  storageBucket: "petme-d2a0c.appspot.com",
  messagingSenderId: "630392022877",
  appId: "1:630392022877:web:9e84d42f564474fce36ab4",
  measurementId: "G-RV5LQSE4MT",
};

// to initialize firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
