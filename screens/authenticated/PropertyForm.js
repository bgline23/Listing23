import React, { useContext, useEffect, useState } from "react";
import { API_URL } from "@env";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Button,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";

import ScreenTitle from "../../components/ScreenTitle";
import PropertyMap from "../../components/PropertyMap";
import { ThemeContext } from "../Theme";
import Toast from "react-native-root-toast";
import { useNavigationState } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { showToast } from "../../common/ui";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const PropertyForm = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { user_id, authToken } = useSelector(state => state.authenticate.authUser);
  const [photos, setPhotos] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coords: "",
    price: "0",
    address: "",
    autoCreateListing: true,
    // userId: authUser?.userId,
  });

  const { colors } = useContext(ThemeContext);
  const navigationState = useNavigationState(state => state);

  useEffect(() => {
    const newPhoto = navigationState.routes.find(route => route.params != null);
    if (newPhoto) {
      setPhotos([...photos, newPhoto]);
    }
  }, [navigationState]);

  const onMapClose = coords => {
    if (coords) {
      setFormData({
        ...formData,
        coords: `${coords.latitude}, ${coords.longitude}`,
      });
    }
  };
  const onPhotoPress = () => {
    navigation.navigate("PhotoGallery");
  };

  const onSavePress = async () => {
    try {
      const saveResult = await axios.post(
        `${API_URL}/property/create`,
        { ...formData, userId: user_id },
        {
          timeout: 5000,
          headers: { Authorization: "Bearer " + authToken },
        }
      );

      if (saveResult.data.success) {
        if (photos.length) {
          const promises = photos.map(async photo => {
            const base64Promise = FileSystem.readAsStringAsync(photo.params.imageUri, {
              encoding: "base64",
            });

            return base64Promise;
          });

          const base64Photos = await Promise.all(promises);

          const uploadResult = await axios.post(
            `${API_URL}/property/image/save_image`,
            { propertyId: saveResult.data.propertyId, photos: base64Photos },
            {
              timeout: 5000,
            }
          );

          if (!uploadResult.data.success) {
            throw new Error("Image upload incomplete");
          }
        }

        showToast("Property saved.", colors.GREEN);
      }
    } catch (error) {
      showToast(error.message, colors.RED);
    }
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.formContents} contentContainerStyle={{ alignItems: "center" }}>
        <View style={{ alignItems: "center" }}>
          <ScreenTitle text="Add Property" />
          <TextField
            placeholder="Title"
            name={"title"}
            formData={formData}
            setFormData={setFormData}
          />

          <TextField
            placeholder="Description"
            name={"description"}
            formData={formData}
            setFormData={setFormData}
          />
          <TextField
            placeholder="Price"
            name={"price"}
            formData={formData}
            setFormData={setFormData}
          />

          <TextField
            placeholder="Address"
            name={"address"}
            formData={formData}
            setFormData={setFormData}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: screenWidth - 20,
              marginVertical: 8,
            }}
          >
            <TextField
              placeholder="GPS Coordinates"
              name={"coords"}
              formData={formData}
              setFormData={setFormData}
              editable={false}
              style={{
                ...styles.textInput,
                width: screenWidth - 80,
                backgroundColor: "#ddd",
              }}
            />

            <PropertyActionButton
              label="Mark Location"
              iconName="map-marker-radius-outline"
              onPress={() => setModalVisible(true)}
              colors={{
                pressed: colors.ACCENT,
                released: colors.THEME,
                icon: colors.SURFACE,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: screenWidth - 20,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                ...styles.textInput,
                alignItems: "center",
                width: screenWidth - 80,
                backgroundColor: "#ddd",
                padding: 16,
              }}
            >
              {photos.length
                ? `${photos.length} photo${photos.length > 1 ? "s" : ""} added.`
                : "Add Photos"}
            </Text>
            <PropertyActionButton
              iconName="camera-outline"
              onPress={onPhotoPress}
              colors={{
                pressed: colors.ACCENT,
                released: colors.THEME,
                icon: colors.SURFACE,
              }}
            />
          </View>
          <Text style={styles.itemText}>Automatically create a listing?</Text>
          <Switch
            trackColor={{ false: "#777777", true: "#6761A8" }}
            thumbColor={formData.autoCreateListing ? "#00b4fc" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={value =>
              setFormData({ ...formData, autoCreateListing: value })
            }
            value={formData.autoCreateListing}
          />
        </View>

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
      </View>
      <PropertyMap
        isVisible={modalVisible}
        setVisible={setModalVisible}
        onClose={onMapClose}
      />
    </SafeAreaView>
  );
};

const TextField = ({ name, formData, setFormData, ...props }) => {
  const [focus, setFocus] = useState(false);
  return (
    <TextInput
      style={[
        styles.textInput,
        focus == name ? { borderWidth: 2, borderColor: "#00b4fc" } : {},
      ]}
      clearButtonMode="while-editing"
      onChangeText={value => setFormData({ ...formData, [name]: value })}
      value={formData[name]}
      onFocus={() => setFocus(name)}
      onBlur={() => setFocus(false)}
      {...props}
    />
  );
};

const PropertyActionButton = ({ label, onPress, colors, iconName }) => {
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? colors?.pressed || "black"
              : colors?.released || "grey",
          },
          styles.dashButton,
        ]}
        onPress={() => onPress()}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={32}
          color={colors?.icon || "black"}
        />
      </Pressable>
    </View>
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
    flex: 1,
    // height: "100%",
    justifyContent: "space-between",
    alignItems: "center",

    width: screenWidth - 20,
  },
  textInput: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#eee",
    padding: 12,
    width: screenWidth - 20,
    marginVertical: 8,
  },
  mapButton: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    paddingVertical: 12,
    width: "60%",
    borderRadius: 4,
  },
  mapButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
    color: "white",
  },

  // ---
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  dashButton: {
    borderRadius: 8,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  dashButtonText: {
    fontSize: 12,
    marginVertical: 2,
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

export default PropertyForm;
