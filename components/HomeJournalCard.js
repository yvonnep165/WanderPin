import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { colors } from "../styles/Colors";
import PressableButton from "./PressableButton";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { weatherIcons } from "../styles/WeatherIcons";

const HomeJournalCard = ({ journal, pressCardHandler }) => {
  console.log(journal);

  const firebaseUpdateTime = new Date(
    journal.date.seconds * 1000 + journal.date.nanoseconds / 1e6
  );
  const updateTime = firebaseUpdateTime.toLocaleDateString();

  const pressHandler = () => {
    pressCardHandler(journal);
  };

  return (
    <PressableButton onPressFunction={pressHandler}>
      <View style={styles.cardContainer}>
        <View style={styles.imgContainer}>
          <Image
            style={styles.img}
            resizeMode="cover"
            source={{
              uri: journal.images[0],
            }}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>
            {journal.title.slice(0, 30)}
            {journal.title.length > 30 ? "..." : ""}
          </Text>
          <View style={styles.subtitle}>
            <View style={styles.leftSubtitle}>
              <Ionicons name="location" size={15} color={colors.darkYellow} />
              <Text>
                {journal.location.address.slice(0, 20)}
                {journal.location.address.length > 20 ? "..." : ""}
              </Text>
              {weatherIcons[journal.weather.code]}
              <Text>{journal.weather.temp}°C</Text>
            </View>
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
    borderRadius: 15,
    backgroundColor: colors.lightGreen,
  },
  imgContainer: {
    padding: 10,
    paddingBottom: 0,
  },
  img: {
    width: "100%",
    height: 100,
    borderRadius: 15,
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
  leftSubtitle: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
});
