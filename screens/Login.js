import React, { useState } from 'react';
import PressableButton from "../components/PressableButton";
import InputField from '../components/InputField';
import { colors } from "../styles/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getContainerStyles } from "../components/SafeArea";
import { View, Text, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseSetup";
import { commonStyles } from "../styles/CommonStyles";

export default function Login({ navigation }) {
  const insets = useSafeAreaInsets();
  const container = getContainerStyles(insets);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(){
    if (!email) {
      Alert.alert("Email should not be empty");
      return;
    }
    if (!password) {
      Alert.alert("Password should not be empty");
      return;
    }
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCred);
    } catch (err) {
      console.log(err);
      if (err.code === "auth/invalid-login-credentials") {
        Alert.alert("Failed to Login. Please check your email and password again");
      }
    }
  }

  function handleSignUp(){
    navigation.replace("Signup");
  }

  return (
    <View style={[styles.container, container, commonStyles.container]}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>
      {/* get user sign up information */}
      <View style={styles.form}>
        <View style={styles.input}> 
          <Text style={styles.inputLabel}>Email</Text>
          <InputField changedHandler={(email) => setEmail(email)} value={email}/>
        </View>
        <View style={styles.input}> 
          <Text style={styles.inputLabel}>Password</Text>
          <InputField 
            changedHandler={(password) => setPassword(password)} 
            value={password} 
            multiline={false}
            secureTextEntry={true}/>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <PressableButton
          defaultStyle={styles.button}
          pressedStyle={styles.pressed}
          onPressFunction={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </PressableButton>
        <View style={styles.description}>
          <Text>Don't have an account yet?{' '}</Text>
          <PressableButton
            pressedStyle={styles.pressed}
            onPressFunction={handleSignUp}
          >
            <Text style={styles.loginButton}>Sign Up</Text>
          </PressableButton>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  header: {
    marginVertical: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.headerColor,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.darkGary,
    marginLeft: 5,
  },
  form: {
    paddingHorizontal: 24,
  },
  input: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 5,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonContainer: {
    marginVertical: 45,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    backgroundColor: colors.deepGreen,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.white,
  },
  description: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    textDecorationLine: 'underline',
  },
});