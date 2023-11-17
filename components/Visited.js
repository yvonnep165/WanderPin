import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AddButton from "./AddButton";
import { colors } from "../styles/Colors";
import { commonStyles } from "../styles/CommonStyles";


const Visited = ({navigation}) => {

  return (
    <View style={commonStyles.container}>
      <View style={styles.adding}>
        <AddButton onPress={() => navigation.navigate("VisitedNote")} />
      </View>
    </View>
  );
};

export default Visited;

const styles = StyleSheet.create({
  adding: {
    position: "absolute",
    bottom: 5,
    right: 25,
    zIndex: 1,
  },
});
