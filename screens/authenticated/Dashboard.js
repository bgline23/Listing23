import {
  Button,
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";

import { useSelector, useDispatch } from "react-redux";
import ScreenTitle from "../../components/ScreenTitle";
import { signOut } from "../../redux/authenticateSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../Theme";
import { useContext } from "react";

const Avatar = require("../../assets/profile.png");

import { screenWidth, screenHeight } from "../../common/values";

const Dashboard = ({ navigation }) => {
  const fingerprint = useSelector(state => state.preferences.fingerprint);

  const dispatch = useDispatch();
  const { colors } = useContext(ThemeContext);

  const buttonColors = { pressed: colors.ACCENT, released: colors.THEME, icon: "white" };

  const onSignOutPress = async () => {
    //  Biometrics will use the same credentials

    const preserveToken = Boolean(fingerprint);
    await dispatch(signOut(preserveToken)).unwrap();

    //  Reset stack, set flag for sign out
    navigation.dispatch(() => {
      return CommonActions.reset({
        routes: [{ name: "SignIn", params: { isSigningOut: true } }],
      });
    });
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <ScreenTitle text="Dashboard" />
      <View style={styles.banner}>
        <TouchableOpacity
          style={{
            width: screenWidth * 0.25,
            height: screenWidth * 0.25,
            borderRadius: 200,
            backgroundColor: "white",
            elevation: 4,
          }}
        >
          <ImageBackground
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "flex-end",
            }}
            resizeMode="cover"
            source={Avatar}
          >
            <View
              style={{
                color: colors.SURFACE,
                // fontSize: 18,
                backgroundColor: colors.THEME,
                // opacity: 0.8,
                padding: 2,
                alignSelf: "center",
                borderRadius: 200,
              }}
            >
              <MaterialCommunityIcons name="pencil" size={24} color={colors.SURFACE} />
            </View>
          </ImageBackground>
        </TouchableOpacity>
        <Text>Scheduled appointments: 5</Text>
      </View>
      <View style={styles.buttonGrid}>
        <View style={styles.gridRow}>
          <DashboardButton
            label="Add Property"
            onPress={() => {
              navigation.navigate("PropertyForm");
            }}
            colors={buttonColors}
            iconName={"home-plus-outline"}
          />
          <DashboardButton
            label="Update Listing"
            colors={buttonColors}
            onPress={async () => {
              await AsyncStorage.removeItem("preferences");
              await AsyncStorage.removeItem("deviceLocation");
            }}
            iconName={"newspaper-plus"}
          />
          <DashboardButton
            label="Sign Out"
            colors={buttonColors}
            onPress={() => onSignOutPress()}
            iconName={"logout-variant"}
          />
        </View>
        <View style={styles.gridRow}>
          <DashboardButton
            label="Preferences"
            colors={buttonColors}
            onPress={() => {
              navigation.navigate("Preferences");
            }}
            iconName={"wrench-outline"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const DashboardButton = ({ label, onPress, colors, iconName }) => {
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? colors?.pressed || "green"
              : colors?.released || "grey",
          },
          styles.dashButton,
        ]}
        onPress={() => onPress()}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={32}
          color={colors.icon || "black"}
        />
      </Pressable>
      <Text style={styles.dashButtonText}>{label || "Label"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#eee",
  },
  banner: {
    width: screenWidth,
    height: screenHeight * 0.4,
    alignItems: "center",
    // backgroundColor: "#fff",
    marginBottom: 10,
    padding: 8,
    justifyContent: "space-evenly",
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  gridRow: {
    width: "100%",
    marginVertical: 4,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
  },
  buttonGrid: {
    // alignItems: "flex-start",
    width: screenWidth - 20,
    height: screenHeight * 0.4,
    backgroundColor: "#fff",
    borderRadius: 18,

    paddingVertical: 18,
    elevation: 4,
  },
  dashButton: {
    borderRadius: 8,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  dashButtonText: {
    fontSize: 12,
    marginVertical: 2,
  },
});
export default Dashboard;
