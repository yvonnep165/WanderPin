import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import PressableButton from "./PressableButton";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/Colors";
import { getContainerStyles } from "../components/SafeArea";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import InputField from './InputField';

export default function WishNote() {
  // safe area
  const insets = useSafeAreaInsets();
  const container = getContainerStyles(insets);

  return (
    <View style={[styles.container, container]}>
      <View style={styles.info}>
        <Text style={styles.title}>Title</Text>
        <InputField />
      </View>
      <View style={styles.info}>
        <Ionicons
          name="location"
          size={15}
          color={colors.darkYellow}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>Note</Text>
        <InputField />
      </View>
      <View style={styles.info}>
        <Ionicons
          name="calendar"
          size={15}
          color={colors.darkYellow}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    padding: 30,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: colors.black,
  },
  info: {
    marginBottom: 10, 
    marginLeft: 20,
    marginRight: 20,
  },
});