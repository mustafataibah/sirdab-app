import { FIREBASE_DB } from "./config";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const createUser = async (userId: string, email: string, isAdmin: boolean) => {
  const userRef = doc(FIREBASE_DB, "users", userId);
  await setDoc(
    userRef,
    {
      email,
      isAdmin,
    },
    { merge: true }
  );
};

export const getUser = async (userId: string) => {
  const userRef = doc(FIREBASE_DB, "users", userId);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.error("No such user!");
    return null;
  }
};
