import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PressableButton from "./PressableButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../styles/Colors";

const AddButton = ({onPress}) => {

  return (
    <View>
      <PressableButton defaultStyle={styles.addButton} pressedStyle={styles.pressedButton} onPressFunction={onPress}>
        <MaterialCommunityIcons name="shoe-print" size={24} color="white" />
      </PressableButton>
    </View>
  );
};

export default AddButton;

const styles = StyleSheet.create({addButton: {
    width: 50,
    height: 50,
    backgroundColor: colors.deepGreen,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
}, pressedButton: {
    backgroundColor: colors.darkGreen,
}});
