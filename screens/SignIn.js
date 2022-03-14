import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, View, Pressable, Dimensions, Modal } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { useNavigationState } from "@react-navigation/native";

import { useSelector, useDispatch } from "react-redux";
import { signIn } from "../redux/authenticateSlice";

import { showToast } from "../common/ui";
import { screenWidth, screenHeight } from "../common/values";
import TextField from "../components/TextField";

const SignIn = ({ navigation }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [signInOptions, setSignInOptions] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { isNewUser, authToken } = useSelector(state => state.authenticate);
  const fingerprint = useSelector(state => state.preferences.fingerprint);
  const navigationState = useNavigationState(state => state.routes);
  const dispatch = useDispatch();

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

  const onSignInPress = token => {
    dispatch(signIn({ ...credentials, ...token }))
      .unwrap()
      .then(originalPromiseResult => {
        if (originalPromiseResult.user) {
          navigation.replace("Landing");
        }
      })
      .catch(error => {
        showToast(error.message);
      });
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <View enabled style={styles.signInSheet}>
        <Text style={styles.formHeader}>Sign In </Text>

        <TextField
          placeholder="Username or Email"
          name={"username"}
          formData={credentials}
          setFormData={setCredentials}
        />
        <TextField
          placeholder="Password"
          name={"password"}
          formData={credentials}
          setFormData={setCredentials}
          secureTextEntry
        />
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#79d6fa" : "#00b4fc",
            },
            styles.signInButton,
          ]}
          onPress={() => onSignInPress()}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </Pressable>
        {!isNewUser && (
          <Text onPress={() => setShowOptions(true)} style={styles.signInOptions}>
            Sign In options.
          </Text>
        )}
      </View>
      <Modal
        animationType="fade"
        visible={showOptions}
        onRequestClose={() => {
          setShowOptions(!showOptions);
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
              onPress={_ => {
                navigation.navigate("SignUp");
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
              onPress={_ => {
                setShowOptions(false);
                navigation.replace("Landing");
              }}
            >
              <Text style={styles.signInButtonText}>Browse Listings</Text>
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
    paddingVertical: 12,
    width: "60%",
    borderRadius: 4,
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
});

export default SignIn;
