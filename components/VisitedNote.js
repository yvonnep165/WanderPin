import { StyleSheet, Text, View, TextInput, ScrollView } from "react-native";
import React, { useRef, useState, useMemo, useCallback } from "react";
import PressableButton from "./PressableButton";
import { colors } from "../styles/Colors";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { getContainerStyles } from "../components/SafeArea";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { commonStyles } from "../styles/CommonStyles";
import { FontAwesome } from "@expo/vector-icons";

const VisitedNote = ({ navigation }) => {
  // safe area
  const insets = useSafeAreaInsets();
  const safeAreaContainer = getContainerStyles(insets);

  // initialize
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [location, setLocation] = useState("");
  const [visibility, setVisibility] = useState(1);
  const [visitDate, setVisitData] = useState(null);

  // visibility for options
  const [visibilityModal, setVisibilityModal] = useState(false);

  // bottom sheet
  // Ref
  const bottomSheetRef = useRef(null);
  // Variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  // change visible
  const changeVisible = () => {
    setVisibilityModal(true);
  };

  const onPressPublic = () => {
    setVisibility(1);
    setVisibilityModal(false);
  }

  const onPressPrivate = () => {
    setVisibility(0);
    setVisibilityModal(false);
  }

  // cancel and submit
  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    navigation.goBack();
  };

  return (
    <View style={[safeAreaContainer, styles.noteContainer]}>
      {/* the input area */}
      <View>
        {/* the title and content */}
        <View>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
          <Text style={styles.label}>Note</Text>
          <TextInput
            style={[styles.input, styles.inputBox]}
            value={note}
            onChangeText={setNote}
            multiline={true}
          />
        </View>

        {/* the image area */}
        <View></View>

        {/* the info area */}
        <View>
          <PressableButton>
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
                <Text style={styles.locationText}>
                  {location}8068 WestMinster Hwy, Richmond, BC, Canada
                </Text>
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
          <PressableButton>
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
                <Text>{visitDate}2023-10-21</Text>
                <AntDesign name="right" size={14} color={colors.black} />
              </View>
            </View>
          </PressableButton>
        </View>
      </View>

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
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
        >
          <View style={styles.visibilityContainer}>
            <PressableButton defaultStyle={styles.visibleOption} onPressFunction={onPressPublic}>
              {visibility ? <FontAwesome name="check-circle" size={20} color={colors.darkYellow} /> : <FontAwesome name="circle-o" size={20} color={colors.darkYellow} />}
              <Text>Public</Text>
            </PressableButton>
            <PressableButton defaultStyle={styles.visibleOption} onPressFunction={onPressPrivate}>
            {!visibility ? <FontAwesome name="check-circle" size={20} color={colors.darkYellow} /> : <FontAwesome name="circle-o" size={20} color={colors.darkYellow} />}
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
    backgroundColor: colors.backgroundGreen,
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
    alignItems: 'center',
    gap: 10,
  },
});
