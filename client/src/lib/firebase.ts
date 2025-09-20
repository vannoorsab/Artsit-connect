import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDM8Epe-xdKNXSVD9PZLZzx6f2pQPssO1k",
  authDomain: "my-cloth-store-24a94.firebaseapp.com",
  projectId: "my-cloth-store-24a94",
  storageBucket: "my-cloth-store-24a94.appspot.com",
  messagingSenderId: "591336317100",
  appId: "1:591336317100:web:49f98e35a630b20652ff09",
  measurementId: "G-FDRCZM4EPK"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);