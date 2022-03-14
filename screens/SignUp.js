import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenTitle from "../components/ScreenTitle";

import { screenWidth, screenHeight } from "../common/values";

const SignUp = ({ showSignUp, setShowSignUp }) => {
  return (
    <SafeAreaView style={styles.safeView}>
      <ScreenTitle text={"Sign Up"} />
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#9A96C5" : "#6761A8",
          },
          styles.signInButton,
        ]}
        onPress={_ => {
          //navigation.navigate("SignUp");
          setShowSignUp(true);
        }}
      >
        <Text style={styles.signInButtonText}>New Account</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#9A96C5" : "#6761A8",
          },
          styles.signInButton,
        ]}
        onPress={_ => {}}
      >
        <Text style={styles.signInButtonText}>Browse Listings</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee",
  },
  formContents: {
    width: screenWidth - 20,
  },
  modalView: {
    justifyContent: "center",
    height: screenHeight * 0.5,
    width: screenWidth - 20,
    top: "50%",
    marginHorizontal: 10,
    borderRadius: 18,
    paddingHorizontal: 4,
    paddingTop: 20,
    alignItems: "center",
    elevation: 5,
    shadowOffset: {
      width: 12,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: "#fff",
    borderColor: "#6761A8",
    borderWidth: 2,
  },
});

export default SignUp;
