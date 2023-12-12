import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getContainerStyles } from "../components/SafeArea";
import { commonStyles } from "../styles/CommonStyles";
import { colors } from "../styles/Colors";
import {
  downloadURL,
  getJournalNumbersByUser,
  getUserInfoById,
  saveUserInfo,
  uploadImageToStorage,
} from "../firebase/firestoreHelper";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import PressableButton from "../components/PressableButton";
import * as ImagePicker from "expo-image-picker";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseSetup";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { database } from "../firebase/firebaseSetup";
import { FlatList } from "react-native-gesture-handler";
import ListCard from "../components/ListCard";

const Profile = ({ navigation }) => {
  const [user, setUser] = useState();
  const [avatar, setAvatar] = useState();
  const [wishlist, setWishlist] = useState([]);

  const insets = useSafeAreaInsets();
  const container = getContainerStyles(insets);

  useEffect(() => {
    const q = query(
      collection(database, "lists"),
      where("user", "==", auth.currentUser.uid)
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        let newArray = [];
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            newArray.push({ ...doc.data(), id: doc.id });
          });
        }
        setWishlist(newArray);
      },
      (err) => {
        console.log(err);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const pressAvatarHandler = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        const image = result.assets[0].uri;
        setAvatar((prev) => image);
        const relativeUri = await uploadImageToStorage(image);
        const imageUri = await downloadURL(relativeUri);
        setAvatar((prev) => imageUri);
        saveUserInfo({ avatar: imageUri });
      }
    } catch (err) {
      console.log("add error:", err);
    }
  };

  function handleSignOut() {
    console.log("logout pressed");
    try {
      signOut(auth);
    } catch (err) {
      console.log("sighout err", err);
    }
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfoById(auth.currentUser.uid);
        setUser(userInfo);
      } catch (err) {
        console.log("get user info", err);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (user) {
      setAvatar(user.avatar);
    }
  }, [user]);

  // navigate to AddToList
  const handleAddToList = () => {
    navigation.navigate("CustomList");
  };

  return (
    <View style={[container, commonStyles.container, styles.container]}>
      <View style={styles.header}>
        <Text style={styles.title}>{auth.currentUser.displayName}</Text>
        <View style={styles.avatar}>
          <Image
            style={styles.img}
            resizeMode="cover"
            source={{
              uri: avatar
                ? avatar
                : "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
            }}
          />
          <PressableButton
            onPressFunction={pressAvatarHandler}
            defaultStyle={styles.avatarEdit}
            pressedStyle={styles.avatarPressed}
          >
            <MaterialIcons name="photo-camera" size={24} color="black" />
          </PressableButton>
        </View>
      </View>
      <View style={styles.logout}>
        <PressableButton
          onPressFunction={handleSignOut}
          defaultStyle={styles.logoutButton}
        >
          <Text>Log Out</Text>
        </PressableButton>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.option}>
          <Text style={styles.subtitle}>Wishlist Category</Text>
          <Text style={styles.subtitle}>{wishlist.length}</Text>
        </View>
        <FlatList
          // contentContainerStyle={styles.cards}
          data={wishlist}
          renderItem={({ item }) => {
            return <ListCard list={item} />;
          }}
        />
        <PressableButton
          pressedStyle={styles.pressed}
          onPressFunction={handleAddToList}
          defaultStyle={styles.info}
        >
          <View style={styles.label}>
            <MaterialIcons
              name="library-add"
              size={24}
              color={colors.deepGreen}
            />
            <Text>Add New Category</Text>
            <AntDesign name="right" size={14} color={colors.black} />
          </View>
        </PressableButton>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { paddingHorizontal: 10, paddingTop: 0 },
  header: {
    height: "35%",
    backgroundColor: colors.lightYellow,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    paddingTop: 20,
    paddingBottom: 10,
  },
  logout: {
    alignItems: "center",
    marginTop: -20,
  },
  logoutButton: {
    backgroundColor: colors.lightGreen,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: colors.lightGray,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
  },
  title: {
    fontSize: 25,
    fontWeight: "600",
    alignSelf: "center",
    paddingTop: 10,
  },
  avatar: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: -25,
  },
  avatarEdit: {},
  avatarPressed: {
    opacity: 0.5,
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 20,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  pressed: {
    opacity: 0.7,
  },
  info: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
