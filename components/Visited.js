import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AddButton from "./AddButton";
import { colors } from "../styles/Colors";
import { commonStyles } from "../styles/CommonStyles";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Visited = () => {

  const navigation = useNavigation();
  return (
    <View style={commonStyles.container}>
      <View style={styles.adding}>
        <AddButton 
          onPress={() => navigation.navigate("VisitedNote")} 
          iconComponent={<MaterialCommunityIcons name="shoe-print" size={24} color="white" />}
          />
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
