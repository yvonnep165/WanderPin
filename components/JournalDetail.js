import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getContainerStyles } from "../components/SafeArea";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { commonStyles } from "../styles/CommonStyles";
import PressableButton from "./PressableButton";
import { onSnapshot, collection } from "firebase/firestore";
import { auth, database } from "../firebase/firebaseSetup";
import {
  deleteJournalFromDB,
  getUserInfoById,
  updateJournalToDB,
} from "../firebase/firestoreHelper";
import { colors } from "../styles/Colors";
import { downloadURL } from "../firebase/firestoreHelper";
import Carousel from "react-native-reanimated-carousel";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { weatherIcons } from "../styles/WeatherIcons";

const JournalDetail = ({ route, navigation }) => {
  // safe area
  const insets = useSafeAreaInsets();
  const safeAreaContainer = getContainerStyles(insets);

  // initial constants
  const [journal, setJournal] = useState(route.params.pressedCard);
  const [user, setUser] = useState();
  const [isLiked, setIsLiked] = useState(false);
  const [originalKudos, setOriginalKudos] = useState(0);
  const [kudos, setKudos] = useState(0);
  const [canEdit, setCanEdit] = useState(true);
  const width = Dimensions.get("window").width * 0.95;

  useEffect(() => {
    // const q = query(collection(database, "goals"), where("user", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(
      collection(database, "journals"),
      (querySnapshot) => {
        const foundJournal = querySnapshot.docs.find(
          (doc) => doc.id === route.params.pressedCard.id
        );
        if (foundJournal) {
          setJournal({ ...foundJournal.data(), id: foundJournal.id });
          setOriginalKudos(foundJournal.data().kudos);
        }
      },
      (err) => {
        console.log(err);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfoById(journal.user);
        setUser(userInfo);
      } catch (err) {
        console.log("get user info", err);
      }
    };
    fetchUserInfo();
  }, [journal]);

  useEffect(() => {
    if (journal && journal.user != auth.currentUser.uid) {
      setCanEdit(false);
    } else {
      setCanEdit(true);
    }
  }, [journal]);

  const firebaseUpdateTime = new Date(
    journal.editTime.seconds * 1000 + journal.editTime.nanoseconds / 1e6
  );
  const updateTime = firebaseUpdateTime.toLocaleDateString();

  const fireabaseVisitDate = new Date(
    journal.date.seconds * 1000 + journal.date.nanoseconds / 1e6
  );
  const date = fireabaseVisitDate.toLocaleDateString();

  // header button handlers
  const onPressBack = () => {
    navigation.goBack();
  };

  // const onPressHeart = () => {
  //   setIsLiked(!isLiked);
  // };

  // useEffect(() => {
  //   let like = isLiked ? 1 : 0;
  //   setKudos((prev) => originalKudos + like);
  //   const updateKudos = async () => {
  //     try {
  //       updateJournalToDB(journal.id, { kudos: kudos });
  //     } catch (err) {
  //       console.log("update kudos error", err);
  //     }
  //   };
  //   updateKudos();
  // }, [isLiked]);

  const onPressEdit = () => {
    navigation.navigate("VisitedNote", {
      journal,
      journalImages: journal.images,
    });
  };

  const onPressDelete = () => {
    deleteJournalFromDB(journal.id);
    navigation.navigate("Visited");
  };

  return (
    <View style={[safeAreaContainer, commonStyles.container]}>
      <View style={styles.containter}>
        <View style={styles.header}>
          <View style={styles.leftHeader}>
            <PressableButton onPressFunction={onPressBack}>
              <MaterialIcons
                name="arrow-back-ios"
                size={20}
                color={colors.black}
              />
            </PressableButton>
            {user && user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <Image
                source={{
                  uri: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
                }}
                style={styles.avatar}
              />
            )}
            {user && <Text>{user.username}</Text>}
          </View>
          {canEdit && (
            <View style={styles.rightHeader}>
              <PressableButton onPressFunction={onPressEdit}>
                <Text style={styles.headerButton}>Edit</Text>
              </PressableButton>
              <PressableButton onPressFunction={onPressDelete}>
                <Text style={styles.headerButton}>Delete</Text>
              </PressableButton>
            </View>
          )}
        </View>

        <ScrollView>
          {journal.images && (
            <Carousel
              width={width}
              height="300"
              data={journal.images}
              mode="parallax"
              pagingEnabled={true}
              scrollAnimationDuration={1000}
              renderItem={({ index, item }) => (
                <View style={styles.imageContainer}>
                  <Image
                    key={index}
                    style={styles.img}
                    resizeMode="cover"
                    source={{
                      uri: item,
                    }}
                  />
                </View>
              )}
            />
          )}

          <View style={styles.info}>
            <Text style={styles.title}>{journal.title}</Text>
            <View style={styles.leftSubtitle}>
              <Ionicons name="location" size={15} color={colors.darkYellow} />
              <Text numberOfLines={2}>{journal.location.address}</Text>
            </View>
            <View style={styles.subTitleBadge}>
              <Text style={styles.subTitle}>Visit Date: {date}</Text>
              {weatherIcons[journal.weather.code]}
              <Text>{journal.weather.temp}°C</Text>
            </View>
            <Text>{journal.note}</Text>
            <Text style={styles.extraInfo}>Edit Date: {updateTime}</Text>
          </View>
        </ScrollView>

        {/* <View style={styles.bottomContainer}>
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
  );
};

export default JournalDetail;

const styles = StyleSheet.create({
  containter: {
    paddingHorizontal: 10,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    alignItems: "center",
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 10,
  },
  rightHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerButton: {
    color: colors.deepGreen,
    fontWeight: "bold",
  },
  img: {
    width: "100%",
    height: 300,
  },
  info: {
    paddingTop: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "600",
    paddingVertical: 10,
  },
  subTitleBadge: {
    backgroundColor: colors.lightGreen,
    alignSelf: "flex-start",
    padding: 8,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  subTitle: {
    fontSize: 16,
  },
  extraInfo: {
    color: colors.lightGray,
    fontSize: 12,
    paddingVertical: 10,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    justifyContent: "flex-end",
    paddingRight: 20,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderColor: colors.lightGray,
    marginBottom: 10,
  },
  leftSubtitle: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    paddingBottom: 15,
  },
});
