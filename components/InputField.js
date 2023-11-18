import { View, TextInput, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { colors } from "../styles/Colors";

export default function InputField({changedHandler, value}) {
    const [text, setText] = useState("");

    useEffect(() => {
        setText(value || "");
    }, [value]);

    function changeTextHandler(changedText) {
        setText(changedText);
        changedHandler(changedText)
    }

    return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={changeTextHandler}
        value={text}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        alignContent: "center",
    },
    input: {
        padding: 8,
        marginTop: 5,
        backgroundColor: colors.lightGreen,
        borderRadius: 5,
        width: '100%',
    },
  });