import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

const PropertyInfo = () => {
  return (
    <SafeAreaView style={styles.safeView}>
      <Text
        style={{
          fontSize: 16,
          color: "#6761A8",

          marginBottom: 10,
          fontWeight: "bold",
        }}
      >
        &#8226; Property Info &#8226;
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#eee",
  },
});

export default PropertyInfo;
