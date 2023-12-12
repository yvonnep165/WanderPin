import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../styles/Colors";
import { iconStyle } from "../styles/CommonStyles";
import { icons } from "../styles/Icons";
import PressableButton from "./PressableButton";
import { useNavigation } from "@react-navigation/native";

const ListCard = ({ list }) => {
  const findIconLabel = (icon) => {
    return icons.iconOption.find((item) => item.value === icon);
  };

  const foundIcon = findIconLabel(list.icon);
  const navigation = useNavigation();

  const editHandler = () => {
    navigation.navigate("CustomList", { pressedList: list });
  };

  return (
    <View>
      <View style={styles.listContent}>
        <View style={styles.line}>
          <View
            style={[
              iconStyle,
              { backgroundColor: colors.colorOption[list.color] },
            ]}
          >
            {foundIcon.label}
          </View>
          <Text style={styles.title}>{list.title}</Text>
        </View>
        <PressableButton
          defaultStyle={styles.edit}
          onPressFunction={editHandler}
          pressedStyle={styles.editPressed}
        >
          <Text style={styles.edit}>Edit</Text>
        </PressableButton>
      </View>
    </View>
  );
};

export default ListCard;

const styles = StyleSheet.create({
  listContent: {
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  edit: { color: colors.deepGreen, fontWeight: "bold" },
  editPressed: { opacity: 0.5 },
});
