import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, View, Pressable, Modal } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { useNavigationState } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useSelector, useDispatch } from "react-redux";
import { signIn } from "../redux/authenticateSlice";

import { showToast } from "../common/ui";
import { screenWidth, screenHeight } from "../common/values";
import TextField from "../components/TextField";
import { ThemeContext } from "./Theme";
import Loader from "../components/Loader";

const SignIn = ({ navigation }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [optionsModal, setOptionsModal] = useState(false);
  const { authToken } = useSelector(state => state.authenticate);
  const fingerprint = useSelector(state => state.preferences.fingerprint);
  const navigationState = useNavigationState(state => state.routes);
  const dispatch = useDispatch();
  const { colors } = useContext(ThemeContext);

  useEffect(() => {
    const isSigningOut = navigationState.some(route => route.params?.isSigningOut);

    //  Check redux store for  {"fingerprint": false}
    if (fingerprint?.fingerprint && !isSigningOut) {
      signInWithBiometric();
    }
  }, []);

  const signInWithBiometric = async () => {
    const biometricResult = await LocalAuthentication.authenticateAsync();

    if (biometricResult.success) {
      onSignInPress(authToken);
    }
  };

  const onSignInPress = (token = null) => {
    dispatch(signIn({ ...credentials, ...token }))
      .unwrap()
      .then(thunkResult => {
        if (thunkResult.user.username) {
          navigation.replace("Landing");
        }
      })
      .catch(error => {
        showToast(error.message);
      });
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.signInSheet}>
        <Text style={styles.formHeader}>Sign In </Text>

        <TextField
          placeholder="Username or Email"
          name={"username"}
          formData={credentials}
          setFormData={setCredentials}
          fieldStyle={styles.fieldWidth}
        />
        <TextField
          placeholder="Password"
          name={"password"}
          formData={credentials}
          setFormData={setCredentials}
          secureTextEntry
          fieldStyle={styles.fieldWidth}
        />
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#79d6fa" : "#00b4fc",
            },
            styles.signInButton,
            styles.fieldWidth,
          ]}
          onPress={() => onSignInPress()}
        >
          <Loader color={colors.SURFACE}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </Loader>
        </Pressable>

        <Text onPress={() => setOptionsModal(true)} style={styles.signInOptions}>
          Sign In options.
        </Text>
      </View>

      <Modal
        animationType="fade"
        visible={optionsModal}
        onRequestClose={() => {
          setOptionsModal(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* - - - - -  modal content - - - - - */}

            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "#9A96C5" : "#6761A8",
                },
                styles.signInButton,
              ]}
              onPress={() => {
                setOptionsModal(false);
                navigation.navigate("SignUp", { userType: "agent" });
              }}
            >
              <Text style={styles.signInButtonText}>New Agent Account</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "#9A96C5" : "#6761A8",
                },
                styles.signInButton,
              ]}
              onPress={() => {
                setOptionsModal(false);
                navigation.navigate("SignUp", { userType: "buyer" });
              }}
            >
              <Text style={styles.signInButtonText}>New Buyer Account</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "#9A96C5" : "#6761A8",
                },
                styles.signInButton,
              ]}
              onPress={() => {
                setOptionsModal(false);
                navigation.replace("Landing");
              }}
            >
              <Text style={styles.signInButtonText}>Browse Listings</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? colors?.pressed || colors.ACCENT
                    : colors?.released || colors.THEME,
                },

                styles.buttonCancel,
              ]}
              onPress={() => setOptionsModal(false)}
            >
              <MaterialCommunityIcons name="close" size={18} color="white" />
            </Pressable>
            {/* - - - - -  end  modal content - - - - -  */}
          </View>
        </View>
      </Modal>
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

  formHeader: { marginBottom: 20, fontSize: 24, color: "#6761A8" },
  signInSheet: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    width: screenWidth - 20,
    backgroundColor: "#fff",
    elevation: 4,
    paddingVertical: 20,
  },
  fieldWidth: {
    width: screenWidth * 0.6,
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

  signInButton: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    // paddingVertical: 12,
    width: "60%",
    borderRadius: 4,
    height: 40,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
    color: "white",
  },
  signInOptions: {
    color: "#6761A8",
  },
  buttonCancel: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 4,
  },
});

export default SignIn;
