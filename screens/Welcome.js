import { View, Text, StyleSheet, Image, Dimensions} from 'react-native'
import React from 'react';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getContainerStyles } from "../components/SafeArea";
import { commonStyles } from "../styles/CommonStyles";
import PressableButton from "../components/PressableButton";
import { colors } from '../styles/Colors';

const { width, height } = Dimensions.get('window');

export default function Welcome({ navigation }) {
  const insets = useSafeAreaInsets();
  const container = getContainerStyles(insets);

  function handleLogin(){
    navigation.navigate("Login");
  }

  function handleSignup(){
    navigation.navigate("Signup");
  }

  return (
    <View style={[container, commonStyles.container]}>
      <Image
        style={styles.background}
        source={require('../assets/welcomePage.png')}
        resizeMode="cover"
      />
      <View style={styles.header}>
        <Text style={styles.title}>WanderPin</Text>
        <Text style={styles.slogan}>Unlock Your World,{'\n'}One Pin at a Time!</Text>
      </View>
      <View>
        <PressableButton
          defaultStyle={[styles.button, styles.loginButton]}
          pressedStyle={ styles.pressed }
          disabled={false}
          onPressFunction={handleLogin}
        >
          <Text style={styles.text}>Log In</Text>
        </PressableButton>
        <PressableButton
          defaultStyle={ styles.button }
          pressedStyle={styles.pressed}
          disabled={false}
          onPressFunction={handleSignup}
        >
          <Text style={styles.text}>Sign Up</Text>
        </PressableButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  title: {
    fontSize: 40,
    color: colors.headerColor,
    marginBottom: 24,
    textAlign: 'left',
    lineHeight: 36,
    fontWeight: '700',
    lineHeight: 40,
  },
  slogan: {
    fontSize: 20,
    lineHeight: 20,
    fontWeight: '500',
    color: colors.headerColor,
    marginLeft: 5,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 15,
    marginHorizontal: 30,
    backgroundColor: colors.signupButton,
    borderWidth: 3,
  },
  loginButton: {
    backgroundColor: colors.loginButton,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  header: {
    marginTop: 120,
    marginLeft: 50,
    marginBottom: 50,
  },
});