import { View, TextInput, StyleSheet, Keyboard, } from 'react-native';
import React, { useState, useEffect } from 'react';
import { colors } from "../styles/Colors";

export default function InputField({changedHandler, value, placeholder, height, fontSize, multiline, secureTextEntry }) {
    const [text, setText] = useState("");

    useEffect(() => {
        setText(value || "");
    }, [value]);

    function changeTextHandler(changedText) {
        setText(changedText);
        changedHandler(changedText)
    }

    return (
    <View>
      <TextInput
        style={[styles.input, height && { height }, fontSize && {fontSize}]}
        onChangeText={changeTextHandler}
        value={text}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        multiline={multiline}
        onBlur={Keyboard.dismiss}
        secureTextEntry={secureTextEntry}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    input: {
        padding: 8,
        marginTop: 5,
        backgroundColor: colors.lightGreen,
        borderRadius: 5,
        width: '100%',
        height: 40,
        fontSize: 20,
    },
  });