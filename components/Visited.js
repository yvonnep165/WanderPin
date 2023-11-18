import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { database } from "../firebase/firebaseSetup";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import AddButton from "./AddButton";
import { colors } from "../styles/Colors";
import { commonStyles } from "../styles/CommonStyles";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList } from "react-native-gesture-handler";
import HomeJournalCard from "./HomeJournalCard";

const Visited = ({navigation}) => {
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    // const q = query(collection(database, "goals"), where("user", "==", auth.currentUser.uid));
    onSnapshot(collection(database, "journals"), (querySnapshot) => {
      let newArray = [];
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          newArray.push({...doc.data(), id: doc.id});
        })
      }
      setJournals(newArray);
    }, (err) => {
      console.log(err);
    })
  }, [])

  return (
    <View style={commonStyles.container}>
      <FlatList
          contentContainerStyle={styles.contentContainerStyle}
          data={journals}
          renderItem={({ item }) => {
            return (
              // <GoalItem
              //   goalName={item}
              //   deleteHandler={goalDeleteHandler}
              //   pressGoalHandler={displayGoalDetail}
              // />
              <HomeJournalCard journal={item}/>
            );
          }}
        />
      <View style={styles.adding}>
        <AddButton 
          onPress={() => navigation.navigate("VisitedNote")} 
          iconComponent={<MaterialCommunityIcons name="shoe-print" size={24} color="white" />}
          />
      </View>
    </View>
  );
};

export default Visited;

const styles = StyleSheet.create({
  adding: {
    position: "absolute",
    bottom: 5,
    right: 25,
    zIndex: 1,
  },
});
