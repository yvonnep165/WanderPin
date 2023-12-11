import React, { useState } from 'react';
import PressableButton from "../components/PressableButton";
import InputField from '../components/InputField';
import { colors } from "../styles/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getContainerStyles } from "../components/SafeArea";
import { View, Text, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebaseSetup";
import { commonStyles } from "../styles/CommonStyles";

export default function Signup({ navigation }) {
  const insets = useSafeAreaInsets();
  const container = getContainerStyles(insets);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleLogin(){
    navigation.replace("Login");
  }

  async function handleSignUp(){
    // check input fields validation
    if (!username) {
      Alert.alert("Username should not be empty");
      return;
    }
    if (!email) {
      Alert.alert("Email should not be empty");
      return;
    }
    if (!password) {
      Alert.alert("Password should not be empty");
      return;
    }
    if (!confirmPassword) {
      Alert.alert("Confirm password should not be empty");
      return;
    }
    if (confirmPassword !== password) {
      Alert.alert("Password and Confirm Password don't match, please check");
      return;
    }
    // create user account with email and password
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Add the username to the user's data
      await updateProfile(userCred.user, { displayName: username });
      console.log(userCred);
    } catch (err) {
      console.log("sign up error ", err.code);
      if (err.code === "auth/invalid-email") {
        Alert.alert("Email is invalid");
      } else if (err.code === "auth/weak-password") {
        Alert.alert("Password should be minimum 6 characters");
      } else {
        Alert.alert(`Sign Up failed with error code ${err.code}. Please try again with different information`);
      }
    }
  }

  return (
    <View style={[styles.container, container, commonStyles.container]}>
      <View style={styles.header}>
        <Text style={styles.title}>Getting Started</Text>
        <Text style={styles.subtitle}>Create an account to continue</Text>
      </View>
      {/* get user sign up information */}
      <View style={styles.form}>
        <View style={styles.input}> 
          <Text style={styles.inputLabel}>Username</Text>
          <InputField changedHandler={(name) => setUsername(name)} value={username}/>
        </View>
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
        <View style={styles.input}> 
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <InputField 
            changedHandler={(password) => setConfirmPassword(password)} 
            value={confirmPassword} 
            multiline={false}
            secureTextEntry={true}/>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <PressableButton
          defaultStyle={styles.button}
          pressedStyle={styles.pressed}
          onPressFunction={handleSignUp}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </PressableButton>
        <View style={styles.description}>
          <Text>Already have an account?{' '}</Text>
          <PressableButton
            pressedStyle={styles.pressed}
            onPressFunction={handleLogin}
          >
            <Text style={styles.loginButton}>Login</Text>
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