import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import PressableButton from "./PressableButton";
import { colors } from "../styles/Colors";

const ExploreCard = ({ journal, pressCardHandler }) => {
  const firebaseUpdateTime = new Date(
    journal.editTime.seconds * 1000 + journal.editTime.nanoseconds / 1e6
  );
  const updateTime = firebaseUpdateTime.toLocaleDateString();

  const pressHandler = () => {
    pressCardHandler(journal);
  };

  return (
    <View style={styles.cardContainer}>
      <PressableButton onPressFunction={pressHandler}>
        <Image
          style={styles.img}
          resizeMode="cover"
          source={{
            uri: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          }}
        />
        <View style={styles.info}>
          <Text style={styles.title}>{journal.title}</Text>
          <View style={styles.subtitle}>
            <Text>username</Text>
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
    height: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },info: { padding: 10, color: colors.white },
});
