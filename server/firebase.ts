import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Firebase Admin configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM8Epe-xdKNXSVD9PZLZzx6f2pQPssO1k",
  authDomain: "my-cloth-store-24a94.firebaseapp.com",
  projectId: "my-cloth-store-24a94",
  storageBucket: "my-cloth-store-24a94.appspot.com",
  messagingSenderId: "591336317100",
  appId: "1:591336317100:web:49f98e35a630b20652ff09",
  measurementId: "G-FDRCZM4EPK"
};

// Initialize Firebase Admin SDK
let app;
if (getApps().length === 0) {
  // For development, we'll use the project ID directly
  // In production, you should use a service account key
  app = initializeApp({
    projectId: firebaseConfig.projectId,
  });
} else {
  app = getApps()[0];
}

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);
export { app as adminApp };
