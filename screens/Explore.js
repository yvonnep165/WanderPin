import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect, useInsertionEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getContainerStyles } from "../components/SafeArea";
import { commonStyles } from "../styles/CommonStyles";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { database } from "../firebase/firebaseSetup";
import ExploreCard from "../components/ExploreCard";

const Explore = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const container = getContainerStyles(insets);

  const [journals, setJournals] = useState([]);

  useEffect(() => {
    const q = query(
      collection(database, "journals"),
      orderBy("date", "desc"),
      where("visibility", "==", 1)
    );
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

  const pressCardHandler = (journal) => {
    navigation.navigate("JournalDetail", { pressedCard: journal });
  };

  return (
    <View style={[container, commonStyles.container]}>
      <View style={styles.cardList}>
        <FlatList
          contentContainerStyle={styles.cards}
          data={journals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <ExploreCard journal={item} pressCardHandler={pressCardHandler} />
            );
          }}
          numColumns={2}
        />
      </View>
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  cardList: { paddingHorizontal: "5%", width: "100%", gap: 10 },
  cards: { paddingTop: 10, justifyContent: "space-between" },
});
