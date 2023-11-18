import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const HomeJournalCard = ({ journal }) => {
  return (
    <View>

      <Text>{journal.title}</Text>
      <Text>{journal.location}</Text>
    </View>
  );
};

export default HomeJournalCard;

const styles = StyleSheet.create({img: {
    width: 700,
    height: 300,
}});
