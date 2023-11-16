import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";

const PressableButton = ({
  children,
  onPressFunction,
  defaultStyle,
  pressedStyle,
}) => {
  return (
    <Pressable
        onPress={onPressFunction}
        style={({pressed})=>{
          return [defaultStyle, pressed && pressedStyle]
        }}
      >
        {children}
      </Pressable>
  );
};

export default PressableButton;

const styles = StyleSheet.create({});
