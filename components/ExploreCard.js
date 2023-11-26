import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import PressableButton from "./PressableButton";
import { colors } from "../styles/Colors";
import { downloadURL } from "../firebase/firestoreHelper";
import { Ionicons } from "@expo/vector-icons";

const ExploreCard = ({ journal, pressCardHandler }) => {
  const [journalImage, setJournalImage] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [originalKudos, setOriginalKudos] = useState(0);
  const [kudos, setKudos] = useState(0);

  const firebaseUpdateTime = new Date(
    journal.editTime.seconds * 1000 + journal.editTime.nanoseconds / 1e6
  );
  const updateTime = firebaseUpdateTime.toLocaleDateString();

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

  const pressHandler = () => {
    pressCardHandler(journal);
  };

  const onPressHeart = () => {
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    let liked = isLiked ? 1: 0;
    setKudos(originalKudos + liked);
  }, [isLiked])

  return (
    <View style={styles.cardContainer}>
      <PressableButton onPressFunction={pressHandler}>
        <Image
          style={styles.img}
          resizeMode="cover"
          source={{
            uri: journalImage[0],
          }}
        />
        <View style={styles.info}>
          <Text style={styles.title}>{journal.title}</Text>
          <View style={styles.subtitle}>
            <Text>username</Text>
            {/* <View style={styles.kudos}>
              <PressableButton onPressFunction={onPressHeart}>
                {isLiked ? (
                  <Ionicons
                    name="md-heart-sharp"
                    size={24}
                    color={colors.deepGreen}
                  />
                ) : (
                  <Ionicons
                    name="heart-outline"
                    size={24}
                    color={colors.deepGreen}
                  />
                )}
              </PressableButton>
              {kudos ? <Text>{kudos}</Text> : <Text>Like</Text>}
            </View> */}
          </View>
        </View>
      </PressableButton>
    </View>
  );
};

export default ExploreCard;

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 0.5,
    color: colors.lightWhite,
    borderRadius: 15,
    width: "45%",
    margin: 10,
  },
  img: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  info: { padding: 10, color: colors.white }, title: {fontWeight: '700'},
  subtitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kudos: {
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
  },
});
