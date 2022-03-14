import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const IconButton = ({ label, onPress = () => {}, colors, iconName, ...props }) => {
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
      {label && <Text style={styles.buttonLabel}>{label || "Label"}</Text>}
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
  buttonLabel: {
    fontSize: 12,
    marginVertical: 2,
  },
});

export default IconButton;
