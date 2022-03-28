import { useEffect, useState, useContext } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import * as LocalAuthentication from "expo-local-authentication";

import { screenWidth } from "../../common/values";
import { showToast } from "../../common/ui";
import ScreenTitle from "../../components/ScreenTitle";
import { setDeviceLocation, setFingerprint } from "../../redux/preferenceSlice";
import { ThemeContext } from "../Theme";
import IconButton from "../../components/IconButton";

const Preferences = () => {
  const deviceLocationPref = useSelector(state => state.preferences?.deviceLocation);
  const [hasBiometric, setHasBiometric] = useState(false);
  const dispatch = useDispatch();
  const { colors } = useContext(ThemeContext);
  const fingerprint = useSelector(state => Boolean(state.preferences.fingerprint));

  const location =
    (typeof deviceLocationPref === "object" && Boolean(deviceLocationPref?.coords)) ||
    deviceLocationPref.deviceLocation === true;

  useEffect(() => {
    getBiometricCapability();
  }, []);

  const onClearPreferences = second => {
    AsyncStorage.getAllKeys()
      .then(keys => AsyncStorage.multiRemove(keys))
      .then(() => showToast("Preferences cleared"));
  };

  const getBiometricCapability = async () => {
    const hasBiometricHardware = await LocalAuthentication.hasHardwareAsync();
    setHasBiometric(hasBiometricHardware);
  };

  const onFingerprintChange = async isEnabled => {
    const hasBiometricsEnabled = await LocalAuthentication.isEnrolledAsync();
    if (hasBiometricsEnabled) {
      dispatch(setFingerprint({ fingerprint: isEnabled }));
    } else {
      showToast("Please update fingerprint or face detection in settings.");
    }
  };

  const onDeviceLocationChange = async isEnabled => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (isEnabled && status === "granted") {
      const currentPosition = await Location.getCurrentPositionAsync({});
      dispatch(setDeviceLocation(currentPosition));
    }

    if (!isEnabled) {
      dispatch(setDeviceLocation(false));
    }

    if (isEnabled && status === "denied") {
      showToast("Please allow location permissions in device settings.");
    }
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <ScreenTitle text="Preferences" />
      <View style={styles.formContents}>
        {hasBiometric && (
          <View style={styles.preferenceCard}>
            <Text style={styles.itemText}>Biometric Sign In</Text>
            <CustomSwitch
              onValueChange={value => onFingerprintChange(value)}
              value={fingerprint}
            />
          </View>
        )}
        <View style={styles.preferenceCard}>
          <Text style={styles.itemText}>Device Location</Text>
          <CustomSwitch
            onValueChange={value => onDeviceLocationChange(value)}
            value={location}
          />
        </View>
        <View style={[styles.preferenceCard, { bottom: 0 }]}>
          <Text style={styles.itemText}>Clear Preferences</Text>
          <IconButton
            onPress={onClearPreferences}
            colors={{
              pressed: colors.RED,
              released: colors.THEME,
              icon: colors.SURFACE,
            }}
            iconName="trash-can-outline"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const CustomSwitch = props => {
  const { colors } = useContext(ThemeContext);
  return (
    <Switch
      trackColor={{ false: "#777777", true: colors.THEME }}
      thumbColor={props.value ? colors.ACCENT : "#f4f3f4"}
      ios_backgroundColor="#3e3e3e"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#eee",
  },
  formContents: {
    width: screenWidth - 20,
    alignItems: "flex-start",
  },
  preferenceCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 14,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 4,
    marginVertical: 6,
  },

  itemText: {
    color: "#444",
    marginLeft: 10,
  },
});

export default Preferences;
