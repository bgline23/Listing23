import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import ScreenTitle from "../../components/ScreenTitle";
import { ThemeContext } from "../Theme";
import IconButton from "../../components/IconButton";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const PhotoGallery = ({ navigation }) => {
  const [images, setImages] = useState([]);
  const { colors } = useContext(ThemeContext);

  const onAddPhotoPress = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      showToast("Permission to access camera roll is required!", colors.WARNING);
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaType: "photo",
      // base64: true,
    });

    if (pickerResult.cancelled === false) {
      const newImage = { imageUri: pickerResult.uri };
      setImages([...images, newImage]);
      navigation.setParams(newImage);
    }
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <ScreenTitle text="Photo Gallery" />
      <FlatList
        style={{ height: screenHeight, width: screenWidth }}
        contentContainerStyle={{ backgroundColor: colors.SURFACE }}
        columnWrapperStyle={{ justifyContent: "flex-start" }}
        data={images}
        numColumns={2}
        renderItem={({ item }) => {
          return <PhotoCard photo={item} />;
        }}
        keyExtractor={item => item.id}
      />
      <View
        style={{
          width: screenWidth,
          flexDirection: "row",
          marginVertical: 12,
          justifyContent: "space-evenly",
        }}
      >
        <IconButton
          colors={{
            released: colors.THEME,
            pressed: colors.ACCENT,
            icon: colors.SURFACE,
          }}
          iconName="file-image-outline"
          onPress={onAddPhotoPress}
        />
        <IconButton
          colors={{
            released: colors.THEME,
            pressed: colors.ACCENT,
            icon: colors.SURFACE,
          }}
          iconName="camera-plus-outline"
          onPress={onAddPhotoPress}
        />
      </View>
    </SafeAreaView>
  );
};

const PhotoCard = ({ photo }) => {
  return (
    <View style={styles.photoCard}>
      <Image style={styles.photo} resizeMode="cover" source={{ uri: photo.imageUri }} />
    </View>
  );
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },

  photoCard: {
    height: screenHeight * 0.2,
    margin: 8,
    width: screenHeight * 0.25,
    elevation: 4,
  },
  photo: {
    height: screenHeight * 0.2,
    width: screenHeight * 0.25,
  },
});

export default PhotoGallery;
