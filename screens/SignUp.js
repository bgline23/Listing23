import React, { useContext, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenTitle from "../components/ScreenTitle";
import { screenWidth, screenHeight } from "../common/values";
import { ThemeContext } from "./Theme";
import TextField from "../components/TextField";

const SignUp = ({ route }) => {
  const userType = route.params?.userType;
  const { colors } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
    listingLocations: "",
    cellphone: "",
    telephone: "",
    agency: "",
  });

  return (
    <SafeAreaView style={styles.safeView}>
      <ScreenTitle text={"Sign Up"} />
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <TextField
          placeholder="Firstname"
          name={"Firstname"}
          formData={formData}
          setFormData={setFormData}
        />
        <TextField
          placeholder="Lastname"
          name={"lastname"}
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
        onPress={() => onSavePress()}
      >
        <Text style={styles.saveButtonText}>Save</Text>
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
