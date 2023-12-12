import { View, Text, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import PressableButton from "./PressableButton";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons'; 
import { colors } from "../styles/Colors";
import { getContainerStyles } from "../components/SafeArea";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import InputField from './InputField';
import { useRoute } from '@react-navigation/native';
import { icons } from '../styles/Icons';
import { iconStyle } from '../styles/CommonStyles';
import { deleteNoteFromDB, updateNote, writeNoteToDB } from '../firebase/firestoreHelper';
import NotificationManager from './NotificationManager';

export default function WishNote( { navigation } ) {
  const route = useRoute();
  const [list, setList] = useState(route.params?.selectedList || route.params?.pressedWishlist?.list || route.params?.newWishNote?.list || null)
  const [title, setTitle] = useState(route.params?.pressedWishlist?.title || route.params?.newWishNote?.title || "")
  const [note, setNote] = useState(route.params?.pressedWishlist?.note || route.params?.newWishNote?.note || "")
  const [noteId, setNoteId] = useState(route.params?.pressedWishlist?.id || route.params?.newWishNote?.noteId || null)
  const [wishlistLocation, setWishlistLocation] = useState(route.params?.locationData || route.params?.pressedWishlist?.location || route.params?.newWishNote?.wishlistLocation || null)
  const [reminder, setReminder] = useState(route.params?.pressedWishlist?.reminder || route.params?.newWishNote?.reminder ||false);

  // Update the state with the selected list
  useFocusEffect(
    React.useCallback(() => {
      setList(route.params?.selectedList || route.params?.pressedWishlist?.list || route.params?.newWishNote?.list || null);
    }, [route.params?.selectedList || route.params?.pressedWishlist?.list || route.params?.newWishNote?.list])
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
    if (!title) {
      Alert.alert('Please enter a title');
      return
    }
    else if(!wishlistLocation){
      Alert.alert('Please set a location');
      return
    }
    else if(!list){
      Alert.alert('Please select a list to add');
      return
    }
    else {
      // update the value
      if (noteId) {
        const updateWishNote = { id: noteId, title, location: wishlistLocation, note, list, reminder};
        updateNote(updateWishNote)
      } else {
        // write value to database
        const newWishlist = { title, location: wishlistLocation, note, list, reminder};
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

  // delete the note from the collection
  const handleDelete = () => {
      deleteNoteFromDB(noteId);
      navigation.navigate("Wishlist");
  };

  // navigate to the Map with the detail information of the currentWishNote
  const handleSelectLocation = () => {
    const currentWishNote = { noteId, title, wishlistLocation, note, list, reminder }
    navigation.navigate("Map", { currentWishNote });
  }

  return (
    <View style={[styles.container, container]}>
      {/* show a delete button when it's in edit mode */}
      <View style={styles.header}>
        {noteId && (
          <PressableButton
            defaultStyle={styles.delete}
            pressedStyle={styles.pressed}
            onPressFunction={handleDelete}
          >
            <Text style={styles.deleteButton}>Delete</Text>
          </PressableButton>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>Title</Text>
        <InputField changedHandler={changeTitle} value={title} fontSize={18}/>
      </View>
      <PressableButton 
          pressedStyle={styles.pressed}
          onPressFunction={handleSelectLocation}>
        <View style={[styles.info, styles.label]}>
        <Ionicons
          name="location"
          size={25}
          color={colors.deepYellow}
        />
          <Text style={[styles.description, wishlistLocation && styles.locationDescription]}>{wishlistLocation? wishlistLocation.address : `Set Location`}</Text>
          <AntDesign name="right" size={20} color={colors.black}/>
        </View>
      </PressableButton>
      <View style={styles.info}>
        <Text style={styles.title}>Note</Text>
        <InputField 
        placeholder="(optional)" 
        height={200} 
        changedHandler={changeNote} 
        value={note} 
        fontSize={18} 
        multiline={true}/>
      </View>
      {/* navigate to select the list to add */}
      <PressableButton 
          pressedStyle={styles.pressed}
          onPressFunction={handleAddToList}>
        <View style={[styles.info, styles.label]}>
          <MaterialIcons name="add-location-alt" size={25} color={colors.deepYellow} />
          <Text style={styles.description}>Add To List</Text>
          {/* show the selected list title and icon */}
          { list && <View style={styles.listContent}>
            <View style={[styles.icon, { backgroundColor: colors.colorOption[list.color] }]}>
              {foundIcon?.label}
            </View>
            <Text style={styles.listTitle}>{list.title}</Text>
          </View>}
          <AntDesign name="right" size={20} color={colors.black} />
        </View>
      </PressableButton>
      <View style={[styles.info, styles.label]}>
        <Ionicons
          name="calendar"
          size={25}
          color={colors.deepYellow}
        />
        <Text style={styles.description}>Set Date Reminder</Text>
        { /* add a switch to turn on date reminder */ }
        <NotificationManager changedHandler={(value)=>setReminder(value)} value={reminder}/>  
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
          <Text style={styles.submitText}>{noteId ? 'Update Wishlist' : 'Add to Wishlist'}</Text>
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
    marginTop: 10,
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
  dateReminderContainer: {
    backgroundColor: colors.deepGreen,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: "90%",
  },
  dateReminderText: {
    color: colors.white,
    fontWeight: "bold",
  },
  icon: iconStyle,
  listContent: {
    flexDirection: "row",
    marginLeft: 15,
    marginRight: 15,
    alignItems: "center",
    width: 170,
  },
  delete: {
    width: "25%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    fontSize: 15, 
    marginHorizontal: 10,
  },
  deleteButton: {
    color: colors.deepGreen,
    fontWeight: "bold",
    fontSize: 18,
  },
  header: {
    flexDirection: "row-reverse",
  },
  listTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: colors.black,
    paddingRight: 12,
  },
  locationDescription: {
    width: 280,
  },
});