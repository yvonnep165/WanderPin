import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getContainerStyles } from "../components/SafeArea";
import { commonStyles } from "../styles/CommonStyles";
import { colors } from "../styles/Colors";
import {
  downloadURL,
  getJournalNumbersByUser,
  uploadImageToStorage,
} from "../firebase/firestoreHelper";
import { MaterialIcons } from "@expo/vector-icons";
import PressableButton from "../components/PressableButton";
import * as ImagePicker from "expo-image-picker";

const Profile = () => {
  const [avatar, setAvatar] = useState(
    "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
  );

  const insets = useSafeAreaInsets();
  const container = getContainerStyles(insets);
  console.log(avatar);
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
        setAvatar(image);
        const relativeUri = await uploadImageToStorage(image);
        const imageUri = await downloadURL(relativeUri);
        setAvatar(imageUri);
      }
    } catch (err) {
      console.log("add error:", err);
    }
  };
  return (
    <View style={[container, commonStyles.container, styles.container]}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.avatar}>
          <Image
            style={styles.img}
            resizeMode="cover"
            source={{
              uri: avatar,
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
      <View>
        <Text style={styles.title}>Username</Text>
        <View style={styles.option}>
          <Text style={styles.subtitle}>Locations</Text>
          <Text style={styles.subtitle}>12(temp)</Text>
        </View>
        <View style={styles.option}>
          <Text style={styles.subtitle}>Posts</Text>
          <Text style={styles.subtitle}>8(temp)</Text>
        </View>
        <View style={styles.option}>
          <Text style={styles.subtitle}>Wishlist</Text>
          <Text style={styles.subtitle}>8(temp)</Text>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { paddingHorizontal: 10 },
  header: {
    height: "30%",
    backgroundColor: colors.lightYellow,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
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
    // color: colors.lightGray,
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
  },
  subtitle: {
    fontSize: 20,
  },
});
