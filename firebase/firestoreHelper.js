import { collection, addDoc } from "firebase/firestore";
import { database } from "./firebaseSetup";

export async function writeJournalToDB(journal) {
  // Add a new document with a generated id.
  try {
    // console.log(auth.currentUser.uid)
    const docRef = await addDoc(collection(database, "journals"), {...journal});
    console.log("Document written with ID: ", docRef.id);
  } catch (err) {
    console.log(err);
  }
}