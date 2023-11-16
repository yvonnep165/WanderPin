import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../styles/Colors";
import Visited from "../components/Visited";
import Wishlist from "../components/Wishlist";
import VisitedNote from "../components/VisitedNote";
import { getContainerStyles } from "../components/SafeArea";
import { commonStyles } from "../styles/CommonStyles";

const TopTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const HomeScreen = () => {
  return (
    <TopTab.Navigator screenOptions={{ tabBarStyle: styles.tabBar}}>
      <TopTab.Screen name="Visited" component={Visited} />
      <TopTab.Screen name="Wishlist" component={Wishlist} />
    </TopTab.Navigator>
  );
};

const Home = () => {
  const insets = useSafeAreaInsets();
  const container = getContainerStyles(insets);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, cardStyle: [container, commonStyles.container] }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AddVisitedNote" component={VisitedNote} />
    </Stack.Navigator>
  );
};

export default Home;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.lightGreen,
    height: 60,
    borderRadius: 20,
  },
});
