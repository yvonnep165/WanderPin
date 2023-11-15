import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Visited from "./Visited";
import Wishlist from "./Wishlist";
import { colors } from "../styles/Colors";

const TopTab = createMaterialTopTabNavigator();

const Home = () => {
  return (
    <TopTab.Navigator screenOptions={{ tabBarStyle: styles.tabBar }}>
      <TopTab.Screen name="Visited" component={Visited} />
      <TopTab.Screen name="Wishlist" component={Wishlist} />
    </TopTab.Navigator>
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
