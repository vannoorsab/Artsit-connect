import {
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signOut as firebaseSignOut,
  User
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export function useFirebaseAuth() {
  const signInWithEmailAndPassword = async (email: string, password: string) => {
    try {
      const userCredential = await firebaseSignIn(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const createUserWithEmailAndPassword = async (email: string, password: string) => {
    try {
      const userCredential = await firebaseCreateUser(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
  };
}