import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import PressableButton from './PressableButton';
import { getContainerStyles } from "../components/SafeArea";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../styles/Colors";

export default function CustomList({ navigation }) {
  // safe area
  const insets = useSafeAreaInsets();
  const container = getContainerStyles(insets);

  // go back to the AddToList screen
  const handleCancel = () => {
    navigation.goBack();
  };

  // save the data to lists collection
  const handleSubmit = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, container]}>
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
          <Text style={styles.submitText}>Save The List</Text>
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
});