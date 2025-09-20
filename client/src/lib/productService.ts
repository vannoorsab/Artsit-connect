import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function addProduct(product) {
  const docRef = await addDoc(collection(db, "products"), product);
  return docRef.id;
}