import { StyleSheet, Text, View, Image  } from "react-native";
import React, { useEffect, useState } from "react";
import { getContainerStyles } from "../components/SafeArea";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { commonStyles } from "../styles/CommonStyles";
import PressableButton from "./PressableButton";
import {onSnapshot, collection} from "firebase/firestore";
import { database } from "../firebase/firebaseSetup";
import { deleteJournalFromDB } from "../firebase/firestoreHelper";

const JournalDetail = ({ route, navigation }) => {
  // safe area
  const insets = useSafeAreaInsets();
  const safeAreaContainer = getContainerStyles(insets);
  const [journal, setJournal] = useState(route.params.pressedCard)

  useEffect(() => {
    // const q = query(collection(database, "goals"), where("user", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(
      collection(database, "journals"),
      (querySnapshot) => {
        const foundJournal = querySnapshot.docs.find((doc) => doc.id === route.params.pressedCard.id);
        if (foundJournal) {
            setJournal({ ...foundJournal.data(), id: foundJournal.id });
          }
        },
      (err) => {
        console.log(err);
      }
    );return () => {
        unsubscribe();
    }
  }, []);

  const firebaseUpdateTime = new Date(
    journal.editTime.seconds * 1000 + journal.editTime.nanoseconds / 1e6
  );
  const updateTime = firebaseUpdateTime.toLocaleDateString();

  const onPressBack = () => {
    navigation.navigate('Visited');
  }

  const onPressEdit = () => {
    navigation.navigate('VisitedNote', {journal});
  }

  const onPressDelete = () => {
    deleteJournalFromDB(journal.id);
    navigation.navigate('Visited');
  }

  //   https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png
  return (
    <View style={[safeAreaContainer, commonStyles.container]}>
      <View style={styles.header}>
        <PressableButton onPressFunction={onPressBack}>
          <Text>Back</Text>
        </PressableButton>
        <PressableButton onPressFunction={onPressEdit}>
          <Text>Edit</Text>
        </PressableButton>
        <PressableButton onPressFunction={onPressDelete}>
          <Text>Delete</Text>
        </PressableButton>
      </View>
      <Image
        style={styles.img}
        resizeMode="cover"
        source={{
          uri: "https://img.youtube.com/vi/28oJJJFkV4g/0.jpg",
        }}
      />
      <Text>{journal.title}</Text>
      <Text>{journal.note}</Text>
      <Text>{updateTime}</Text>
      <Text>{journal.location}</Text>
    </View>
  );
};

export default JournalDetail;

const styles = StyleSheet.create({
  containter: {
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignContent: "space-between",
  },
  img: {
    width: "100%",
    height: 100,
  },
});
