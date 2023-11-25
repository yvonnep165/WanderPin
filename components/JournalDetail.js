import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { getContainerStyles } from "../components/SafeArea";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { commonStyles } from "../styles/CommonStyles";
import PressableButton from "./PressableButton";
import { onSnapshot, collection } from "firebase/firestore";
import { database } from "../firebase/firebaseSetup";
import { deleteJournalFromDB } from "../firebase/firestoreHelper";
import { colors } from "../styles/Colors";
import { downloadURL } from "../firebase/firestoreHelper";
import Carousel from "react-native-reanimated-carousel";

const JournalDetail = ({ route, navigation }) => {
  // safe area
  const insets = useSafeAreaInsets();
  const safeAreaContainer = getContainerStyles(insets);
  const [journal, setJournal] = useState(route.params.pressedCard);
  const [journalImages, setJournalImages] = useState([]);
  const width = Dimensions.get("window").width * 0.95;

  useEffect(() => {
    // const q = query(collection(database, "goals"), where("user", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(
      collection(database, "journals"),
      (querySnapshot) => {
        const foundJournal = querySnapshot.docs.find(
          (doc) => doc.id === route.params.pressedCard.id
        );
        if (foundJournal) {
          setJournal({ ...foundJournal.data(), id: foundJournal.id });
        }
      },
      (err) => {
        console.log(err);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchDownloadURLs = async () => {
      if (journal.images) {
        try {
          const downloadImages = await downloadURL(journal.images);
          setJournalImages(downloadImages);
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchDownloadURLs();
  }, [journal.images]);

  const firebaseUpdateTime = new Date(
    journal.editTime.seconds * 1000 + journal.editTime.nanoseconds / 1e6
  );
  const updateTime = firebaseUpdateTime.toLocaleDateString();

  const onPressBack = () => {
    navigation.navigate("Visited");
  };

  const onPressEdit = () => {
    navigation.navigate("VisitedNote", { journal, journalImages });
  };

  const onPressDelete = () => {
    deleteJournalFromDB(journal.id);
    navigation.navigate("Visited");
  };

  //   https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png
  return (
    <View style={[safeAreaContainer, commonStyles.container]}>
      <View style={styles.containter}>
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

        <Carousel
          loop
          width={width}
          height="300"
          autoPlay={false}
          data={journalImages}
          scrollAnimationDuration={1000}
          onSnapToItem={(index) => console.log("current index:", index)}
          renderItem={({ index, item }) => (
            <View style={styles.imageContainer}>
              <Image
                key={index}
                style={styles.img}
                resizeMode="cover"
                source={{
                  uri: item,
                }}
              />
            </View>
          )}
        />

        <View style={styles.info}>
          <Text style={styles.title}>{journal.title}</Text>
          <Text>{journal.note}</Text>
          <Text style={styles.extraInfo}>{updateTime}</Text>
        </View>
        <Text>{journal.location}</Text>
      </View>
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
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
  },

  img: {
    width: "100%",
    height: 300,
  },
  info: {
    paddingTop: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "600",
    paddingVertical: 10,
  },
  extraInfo: {
    color: colors.lightGray,
    fontSize: 12,
    paddingVertical: 10,
  },
});
