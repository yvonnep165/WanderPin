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
    <View style={[container, commonStyles.container]}>
      <TopTab.Navigator screenOptions={{ tabBarStyle: styles.tabBar }}>
        <TopTab.Screen name="Visited" component={Visited} />
        <TopTab.Screen name="Wishlist" component={Wishlist} />
      </TopTab.Navigator>
    </View>
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
