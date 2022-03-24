import React, { useContext, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ScreenTitle from "../components/ScreenTitle";
import { ThemeContext } from "./Theme";
import TextField from "../components/TextField";
import { showToast } from "../common/ui";

import { useDispatch } from "react-redux";
import { registerUser } from "../redux/userRequest";

const SignUp = ({ route, navigation }) => {
  const userType = route.params?.userType;
  const { colors } = useContext(ThemeContext);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    cellphone: "",
    telephone: "",
    agency: "",
    userTypeId: userType == "agent" ? 1 : 2,
  });

  const onRegisterPress = () => {
    dispatch(registerUser(formData))
      .unwrap()
      .then(thunkResult => {
        if (thunkResult.username) {
          navigation.replace("SignIn");
          showToast("User registration successful.");
        }
      })
      .catch(error => {
        showToast(error.message, {
          backgroundColor: colors.WARNING,
          textColor: "black",
        });
      });
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <ScreenTitle text={"Sign Up"} />
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <TextField
          placeholder="Firstname"
          name={"firstName"}
          formData={formData}
          setFormData={setFormData}
        />
        <TextField
          placeholder="Lastname"
          name={"lastName"}
          formData={formData}
          setFormData={setFormData}
        />
        <TextField
          placeholder="Email Address"
          name={"email"}
          formData={formData}
          setFormData={setFormData}
        />
        <TextField
          placeholder="Cellphone"
          name={"cellphone"}
          formData={formData}
          setFormData={setFormData}
        />
        <TextField
          placeholder="Username"
          name={"username"}
          formData={formData}
          setFormData={setFormData}
        />
        <TextField
          placeholder="Password"
          name={"password"}
          formData={formData}
          setFormData={setFormData}
          secureTextEntry
        />
        {userType == "agent" && (
          <AgentFields formData={formData} setFormData={setFormData} />
        )}
      </ScrollView>
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? colors.ACCENT : colors.THEME,
          },
          styles.saveButton,
        ]}
        onPress={() => onRegisterPress()}
      >
        <Text style={styles.saveButtonText}>Register</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const AgentFields = ({ formData, setFormData }) => {
  return (
    <>
      <TextField
        placeholder="Agency Name"
        name={"agency"}
        formData={formData}
        setFormData={setFormData}
      />

      <TextField
        placeholder="Work Telephone"
        name={"telephone"}
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee",
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    paddingVertical: 12,
    width: 140,
    borderRadius: 4,
    marginBottom: 40,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
    color: "white",
  },
});

export default SignUp;
