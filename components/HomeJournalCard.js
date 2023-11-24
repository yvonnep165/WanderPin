import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { colors } from "../styles/Colors";
import PressableButton from "./PressableButton";
import { downloadURL } from "../firebase/firestoreHelper";

const HomeJournalCard = ({ journal, pressCardHandler }) => {
  const [journalImage, setJournalImage] = useState([]);

  const firebaseUpdateTime = new Date(
    journal.editTime.seconds * 1000 + journal.editTime.nanoseconds / 1e6
  );
  const updateTime = firebaseUpdateTime.toLocaleDateString();

  const pressHandler = () => {
    pressCardHandler(journal);
  };

  useEffect(() => {
    const fetchDownloadURLs = async () => {
      if (journal.images) {
        try {
          const downloadImages = await downloadURL(journal.images);
          setJournalImage(downloadImages);
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchDownloadURLs();
  }, [journal.images]);

  return (
    <PressableButton onPressFunction={pressHandler}>
      <View style={styles.cardContainer}>
        {journalImage.length != 0 && (
          <Image
            style={styles.img}
            resizeMode="cover"
            source={{
              uri: journalImage[0],
            }}
          />
        )}
        <View style={styles.info}>
          <Text style={styles.title}>{journal.title}</Text>
          <View style={styles.subtitle}>
            <Text>{journal.location}</Text>
            <Text>{updateTime}</Text>
          </View>
        </View>
      </View>
    </PressableButton>
  );
};

export default HomeJournalCard;

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 0.3,
    color: colors.lightWhite,
    borderRadius: 15,
  },
  img: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  info: { padding: 10, color: colors.white },
  title: {
    fontWeight: "900",
  },
  subtitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 5,
  },
});


