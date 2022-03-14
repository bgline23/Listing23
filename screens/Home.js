import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Dimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "@env";

import PropertyCard from "../components/PropertyCard";
import ScreenTitle from "../components/ScreenTitle";

const Home = ({ navigation }) => {
  const authUser = useSelector(state => state.authenticate.authUser);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    getListings();
  }, []);

  const getListings = async () => {
    const listingResult = await axios.post(
      `${API_URL}/property/listings`,
      { userId: authUser?.user_id || -1 },
      {
        timeout: 5000,
      }
    );

    if (listingResult.data?.length) {
      setListings(listingResult.data);
    }
  };

  const [selectedId, setSelectedId] = useState(-1);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#eee",
        alignItems: "center",
      }}
    >
      <ScreenTitle text="Listings" />

      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={listings}
        renderItem={({ item }) => renderItem({ item, navigation })}
        keyExtractor={item => item.property_id}
        extraData={selectedId}
      />
    </SafeAreaView>
  );
};

const renderItem = ({ item, navigation }) => {
  return (
    <View style={{ alignItems: "center", marginVertical: 12 }}>
      <PropertyCard onPress={() => navigation.navigate("PropertyInfo")} data={item} />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    width: Dimensions.get("screen").width,
  },
});

export default Home;
