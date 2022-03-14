import { useContext } from "react";
import { StyleSheet, Text, ImageBackground, Pressable } from "react-native";
import { screenHeight, screenWidth } from "../common/values";
import { ThemeContext } from "../screens/Theme";

const PropertyCard = ({ onPress, data }) => {
  const { colors } = useContext(ThemeContext);
  return (
    <Pressable style={styles.cardContainer} onPress={onPress}>
      <ImageBackground
        style={{ width: "100%", height: "100%", borderRadius: 8 }}
        sizeMode="cover"
        imageStyle={{ borderRadius: 8 }}
        source={{ uri: `data:image/jpeg;base64,${data.base64}` }}
      >
        <Text
          style={{
            color: colors.SURFACE,
            fontSize: 18,
            backgroundColor: colors.THEME,
            opacity: 0.8,
            borderTopLeftRadius: 8,
            borderBottomRightRadius: 8,
            paddingHorizontal: 4,
            alignSelf: "flex-start",
          }}
        >
          R {data.price}
        </Text>
      </ImageBackground>
    </Pressable>
  );
};

export default PropertyCard;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 8,
    width: screenWidth - 20,
    height: screenHeight * 0.25,
  },
});
