import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { getContainerStyles } from "../components/SafeArea";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const JournalDetail = ({route}) => {
      // safe area
  const insets = useSafeAreaInsets();
  const safeAreaContainer = getContainerStyles(insets);

  const journal = route.params.pressedCard;

  return (
    <View style={safeAreaContainer}>
      <Text>JournalDetail</Text>
    </View>
  )
}

export default JournalDetail

const styles = StyleSheet.create({})