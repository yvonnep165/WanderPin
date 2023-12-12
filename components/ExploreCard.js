import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import PressableButton from "./PressableButton";
import { colors } from "../styles/Colors";
import {
  downloadURL,
  getUserInfo,
  getUserInfoById,
} from "../firebase/firestoreHelper";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebase/firebaseSetup";

const ExploreCard = ({ journal, pressCardHandler }) => {
  const [user, setUser] = useState();
  const [isLiked, setIsLiked] = useState(false);
  const [originalKudos, setOriginalKudos] = useState(0);
  const [kudos, setKudos] = useState(0);

  const firebaseUpdateTime = new Date(
    journal.editTime.seconds * 1000 + journal.editTime.nanoseconds / 1e6
  );
  const updateTime = firebaseUpdateTime.toLocaleDateString();

  const pressHandler = () => {
    pressCardHandler(journal);
  };

  const onPressHeart = () => {
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    let liked = isLiked ? 1 : 0;
    setKudos(originalKudos + liked);
  }, [isLiked]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfoById(journal.user);
        console.log(userInfo);
        setUser(userInfo);
      } catch (err) {
        console.log("get user info", err);
      }
    };
    fetchUserInfo();
  }, [journal]);

  return (
    <View style={styles.cardContainer}>
      <PressableButton onPressFunction={pressHandler}>
        <View style={styles.imgContainer}>
          <Image
            style={styles.img}
            resizeMode="cover"
            source={{
              uri: journal.images[0],
            }}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>{journal.title}</Text>
          <View style={styles.subtitle}>
            {user && <Text>{user.username}</Text>}
            {/* <View style={styles.kudos}>
              <PressableButton onPressFunction={onPressHeart}>
                {isLiked ? (
                  <Ionicons
                    name="md-heart-sharp"
                    size={24}
                    color={colors.deepGreen}
                  />
                ) : (
                  <Ionicons
                    name="heart-outline"
                    size={24}
                    color={colors.deepGreen}
                  />
                )}
              </PressableButton>
              {kudos ? <Text>{kudos}</Text> : <Text>Like</Text>}
            </View> */}
          </View>
        </View>
      </PressableButton>
    </View>
  );
};

export default ExploreCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.lightGreen,
    borderRadius: 15,
    width: "45%",
    margin: 10,
  },
  img: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  info: { padding: 10 },
  title: { fontWeight: "700" },
  subtitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kudos: {
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
  },
});
