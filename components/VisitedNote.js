import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Keyboard,
  Alert,
} from "react-native";
import React, { useRef, useState, useMemo, useEffect } from "react";
import PressableButton from "./PressableButton";
import { colors } from "../styles/Colors";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { getContainerStyles } from "../components/SafeArea";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  writeJournalToDB,
  updateJournalToDB,
  saveUserInfo,
} from "../firebase/firestoreHelper";
import ImageSection from "./ImageSection";
import { auth } from "../firebase/firebaseSetup";

const VisitedNote = ({ navigation, route }) => {
  // safe area
  const insets = useSafeAreaInsets();
  const safeAreaContainer = getContainerStyles(insets);

  // initialize
  const [id, setId] = useState();
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [location, setLocation] = useState();
  const [visibility, setVisibility] = useState(1);
  const [visitDate, setVisitDate] = useState(new Date());
  const [journal, setJournal] = useState(null);
  const [journalImages, setJournalImages] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [weather, setWeather] = useState("");

  // edit pages
  useEffect(() => {
    if (route.params && route.params.journal) {
      const fetchedJournal = route.params.journal;
      // console.log(fetchedJournal);

      if (fetchedJournal.visitDate) {
        const date = new Date(fetchedJournal.visitDate);
        setDate(date);
      } else if (fetchedJournal.date) {
        const date = new Date(
          fetchedJournal.date.seconds * 1000 +
            fetchedJournal.date.nanoseconds / 1e6
        );
        setDate(date);
      }

      setLocation(fetchedJournal.location);
      setId(fetchedJournal.id);
      setTitle(fetchedJournal.title);
      setNote(fetchedJournal.note);
      setVisibility(fetchedJournal.visibility);
      setJournalImages(fetchedJournal.images);
      setWeather(fetchedJournal.weather);
    }
    if (route.params && route.params.locationData) {
      setLocation(route.params.locationData);
    }
  }, [route.params]);

  // console.log(
  //   "current visit date, location, weather",
  //   visitDate,
  //   location,
  //   weather
  // );

  // set images
  const setTakenImages = (uri, image) => {
    setJournalImages([...journalImages, uri]);
  };

  const checkUploading = (res) => {
    setIsUploaded(res);
  };

  // set location
  const changeLocation = () => {
    console.log(isUploaded);
    if (!isUploaded) {
      Alert.alert(
        "The photos are uploading, please wait some seconds and try again"
      );
      return;
    }
    const currentJournal = {
      title,
      note,
      visibility,
      visitDate: visitDate.toISOString(),
      images: journalImages,
    };
    if (journal) {
      const curJournal = { ...currentJournal, id: journal.id };
      navigation.navigate("Map", {
        currentJournal: curJournal,
      });
    } else {
      navigation.navigate("Map", {
        currentJournal,
      });
    }
  };

  // visibility for options
  const [visibilityModal, setVisibilityModal] = useState(false);

  // bottom sheet
  // Ref
  const bottomSheetRef = useRef(null);
  // Variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  // change visibility
  const changeVisible = () => {
    setVisibilityModal(true);
  };

  const onPressPublic = () => {
    setVisibility(1);
    setVisibilityModal(false);
  };

  const onPressPrivate = () => {
    setVisibility(0);
    setVisibilityModal(false);
  };

  // change date
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setIsDatePickerVisible(false);
    setDate(currentDate);
  };

  const changeDate = () => {
    setIsDatePickerVisible(true);
  };

  useEffect(() => {
    setVisitDate(date);
  }, [date]);

  // get weather after setting location and visit date
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const diff =
          Math.ceil((new Date() - visitDate) / (1000 * 60 * 60 * 24)) - 1;
        const newVisitDate = visitDate.toLocaleDateString().split("/");
        let day = newVisitDate[1];
        let number = parseInt(day, 10);
        if (!isNaN(number) && number >= 0 && number < 10) {
          // If it's a single-digit number, add a leading zero
          day = "0" + day;
        }
        const newVisit = newVisitDate[2] + "-" + newVisitDate[0] + "-" + day;
        console.log("new visit date, format", newVisitDate, newVisit);
        if (diff > 7) {
          const response = await fetch(
            `https://archive-api.open-meteo.com/v1/archive?latitude=${location.latitude}&longitude=${location.longitude}&start_date=${newVisit}&end_date=${newVisit}&daily=weather_code,temperature_2m_mean`
          );
          const result = await response.json();
          if (result) {
            const weather = {
              code: result.daily.weather_code[0],
              temp: result.daily.temperature_2m_mean[0],
            };
            setWeather(weather);
          }
        } else {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&past_days=${diff}`
          );
          const result = await response.json();
          if (result) {
            const weather = {
              code: result.daily.weather_code[0],
              temp: result.daily.temperature_2m_max[0],
            };
            setWeather(weather);
          }
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };
    if (location && visitDate) {
      fetchWeatherData();
    }
  }, [location, visitDate]);

  // cancel and submit
  const handleCancel = () => {
    navigation.navigate("Home");
  };

  const writeToDB = async () => {
    try {
      if (!journal || !journal.id) {
        const newJournal = {
          title: title,
          note: note,
          location: location,
          visibility: visibility,
          date: visitDate,
          editTime: new Date(),
          images: journalImages,
          weather: weather,
        };
        writeJournalToDB(newJournal);
        saveUserInfo({ username: auth.currentUser.displayName });
      } else {
        if (title != journal.title) {
          updateJournalToDB(journal.id, { title: title });
        }
        if (note != journal.content) {
          updateJournalToDB(journal.id, { note: note });
        }
        updateJournalToDB(journal.id, { location: location });
        if (visibility != journal.visibility) {
          updateJournalToDB(journal.id, { visibility: visibility });
        }
        if (visitDate != journal.date) {
          updateJournalToDB(journal.id, { date: visitDate });
        }
        updateJournalToDB(journal.id, {
          images: journalImages,
        });
        updateJournalToDB(journal.id, {
          weather: weather,
        });
      }
    } catch (err) {
      console.log("write to db error:", err);
    }
  };

  const handleSubmit = async () => {
    if (!title || !visitDate || !journalImages || !location) {
      Alert.alert(
        "Please fill out the title, location, visit date and add at least one photo"
      );
      return;
    }
    if (!isUploaded) {
      Alert.alert(
        "The photos are uploading, please wait some seconds and try again"
      );
      return;
    }
    const today = new Date();
    console.log(visitDate, today);
    if (visitDate > today) {
      Alert.alert("Please don't set future days as your visit date");
      return;
    }
    console.log("ready to write to db", journal);
    try {
      const res = await writeToDB();
    } catch (err) {
      console.log("wtbd", err);
    }
    navigation.navigate("Home");
  };

  return (
    <View style={[safeAreaContainer, styles.noteContainer]}>
      {/* the input area */}
      <View style={styles.formContainer}>
        {/* the title and content */}
        <View>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            onBlur={Keyboard.dismiss}
          />
          <Text style={styles.label}>Note</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            value={note}
            onChangeText={setNote}
            multiline={true}
            onBlur={Keyboard.dismiss}
          />
        </View>

        {/* the image area */}
        <ImageSection
          passImageUri={setTakenImages}
          images={journalImages}
          onCheckStorage={checkUploading}
        />

        {/* the info area */}
        <View>
          <PressableButton onPressFunction={changeLocation}>
            <View style={styles.option}>
              <View>
                <View style={styles.optionLabel}>
                  <View style={styles.icon}>
                    <Ionicons
                      name="location"
                      size={15}
                      color={colors.darkYellow}
                    />
                  </View>
                  <Text>Location</Text>
                </View>
                <Text style={styles.locationText}>{location?.address}</Text>
              </View>
              <AntDesign name="right" size={14} color={colors.black} />
            </View>
          </PressableButton>
          <PressableButton onPressFunction={changeVisible}>
            <View style={styles.option}>
              <View style={styles.optionLabel}>
                <View style={styles.icon}>
                  <Ionicons
                    name="lock-open"
                    size={15}
                    color={colors.darkYellow}
                  />
                </View>
                <Text>Visibility</Text>
              </View>
              <View style={styles.optionLabel}>
                <Text>{visibility ? "Public" : "Private"}</Text>
                <AntDesign name="right" size={14} color={colors.black} />
              </View>
            </View>
          </PressableButton>
          <PressableButton onPressFunction={changeDate}>
            <View style={styles.option}>
              <View style={styles.optionLabel}>
                <View style={styles.icon}>
                  <Ionicons
                    name="calendar"
                    size={15}
                    color={colors.darkYellow}
                  />
                </View>
                <Text>Visit Date</Text>
              </View>
              <View style={styles.optionLabel}>
                <Text>{visitDate && visitDate.toLocaleDateString()}</Text>
                <AntDesign name="right" size={14} color={colors.black} />
              </View>
            </View>
          </PressableButton>
        </View>
      </View>

      {isDatePickerVisible && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          onChange={onChange}
        />
      )}

      {/* cancel and save */}
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
          <Text style={styles.submitText}>Mark As Visited</Text>
        </PressableButton>
      </View>

      {visibilityModal && (
        <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
          <View style={styles.visibilityContainer}>
            <PressableButton
              defaultStyle={styles.visibleOption}
              onPressFunction={onPressPublic}
            >
              {visibility ? (
                <FontAwesome
                  name="check-circle"
                  size={20}
                  color={colors.darkYellow}
                />
              ) : (
                <FontAwesome
                  name="circle-o"
                  size={20}
                  color={colors.darkYellow}
                />
              )}
              <Text>Public</Text>
            </PressableButton>
            <PressableButton
              defaultStyle={styles.visibleOption}
              onPressFunction={onPressPrivate}
            >
              {!visibility ? (
                <FontAwesome
                  name="check-circle"
                  size={20}
                  color={colors.darkYellow}
                />
              ) : (
                <FontAwesome
                  name="circle-o"
                  size={20}
                  color={colors.darkYellow}
                />
              )}
              <Text>Private</Text>
            </PressableButton>
          </View>
        </BottomSheet>
      )}
    </View>
  );
};

export default VisitedNote;

const styles = StyleSheet.create({
  noteContainer: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  formContainer: {
    width: "90%",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
  },
  cancelText: {
    color: colors.deepYellow,
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
  submitText: {
    color: colors.white,
    fontWeight: "bold",
  },
  pressed: {
    opacity: 0.7,
  },
  optionLocation: {
    paddingVertical: 5,
  },
  option: {
    flexDirection: "row",
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginTop: 5,
  },
  input: {
    backgroundColor: colors.lightGreen,
    borderRadius: 5,
    height: 30,
    marginTop: 5,
    paddingHorizontal: 10,
  },
  inputBox: {
    height: 280,
  },
  locationText: {
    paddingHorizontal: 25,
    flexWrap: "wrap",
  },

  // visibility modal
  visibilityContainer: {
    flex: 1,
    padding: 20,
    gap: 40,
  },
  visibleOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
