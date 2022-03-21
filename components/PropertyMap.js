import React, { useContext, useState } from "react";
import { Modal, StyleSheet, Pressable, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { ThemeContext } from "../screens/Theme";
import { screenWidth, screenHeight } from "../common/values";

const PropertyMap = ({ isVisible, setVisible, onClose = () => {} }) => {
  const deviceLocation = useSelector(state => state.preferences?.deviceLocation);
  const [propertyLocation, setPropertyLocation] = useState({
    latitude: deviceLocation?.coords?.latitude || -26.1089662,
    longitude: deviceLocation?.coords?.longitude || 27.9970447,
  });

  const { colors } = useContext(ThemeContext);

  const onMapPress = e => {
    setPropertyLocation(e.nativeEvent.coordinate);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onMapLoaded={() => {}}
      onRequestClose={() => {
        setVisible(!isVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* - - - - -  modal content - - - - - */}
          <MapView
            style={{ width: "90%", height: "90%" }}
            onPress={onMapPress}
            showsMyLocationButton
            initialRegion={{
              latitude: propertyLocation.latitude,
              longitude: propertyLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            rotateEnabled={false}
          >
            <Marker
              key={1}
              draggable
              tappable
              coordinate={propertyLocation}
              title={"This location"}
              description={"Property"}
              onDragEnd={e => {
                setPropertyLocation({ ...e.nativeEvent.coordinate });
              }}
            />
          </MapView>
          <View style={styles.mapButtonsBottom}>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? colors?.pressed || colors.RED
                    : colors?.released || colors.THEME,
                },
                styles.button,
                styles.buttonCancel,
              ]}
              onPress={() => {
                onClose(false);
                setVisible(!isVisible);
              }}
            >
              <MaterialCommunityIcons name="close" size={18} color="white" />
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? colors?.pressed || colors.GREEN
                    : colors?.released || colors.THEME,
                },
                styles.button,
                styles.buttonCancel,
              ]}
              onPress={() => {
                onClose(propertyLocation);
                setVisible(!isVisible);
              }}
            >
              <MaterialCommunityIcons name="check" size={18} color="white" />
            </Pressable>
          </View>

          {/* - - - - -  end  modal content - - - - -  */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    height: screenHeight * 0.74,
    width: screenWidth - 20,
    margin: 20,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 4,
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  mapButtonsBottom: { flexDirection: "row" },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default PropertyMap;
