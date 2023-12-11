import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../styles/Colors";
import Visited from "../components/Visited";
import Wishlist from "../components/Wishlist";
import { getContainerStyles } from "../components/SafeArea";
import { commonStyles } from "../styles/CommonStyles";

const TopTab = createMaterialTopTabNavigator();

const Home = () => {
  const insets = useSafeAreaInsets();
  const container = getContainerStyles(insets);

  return (
    <View style={[container, commonStyles.container, styles.home]}>
      <TopTab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIndicatorStyle: styles.tabBarIndicator,
          tabBarInactiveTintColor: colors.lightGray,
          tabBarActiveTintColor: colors.white,
        }}
      >
        <TopTab.Screen name="Visited" component={Visited} />
        <TopTab.Screen name="Wishlist" component={Wishlist} />
      </TopTab.Navigator>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  home: { paddingBottom: 0 },
  tabBar: {
    backgroundColor: colors.lightGreen,
    width: "90%",
    left: "5%",
    height: 50,
    elevation: 5,
    borderRadius: 30,
    shadowColor: colors.backgroundGreen,
    shadowOffset: {
      height: 5,
      width: 0,
    },
    shadowOpacity: 0.25,
  },
  tabBarIndicator: {
    backgroundColor: colors.darkGreen,
    height: 50,
    borderRadius: 30,
  },
  tabBarLabel: {
    fontWeight: "700",
    fontSize: 15,
  },
});
