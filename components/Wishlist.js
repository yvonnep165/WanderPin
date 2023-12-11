import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import AddButton from "./AddButton";
import { commonStyles } from "../styles/CommonStyles";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Note from "./Note";
import { collection, onSnapshot } from "firebase/firestore";
import { database } from "../firebase/firebaseSetup";

const Wishlist = () => {
  const navigation = useNavigation();
  const [notes, setNotes] = useState([]);

  function notePressHandler(pressedWishlist) {
    navigation.navigate("WishNote", { pressedWishlist });
  }

  // read all the notes from database
  useEffect(() => {
    let q = collection(database, "notes");
    onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        let newArray = [];
        querySnapshot.forEach((docSnap) => {
          newArray.push({ ...docSnap.data(), id: docSnap.id });
        });
        setNotes(newArray);
      } else {
        setNotes([]);
      }
    });
  }, []);

  return (
    <View style={commonStyles.container}>
      <View>
        {/* a flatlist to show all the notes */}
        <FlatList
          contentContainerStyle={styles.container}
          data={notes}
          renderItem={({ item }) => {
            return (
              <View style={styles.card}>
                <Note note={item} pressHandler={notePressHandler} />
              </View>
            );
          }}
        />
      </View>
      <View style={styles.adding}>
        <AddButton
          onPress={() => navigation.navigate("WishNote")}
          iconComponent={
            <MaterialCommunityIcons
              name="map-marker-plus"
              size={24}
              color="white"
            />
          }
        />
      </View>
    </View>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  adding: {
    position: "absolute",
    bottom: 25,
    right: 25,
    zIndex: 9999,
  },
  container: {
    padding: 24,
    flexDirection: "column",
  },
  card: {
    margin: 3,
  },
});
