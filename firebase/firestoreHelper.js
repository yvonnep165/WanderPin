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

// add a new list to the lists collection
export async function writeListToDB(list) {
  try{
      const docRef = await addDoc(collection(database, "lists"), list); 
  } catch (err){
      console.log(err);
  }
}

// update a list's information
export async function updateList(id, title, color, icon) {
  try {
      const updateList = doc(database, "lists", id);
      await updateDoc(updateList,  {
          title: title, 
          color: color,
          icon: icon,
      });
  } catch(err) {
      console.log(err);
  }
}

// delete a list from database
export async function deleteListFromDB(id) {
  try{
      await deleteDoc(doc(database, "lists", id))
  }
  catch(err) {
      console.log(err)
  }
}

// add a new note to the notes collection
export async function writeNoteToDB(note) {
  try{
      const docRef = await addDoc(collection(database, "notes"), note); 
  } catch (err){
      console.log(err);
  }
}

// update a note's information
export async function updateNote(id, title, location, note, list, reminder) {
  try {
      const updateNote = doc(database, "notes", id);
      await updateDoc(updateNote,  {
          title: title, 
          location: location,
          note: note,
          list: list,
          reminder: reminder,
      });
  } catch(err) {
      console.log(err);
  }
}

// delete a note from database
export async function deleteNoteFromDB(id) {
  try{
      await deleteDoc(doc(database, "notes", id))
  }
  catch(err) {
      console.log(err)
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