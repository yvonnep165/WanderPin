import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, {useEffect, useState} from 'react';
import PressableButton from './PressableButton';
import { getContainerStyles } from "../components/SafeArea";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../styles/Colors";
import { AntDesign } from "@expo/vector-icons";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { database } from "../firebase/firebaseSetup";
import List from './List';

export default function AddToList({ navigation }) {
  const [lists, setLists] = useState([]);

    // safe area
    const insets = useSafeAreaInsets();
    const container = getContainerStyles(insets);

    // go back to the wishlist screen
    const handleCancel = () => {
      navigation.goBack();
    };

    // send the list selection to the wishNote
    const handleSubmit = () => {
      navigation.goBack();
    };

    // navigate to CustomList to create a new list
    const handleAddNewList = () => {
      navigation.navigate('CustomList'); 
    };

    // read all the lists from database
    useEffect(()=>{
      let q = collection(database, "lists");
        onSnapshot(q, (querySnapshot) => {
          if (!querySnapshot.empty) {
            let newArray = []
            querySnapshot.forEach((docSnap) => {
              newArray.push({...docSnap.data(), id: docSnap.id});
            });
            setLists(newArray);
          } else {
            setLists([]);
          }
      })
    }, []);

    function listPressHandler(pressedList) {
      navigation.navigate("CustomList", {pressedList});
    }

  return (
    <View style={[styles.container, container]}>
      <View>
      <FlatList 
        contentContainerStyle={{alignItems: 'center'}}
        data={lists}
        renderItem={({ item }) => {
          return (
            <View style={styles.entryContainer}>
              <List list={item} pressHandler={listPressHandler}/>
            </View>
          );
        }}
        />
    </View>
      {/* button to add new lists */}
      <PressableButton 
          pressedStyle={styles.pressed}
          onPressFunction={handleAddNewList}>
        <View style={[styles.info, styles.label]}>
          <Text>Add a New List</Text>
          <AntDesign name="right" size={14} color={colors.black} />
        </View>
      </PressableButton>
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
          <Text style={styles.submitText}>Save</Text>
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
    entryContainer: {
      flexDirection: 'row',
      padding:3, 
  },
  });