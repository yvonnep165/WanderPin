import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import PressableButton from "./PressableButton";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons'; 
import { colors } from "../styles/Colors";
import { getContainerStyles } from "../components/SafeArea";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Switch } from '@rneui/themed';
import InputField from './InputField';

export default function WishNote() {
  const [reminder, setReminder] = useState(false);

  // safe area
  const insets = useSafeAreaInsets();
  const container = getContainerStyles(insets);

  return (
    <View style={[styles.container, container]}>
      <View style={styles.info}>
        <Text style={styles.title}>Title</Text>
        <InputField placeholder="Write the title"/>
      </View>
      <View style={[styles.info, styles.label]}>
        <Ionicons
          name="location"
          size={15}
          color={colors.darkYellow}
        />
        <Text>Location</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>Note</Text>
        <InputField placeholder="Write your important note (optional)" height={200}/>
      </View>
      <View style={[styles.info, styles.label]}>
        <MaterialIcons name="add-location-alt" size={15} color={colors.darkYellow} />
        <Text>Add To List</Text>
      </View>
      <View style={[styles.info, styles.label]}>
        <Ionicons
          name="calendar"
          size={15}
          color={colors.darkYellow}
        />
        <Text>Set Date Reminder</Text>
        <Switch
          value={reminder}
          onValueChange={(value) => setReminder(value)}
          color={colors.deepGreen}
        />
      </View>
      <View style={styles.reminder}>
        {reminder && <Text>Date Reminder</Text>}
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
  label: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminder: {
    alignItems: "center",
  }
});