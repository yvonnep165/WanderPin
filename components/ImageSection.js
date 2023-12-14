import { StyleSheet, Text, View, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import PressableButton from "./PressableButton";
import { MaterialIcons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import { colors } from "../styles/Colors";
import * as ImagePicker from "expo-image-picker";
import { downloadURL, uploadImageToStorage } from "../firebase/firestoreHelper";

const ImageSection = ({ passImageUri, images, onCheckStorage }) => {
  const buttons = [
    { type: "button", id: "photo" },
    { type: "button", id: "camera" },
  ];

  const [photos, setPhotos] = useState([]);
  const [tempPhotos, setTempPhotos] = useState([]);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  useEffect(() => {
    setPhotos([...buttons, ...images]);
    setTempPhotos([...buttons, ...images]);
  }, [images]);

  useEffect(() => {
    if (photos.length >= tempPhotos.length) {
      onCheckStorage(true);
    } else {
      onCheckStorage(false);
    }
  }, [photos, tempPhotos]);

  const verifyPermission = async () => {
    if (status.granted) {
      return true;
    }
    try {
      const response = await requestPermission();
      return response.granted;
    } catch (err) {
      console.log("image permission", err);
    }
  };

  // process images
  const imageHandler = async (image) => {
    try {
      setTempPhotos((prev) => [...prev, image]);
      const relativeUri = await uploadImageToStorage(image);
      const imageUri = await downloadURL(relativeUri);
      setPhotos((prev) => [...prev, imageUri]);
      passImageUri(imageUri, image);
    } catch (err) {
      console.log("imageHandler error:", err);
    }
  };

  useEffect(() => {
    console.log("temp", tempPhotos, "photo:", photos);
  }, [photos, tempPhotos]);

  // add photos
  const addImageHandler = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        const image = result.assets[0].uri;
        await imageHandler(image);
      }
    } catch (err) {
      console.log("add error:", err);
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
      if (!result.canceled) {
        const image = result.assets[0].uri;
        await imageHandler(image);
      }
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
        data={photos.length < tempPhotos.length ? tempPhotos : photos}
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
    backgroundColor: colors.lightGreen,
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
