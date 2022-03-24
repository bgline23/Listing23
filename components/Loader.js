import React, { useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSelector } from "react-redux";
import { ThemeContext } from "../screens/Theme";

const Loader = ({ children, centerScreen = true, color }) => {
  const { loading } = useSelector(state => state.authenticate);
  const { colors } = useContext(ThemeContext);

  return (
    <View
      style={
        centerScreen && {
          position: "absolute",
        }
      }
    >
      {loading ? (
        <ActivityIndicator color={color || colors.THEME} size="large" />
      ) : (
        children
      )}
      {!centerScreen && !loading && children}
    </View>
  );
};

export default Loader;
