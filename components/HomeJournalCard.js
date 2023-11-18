import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { colors } from "../styles/Colors";

const HomeJournalCard = ({ journal }) => {
  const firebaseUpdateTime = new Date(
    journal.editTime.seconds * 1000 + journal.editTime.nanoseconds / 1e6
  );
  const updateTime = firebaseUpdateTime.toLocaleDateString();

  return (
    <View style={styles.cardContainer}>
      <Image
        style={styles.img}
        resizeMode="contain"
        source={{
          uri: "https://img.youtube.com/vi/28oJJJFkV4g/0.jpg",
        }}
      />
      <Text>{journal.title}</Text>
      <Text>{journal.location}</Text>
      <Text>11 Cloudy</Text>
      <Text>{updateTime}</Text>
    </View>
  );
};

export default HomeJournalCard;

const styles = StyleSheet.create({
  cardContainer: {
    maxWidth: "90%",
    width: "90%",
    borderWidth: 0.3,
    color: colors.lightWhite,
  },
  img: {
    height: 300,
  },
});
