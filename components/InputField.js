import { View, TextInput, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { colors } from "../styles/Colors";

export default function InputField({changedHandler, value, placeholder, height}) {
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
        style={[styles.input, height && { height }]}
        onChangeText={changeTextHandler}
        value={text}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        multiline={true}
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
    },
  });