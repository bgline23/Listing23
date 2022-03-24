import { useContext, useEffect } from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import ScreenTitle from "../../components/ScreenTitle";
import { signOut } from "../../redux/authenticateSlice";
import { ThemeContext } from "../Theme";

const Avatar = require("../../assets/profile.png");

import { screenWidth, screenHeight } from "../../common/values";
import IconButton from "../../components/IconButton";

const Dashboard = ({ navigation }) => {
  const fingerprint = useSelector(state => state.preferences.fingerprint);
  const user = useSelector(state => state.authenticate.authUser);

  const dispatch = useDispatch();
  const { colors } = useContext(ThemeContext);

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
                backgroundColor: colors.THEME,
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
          <IconButton
            label="Add Property"
            onPress={() => {
              navigation.navigate("PropertyForm");
            }}
            iconName={"home-plus-outline"}
          />
          <IconButton
            label="Update Listing"
            onPress={() => {}}
            iconName={"newspaper-plus"}
          />
          <IconButton
            label="Sign Out"
            onPress={() => onSignOutPress()}
            iconName={"logout-variant"}
          />
        </View>
        <View style={styles.gridRow}>
          <IconButton
            label="Preferences"
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

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#eee",
  },
  banner: {
    width: screenWidth,
    height: screenHeight * 0.4,
    alignItems: "center",
    marginBottom: 10,
    padding: 8,
    justifyContent: "space-evenly",
  },

  gridRow: {
    marginVertical: 4,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  buttonGrid: {
    width: screenWidth - 20,
    height: screenHeight * 0.4,
    backgroundColor: "#fff",
    borderRadius: 18,

    paddingVertical: 18,
    elevation: 4,
  },
});
export default Dashboard;
