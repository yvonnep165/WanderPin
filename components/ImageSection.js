import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import PressableButton from "./PressableButton";
import { MaterialIcons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import { colors } from "../styles/Colors";
import * as ImagePicker from "expo-image-picker";

const ImageSection = ({ passImageUri, images }) => {
  const buttons = [
    { type: "button", id: "photo" },
    { type: "button", id: "camera" },
  ];

  const tempPhotos = [...buttons, ...images];

  const [photos, setPhotos] = useState([]);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  useEffect(() => {
    setPhotos(tempPhotos);
  }, [images]);

  const verifyPermission = async () => {
    if (status.granted) {
      return true;
    }
    const response = await requestPermission();
    return response.granted;
  };

  // add photos
  const addImageHandler = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      setPhotos([...photos, result.assets[0].uri]);
      passImageUri(result.assets[0].uri);
    } catch (err) {
      console.log(err);
    }
  };

  // take photos
  const takeImageHandler = async () => {
    try {
      const hasPermission = await verifyPermission();
      if (!hasPermission) {
        Alert.alert("You need to give access to the camera");
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
      });
      setPhotos([...photos, result.assets[0].uri]);
      passImageUri(result.assets[0].uri);
    } catch (err) {
      console.log("take image error ", err);
    }
  };

  const renderItem = ({ item }) => {
    if (item.type === "button" && item.id === "photo") {
      return (
        <PressableButton
          defaultStyle={styles.imageBox}
          onPressFunction={addImageHandler}
        >
          <MaterialIcons name="insert-photo" size={24} color="black" />
        </PressableButton>
      );
    } else if (item.type === "button" && item.id === "camera") {
      return (
        <PressableButton
          defaultStyle={styles.imageBox}
          onPressFunction={takeImageHandler}
        >
          <MaterialIcons name="photo-camera" size={24} color="black" />
        </PressableButton>
      );
    } else {
      return (
        <PressableButton defaultStyle={styles.imageBox}>
          <Image
            source={{ uri: item }}
            resizeMode="cover"
            style={styles.image}
          />
        </PressableButton>
      );
    }
  };

  return (
    <View style={styles.imageContainter}>
      <FlatList
        data={photos}
        horizontal
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default ImageSection;

const styles = StyleSheet.create({
  imageContainter: {
    flexDirection: "row",
  },
  imageBox: {
    backgroundColor: colors.backgroundGreen,
    width: 130,
    height: 130,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderRadius: 5,
  },
  image: {
    width: "100%",
    height: 130,
    borderRadius: 5,
  },
});
