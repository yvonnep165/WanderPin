import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import PressableButton from "./PressableButton";
import IconSelect from "./IconSelect";
import InputField from "./InputField";
import { getContainerStyles } from "../components/SafeArea";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../styles/Colors";
import { icons } from "../styles/Icons";
import {
  deleteListFromDB,
  writeListToDB,
  updateList,
  deleteNoteFromDB,
} from "../firebase/firestoreHelper";
import { database } from "../firebase/firebaseSetup";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRoute } from "@react-navigation/native";

const colorChoice = colors.colorOption;
const CIRCLE_SIZE = 30;
const CIRCLE_RING_SIZE = 1;

export default function CustomList({ navigation }) {
  const route = useRoute();

  const [iconColor, setIconColor] = useState(
    route.params?.pressedList?.color || 0
  );
  const [icon, setIcon] = useState(route.params?.pressedList?.icon || "");
  const [showIcon, setShowIcon] = useState(null);
  const [title, setTitle] = useState(route.params?.pressedList?.title || "");

  // safe area
  const insets = useSafeAreaInsets();
  const container = getContainerStyles(insets);

  // go back to the AddToList screen
  const handleCancel = () => {
    navigation.goBack();
  };

  // save the data to lists collection
  const handleSubmit = () => {
    let hasError = false;
    if (!title || !icon) {
      hasError = true;
    }
    if (hasError) {
      Alert.alert("Please name the list and select icon");
    } else {
      // update the value
      if (route.params) {
        const pressedList = route.params.pressedList;
        updateList(pressedList.id, title, iconColor, icon);
      } else {
        // write value to database
        const newList = { title: title, color: iconColor, icon: icon };
        writeListToDB(newList);
      }
      navigation.navigate("AddToList");
    }
  };

  // update the icon value selected
  useEffect(() => {
    if (icon) {
      const foundIcon = findIconLabel(icon, icons.iconOption);
      setShowIcon(foundIcon.label);
    }
  }, [icon]);

  // find the label based on the value
  const findIconLabel = (value, iconOptions) => {
    return iconOptions.find((item) => item.value === value) || null;
  };

  function changeIcon(selectedIcon) {
    setIcon(selectedIcon);
  }

  function changeTitle(title) {
    setTitle(title);
  }

  const handleDelete = async () => {
    if (route.params) {
      try {
        const pressedList = route.params.pressedList;
        // need to delete all notes with the list
        const notesQuery = query(
          collection(database, "notes"),
          where("list", "==", pressedList)
        );
        const notesSnapshot = await getDocs(notesQuery);
        notesSnapshot.forEach(async (doc) => {
          await deleteNoteFromDB(doc.id);
        });
        // delete the list from the collection
        await deleteListFromDB(pressedList.id);
        navigation.navigate("Wishlist");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <View style={[styles.container, container]}>
      {/* show a delete button when it's in edit mode */}
      {route.params && (
        <PressableButton
          defaultStyle={styles.delete}
          pressedStyle={styles.pressed}
          onPressFunction={handleDelete}
        >
          <Text style={styles.submitText}>Delete</Text>
        </PressableButton>
      )}
      <View style={styles.info}>
        <Text style={styles.title}>Title</Text>
        <InputField changedHandler={changeTitle} value={title} fontSize={18} />
      </View>
      {/* icon options for selection */}
      <View style={styles.iconSelect}>
        <Text style={[styles.title, styles.iconPickerTitle]}>
          Select the Icon
        </Text>
        <IconSelect
          onValueChange={changeIcon}
          updateValue={route.params ? route.params.pressedList.icon : null}
        />
      </View>
      <View style={styles.iconColorSelector}>
        {/* color options for selection */}
        <Text style={[styles.title, styles.iconPickerTitle]}>
          Select Icon Color
        </Text>
        <View style={styles.colorGroup}>
          {colorChoice.map((item, index) => {
            const isActive = iconColor === index;
            return (
              <View key={item}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setIconColor(index);
                  }}
                >
                  <View
                    style={[styles.circle, isActive && { borderColor: item }]}
                  >
                    <View
                      style={[styles.circleInside, { backgroundColor: item }]}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            );
          })}
        </View>
      </View>
      {/* show the final icon with the select shape and color */}
      <View style={[styles.icon, { backgroundColor: colorChoice[iconColor] }]}>
        {showIcon}
      </View>
      {/* cancel and save button */}
      <View style={styles.buttons}>
        <PressableButton
          pressedStyle={styles.pressed}
          onPressFunction={handleCancel}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </PressableButton>
        <PressableButton
          defaultStyle={styles.submit}
          pressedStyle={styles.pressed}
          onPressFunction={handleSubmit}
        >
          <Text style={styles.submitText}>Save The List</Text>
        </PressableButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    padding: 30,
    marginTop: 30,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    color: colors.black,
  },
  info: {
    marginBottom: 10,
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  cancelText: {
    color: colors.deepYellow,
    fontWeight: "bold",
  },
  submitText: {
    color: colors.white,
    fontWeight: "bold",
  },
  submit: {
    backgroundColor: colors.deepYellow,
    width: "75%",
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  colorGroup: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 12,
    marginTop: 10,
    marginHorizontal: 20,
  },
  circle: {
    width: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
    height: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
    borderRadius: 9999,
    backgroundColor: "white",
    borderWidth: CIRCLE_RING_SIZE,
    borderColor: "transparent",
    marginRight: 8,
    marginBottom: 12,
  },
  circleInside: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: 9999,
    position: "absolute",
    top: CIRCLE_RING_SIZE,
    left: CIRCLE_RING_SIZE,
  },
  icon: {
    alignSelf: "center",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    marginBottom: 24,
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  iconSelect: {
    height: 90,
    zIndex: 9999,
    marginTop: 10,
  },
  delete: {
    backgroundColor: colors.deepYellow,
    width: "25%",
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconColorSelector: {
    marginVertical: 15,
  },
  iconPickerTitle: {
    marginLeft: 20,
  },
});
