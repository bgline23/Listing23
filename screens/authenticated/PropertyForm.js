import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "@env";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigationState } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";

import ScreenTitle from "../../components/ScreenTitle";
import PropertyMap from "../../components/PropertyMap";
import { ThemeContext } from "../Theme";
import { showToast } from "../../common/ui";
import { screenWidth } from "../../common/values";
import { axiosAuthInstance } from "../../common/requests";
import TextField from "../../components/TextField";

const PropertyForm = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { user_id } = useSelector(state => state.authenticate.authUser);
  const [photos, setPhotos] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coords: "",
    price: "0",
    address: "",
    autoCreateListing: true,
    userId: user_id,
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
      const saveResult = await axiosAuthInstance.post(`/property/create`, formData);

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
      <ScreenTitle text="Add Property" />
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <View style={{ alignItems: "center" }}>
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
              style={styles.formatInput}
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
            <Text style={styles.formatInput}>
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
      <PropertyMap
        isVisible={modalVisible}
        setVisible={setModalVisible}
        onClose={onMapClose}
      />
    </SafeAreaView>
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

  formatInput: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#eee",
    width: screenWidth - 80,
    backgroundColor: "#ddd",
    padding: 12,
    marginVertical: 6,
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
