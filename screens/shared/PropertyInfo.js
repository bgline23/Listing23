import React, { useContext, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { screenHeight, screenWidth } from "../../common/values";
import ScreenTitle from "../../components/ScreenTitle";
import { ThemeContext } from "../Theme";

const PropertyInfo = () => {
  const { colors } = useContext(ThemeContext);
  const [images, setImages] = useState([{ id: 1 }, { id: 2 }, { id: 3 }]);

  const renderItem = item => {
    return (
      <Image
        style={{
          width: screenWidth * 0.8,
          height: screenHeight * 0.4,
          borderRadius: 8,
        }}
        sizeMode="stretch"
        imageStyle={{ borderRadius: 8 }}
        source={require("../../assets/property3.jpg")}
      />
    );
  };

  return (
    <SafeAreaView style={styles().safeView}>
      <ScreenTitle text=" Property Info" />
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        <View style={[styles().heroCard]}>
          <Text style={styles({ colors }).cardTitle}>4 Bedroom Apartment JHB</Text>
          <FlatList
            horizontal
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
            }}
            ItemSeparatorComponent={() => <View style={{ marginHorizontal: 2 }}></View>}
            data={images}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={item => item.id}
            extraData={1}
          />
          <Text style={styles({ colors }).cardText}>
            venenatis a condimentum vitae sapien pellentesque habitant morbi tristique
            senectus et netus et malesuada fames ac turpis egestas sed tempus
          </Text>
        </View>
        <View style={styles({ colors }).infoCard}>
          <Text style={styles({ colors }).cardTitle}>Info</Text>
          <Text style={styles({ colors }).cardText}>
            venenatis a condimentum vitae sapien pellentesque habitant morbi tristique
            senectus et netus et malesuada fames ac turpis egestas sed tempus
          </Text>
          <Text style={styles({ colors }).cardText}>
            venenatis a condimentum vitae sapien pellentesque habitant morbi tristique
            senectus et netus et malesuada fames ac turpis egestas sed tempus
          </Text>
        </View>
        <View style={styles({ colors }).infoCard}>
          <Text style={styles({ colors }).cardTitle}>Location</Text>
          <Text style={styles({ colors }).cardText}>
            venenatis a condimentum vitae sapien pellentesque habitant morbi tristique
            senectus et netus et malesuada fames ac turpis egestas sed tempus
          </Text>
          <Text style={styles({ colors }).cardText}>
            venenatis a condimentum vitae sapien pellentesque habitant morbi tristique
            senectus et netus et malesuada fames ac turpis egestas sed tempus
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = (styleOption = { colors: {} }) => {
  return StyleSheet.create({
    safeView: {
      flex: 1,
      alignItems: "center",
      paddingBottom: 20,
    },
    heroCard: {
      padding: 9,
      width: screenWidth - 20,
      height: screenHeight * 0.6,
      backgroundColor: "#fff",
      borderRadius: 9,
      elevation: 4,
    },

    infoCard: {
      paddingHorizontal: 12,
      paddingVertical: 12,
      width: screenWidth - 20,
      backgroundColor: "#fff",
      borderRadius: 9,
      marginVertical: 12,
      elevation: 4,
      margin: 6,
    },
    cardTitle: {
      color: styleOption.colors?.THEME,
      fontSize: 18,
    },
    cardText: {
      color: styleOption.colors?.GREY,
    },
  });
};
export default PropertyInfo;
