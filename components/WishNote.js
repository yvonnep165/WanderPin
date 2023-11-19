import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import PressableButton from "./PressableButton";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons'; 
import { colors } from "../styles/Colors";
import { getContainerStyles } from "../components/SafeArea";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Switch } from '@rneui/themed';
import InputField from './InputField';

export default function WishNote( { navigation } ) {
  const [reminder, setReminder] = useState(false);

  // safe area
  const insets = useSafeAreaInsets();
  const container = getContainerStyles(insets);

  // go back to the wishlist screen
  const handleCancel = () => {
    navigation.goBack();
  };

  // save the data to notes collection
  const handleSubmit = () => {
    navigation.goBack();
  };

  // navigate to AddToList
  const handleAddToList = () => {
    navigation.navigate('AddToList'); 
  };

  return (
    <View style={[styles.container, container]}>
      <View style={styles.info}>
        <Text style={styles.title}>Title</Text>
        <InputField placeholder="Write the title"/>
      </View>
      <View style={[styles.info, styles.label]}>
        <Ionicons
          name="location"
          size={20}
          color={colors.deepYellow}
        />
        <Text>Location</Text>
        <AntDesign name="right" size={14} color={colors.black} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>Note</Text>
        <InputField placeholder="Write your important note (optional)" height={200}/>
      </View>
      {/* navigate to select the list to add the location*/}
      <PressableButton 
          pressedStyle={styles.pressed}
          onPressFunction={handleAddToList}>
        <View style={[styles.info, styles.label]}>
          <MaterialIcons name="add-location-alt" size={20} color={colors.deepYellow} />
          <Text>Add To List</Text>
          <Text>  ? favorite</Text>
          <AntDesign name="right" size={14} color={colors.black} />
        </View>
      </PressableButton>
      <View style={[styles.info, styles.label]}>
        <Ionicons
          name="calendar"
          size={20}
          color={colors.deepYellow}
        />
        <Text>Set Date Reminder</Text>
        { /* add a switch to turn on date reminder */ }
        <Switch
          value={reminder}
          onValueChange={(value) => setReminder(value)}
          color={colors.deepGreen}
        />
      </View>
      <View style={styles.reminder}>
      { /* date reminder notification setting will replace */ }
      {reminder && (
      <View style={styles.dateReminderContainer}>
        <Text style={styles.dateReminderText}>Date Reminder</Text>
      </View>
      )}
      </View>
      {/* cancel and save button */}
      <View style={styles.buttons}>
        <PressableButton
          pressedStyle={styles.pressed}
          onPressFunction={handleCancel}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </PressableButton>
        <PressableButton
          defaultStyle={styles.submit}
          pressedStyle={styles.pressed}
          onPressFunction={handleSubmit}
        >
          <Text style={styles.submitText}>Add to Wishlist</Text>
        </PressableButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    padding: 30,
    marginTop: 30,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: colors.black,
  },
  info: {
    marginBottom: 10, 
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminder: {
    alignItems: "center",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  cancelText: {
    color: colors.deepYellow,
    fontWeight: "bold",
  },
  submitText: {
    color: colors.white,
    fontWeight: "bold",
  },
  submit: {
    backgroundColor: colors.deepYellow,
    width: "75%",
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  dateReminderContainer: {
    backgroundColor: colors.deepGreen,
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    width: "90%",
  },
  dateReminderText: {
    color: colors.white,
    fontWeight: "bold",
  },
});