import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import PressableButton from "./PressableButton";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons'; 
import { colors } from "../styles/Colors";
import { getContainerStyles } from "../components/SafeArea";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Switch } from '@rneui/themed';
import InputField from './InputField';
import { useRoute } from '@react-navigation/native';
import { icons } from '../styles/Icons';
import { updateNote, writeNoteToDB } from '../firebase/firestoreHelper';

export default function WishNote( { navigation } ) {
  const route = useRoute();
  const [list, setList] = useState(route.params?.selectedList || route.params?.pressedWishlist || null)
  const [title, setTitle] = useState(route.params?.pressedWishlist?.title || "")
  const [note, setNote] = useState(route.params?.pressedWishlist?.note || "")
  // update location later
  const [location, setLocation] = useState("Location")
  // update reminder setting later
  const [reminder, setReminder] = useState(false);

  // Update the state with the selected list
  useFocusEffect(
    React.useCallback(() => {
      setList(route.params?.selectedList || null);
    }, [route.params?.selectedList])
  );

  // safe area
  const insets = useSafeAreaInsets();
  const container = getContainerStyles(insets);

  // go back to the wishlist screen
  const handleCancel = () => {
    navigation.goBack();
  };

  // save the data to notes collection
  const handleSubmit = () => {
    let hasError = false;
    if (!title || !location || !list) {
      hasError = true;
    }
    if (hasError) {
      Alert.alert('invalid field');
    } else {
      // update the value
      if (route.params.pressedWishlist) {
        const pressedWishlist = route.params.pressedWishlist;
        updateNote(pressedWishlist.id, title, location, note, list, reminder)
      } else {
        // write value to database
        const newWishlist = { title, location, note, list, reminder};
        writeNoteToDB(newWishlist);
      }
      navigation.navigate("Wishlist");
    }
  };

  // navigate to AddToList
  const handleAddToList = () => {
    navigation.navigate('AddToList'); 
  };

  const findIconLabel = (value, iconOptions) => {
    return iconOptions.find((item) => item.value === value) || null;
  };

  const foundIcon = findIconLabel(list?.icon, icons.iconOption);

  function changeTitle(noteTitle) {
    setTitle(noteTitle);
  }

  function changeNote(noteContent) {
    setNote(noteContent);
  }

  return (
    <View style={[styles.container, container]}>
      <View style={styles.info}>
        <Text style={styles.title}>Title</Text>
        <InputField placeholder="Write the title" changedHandler={changeTitle} value={title}/>
      </View>
      <View style={[styles.info, styles.label]}>
        <Ionicons
          name="location"
          size={20}
          color={colors.deepYellow}
        />
        <Text>Location</Text>
        <AntDesign name="right" size={14} color={colors.black} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>Note</Text>
        <InputField placeholder="Write your important note (optional)" height={200} changedHandler={changeNote} value={note}/>
      </View>
      {/* navigate to select the list to add the location*/}
      <PressableButton 
          pressedStyle={styles.pressed}
          onPressFunction={handleAddToList}>
        <View style={[styles.info, styles.label]}>
          <MaterialIcons name="add-location-alt" size={20} color={colors.deepYellow} />
          <Text>Add To List</Text>
          {/* show the selected list title and icon */}
          { list && <View style={styles.listContent}>
            <View style={[styles.icon, { backgroundColor: colors.colorOption[list.color] }]}>
              {foundIcon?.label}
            </View>
            <Text style={styles.title}>{list.title}</Text>
          </View>}
          <AntDesign name="right" size={14} color={colors.black} />
        </View>
      </PressableButton>
      <View style={[styles.info, styles.label]}>
        <Ionicons
          name="calendar"
          size={20}
          color={colors.deepYellow}
        />
        <Text>Set Date Reminder</Text>
        { /* add a switch to turn on date reminder */ }
        <Switch
          value={reminder}
          onValueChange={(value) => setReminder(value)}
          color={colors.deepGreen}
        />
      </View>
      <View style={styles.reminder}>
      { /* date reminder notification setting will replace */ }
      {reminder && (
      <View style={styles.dateReminderContainer}>
        <Text style={styles.dateReminderText}>Date Reminder</Text>
      </View>
      )}
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
          <Text style={styles.submitText}>Add to Wishlist</Text>
        </PressableButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    padding: 30,
    marginTop: 30,
  },
  title: {
    fontWeight: 'bold',
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
  label: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminder: {
    alignItems: "center",
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
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  dateReminderContainer: {
    backgroundColor: colors.deepGreen,
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    width: "90%",
  },
  dateReminderText: {
    color: colors.white,
    fontWeight: "bold",
  },
  icon: {
    alignSelf: 'center',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  listContent: {
    flexDirection: "row",
    marginLeft: 10,
    marginRight: 10,
  }
});