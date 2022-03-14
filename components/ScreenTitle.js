import { Text } from "react-native";

const ScreenTitle = ({ text }) => {
  return (
    <Text
      style={{
        fontSize: 16,
        color: "#6761A8",

        marginBottom: 10,
        fontWeight: "bold",
        paddingHorizontal: 100,
      }}
    >
      &#8226; {text} &#8226;
    </Text>
  );
};

export default ScreenTitle;
