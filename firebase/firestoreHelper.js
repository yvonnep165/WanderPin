import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { database } from "./firebaseSetup";

export async function writeJournalToDB(journal) {
  // Add a new document with a generated id.
  try {
    // console.log(auth.currentUser.uid)
    const docRef = await addDoc(collection(database, "journals"), {
      ...journal,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (err) {
    console.log(err);
  }
}

export async function updateJournalToDB(journal, updateField) {
  try {
    await updateDoc(doc(database, "journals", journal), updateField);
  } catch (err) {
    console.log(err);
  }
}

export async function deleteJournalFromDB(id) {
  try {
    await deleteDoc(doc(database, "journals", id));
  } catch (err) {
    console.log(err);
  }
}