import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getContainerStyles } from "../components/SafeArea";
import { commonStyles } from "../styles/CommonStyles";

const Map = () => {
  const insets = useSafeAreaInsets();
  const container = getContainerStyles(insets);

  return (
    <View style={[container, commonStyles.container]}>
      <Text>Map</Text>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({});
