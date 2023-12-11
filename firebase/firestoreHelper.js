import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { database } from "./firebaseSetup";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase/firebaseSetup";
import { auth } from "./firebaseSetup";

export async function writeJournalToDB(journal) {
  // Add a new document with a generated id.
  try {
    // console.log(auth.currentUser.uid)
    const docRef = await addDoc(collection(database, "journals"), {
      ...journal,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (err) {
    console.log("write journal to db:", err);
  }
}

// export async function downloadURL(images) {
//   try {
//     const displayImages = [];
//     for (const image of images) {
//       const imageUriRef = ref(storage, image);
//       const url = await getDownloadURL(imageUriRef);
//       displayImages.push(url);
//     }
//     return displayImages;
//   } catch (err) {
//     console.log(err);
//   }
// }

// add a new list to the lists collection
export async function writeListToDB(list) {
  try {
    const docRef = await addDoc(collection(database, "lists"), {
      ...list,
      user: auth.currentUser.uid,
    });
  } catch (err) {
    console.log(err);
  }
}

// update a list's information
export async function updateList(id, title, color, icon) {
  try {
    const updateList = doc(database, "lists", id);
    await updateDoc(updateList, {
      title: title,
      color: color,
      icon: icon,
      user: auth.currentUser.uid,
    });
  } catch (err) {
    console.log(err);
  }
}

// delete a list from database
export async function deleteListFromDB(id) {
  try {
    await deleteDoc(doc(database, "lists", id));
  } catch (err) {
    console.log(err);
  }
}

// add a new note to the notes collection
export async function writeNoteToDB(note) {
  try {
    const docRef = await addDoc(collection(database, "notes"), {
      ...note,
      user: auth.currentUser.uid,
    });
  } catch (err) {
    console.log(err);
  }
}

// update a note's information
export async function updateNote(updateWishNote) {
  try {
    const updateNoteDoc = doc(database, "notes", updateWishNote.id);
    await updateDoc(updateNoteDoc, {
      title: updateWishNote.title,
      location: updateWishNote.location,
      note: updateWishNote.note,
      list: updateWishNote.list,
      reminder: updateWishNote.reminder,
      user: auth.currentUser.uid,
    });
  } catch (err) {
    console.log(err);
  }
}

// delete a note from database
export async function deleteNoteFromDB(id) {
  try {
    await deleteDoc(doc(database, "notes", id));
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
