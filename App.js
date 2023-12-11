import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./screens/Home";
import Explore from "./screens/Explore";
import Map from "./screens/Map";
import Profile from "./screens/Profile";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "./styles/Colors";
import VisitedNote from "./components/VisitedNote";
import { commonStyles } from "./styles/CommonStyles";
import WishNote from "./components/WishNote";
import JournalDetail from "./components/JournalDetail";
import AddToList from "./components/AddToList";
import CustomList from "./components/CustomList";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Welcome from "./screens/Welcome";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase/firebaseSetup";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = (
  <>
    <Stack.Screen name="Welcome" component={Welcome} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Signup" component={Signup} />
  </>
);
const MainStack = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: colors.lightGreen, paddingTop: 10 },
      tabBarActiveTintColor: colors.deepGreen,
    }}
  >
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="home" size={26} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Explore"
      component={Explore}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="explore" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Map"
      component={Map}
      options={{
        tabBarIcon: ({ color }) => (
          <FontAwesome name="map" size={22} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="person" size={24} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const AppStack = (
  <>
    <Stack.Screen
      name="Main"
      component={MainStack}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="VisitedNote"
      component={VisitedNote}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="WishNote"
      component={WishNote}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="JournalDetail"
      component={JournalDetail}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AddToList"
      component={AddToList}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="CustomList"
      component={CustomList}
      options={{ headerShown: false }}
    />
  </>
);

export default function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        // a valid user is logged in
        setIsUserLoggedIn(true);
      } else {
        //before authentication or after logout
        setIsUserLoggedIn(false);
      }
    });
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: commonStyles.container,
          }}
          initialRouteName="Welcome"
        >
          {isUserLoggedIn ? AppStack : AuthStack}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});
