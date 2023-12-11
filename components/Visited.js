import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { database } from "../firebase/firebaseSetup";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import AddButton from "./AddButton";
import { colors } from "../styles/Colors";
import { commonStyles } from "../styles/CommonStyles";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import HomeJournalCard from "./HomeJournalCard";
import {
  deleteJournalFromDB,
  getAllJournals,
} from "../firebase/firestoreHelper";

const Visited = ({ navigation }) => {
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    const q = query(collection(database, "journals"), orderBy("date", "desc"));
    // where("user", "==", auth.currentUser.uid)
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        let newArray = [];
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            newArray.push({ ...doc.data(), id: doc.id });
          });
        }
        setJournals(newArray);
      },
      (err) => {
        console.log(err);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const pressCardHandler = (pressedCard) => {
    navigation.navigate("JournalDetail", { pressedCard });
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      <View style={styles.cardList}>
        <FlatList
          contentContainerStyle={styles.cards}
          data={journals}
          renderItem={({ item }) => {
            return (
              <HomeJournalCard
                journal={item}
                pressCardHandler={pressCardHandler}
              />
            );
          }}
        />
      </View>
      <View style={styles.adding}>
        <AddButton
          onPress={() => navigation.navigate("VisitedNote")}
          iconComponent={
            <MaterialCommunityIcons name="shoe-print" size={24} color="white" />
          }
        />
      </View>
    </View>
  );
};

export default Visited;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  cardList: { width: "90%" },
  cards: { gap: 10, paddingTop: 15 },
  adding: {
    position: "absolute",
    bottom: 25,
    right: 25,
    zIndex: 1,
  },
});
