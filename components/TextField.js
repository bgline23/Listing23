import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { screenWidth } from "../common/values";

const TextField = ({ name, formData, setFormData, ...props }) => {
  const [focus, setFocus] = useState(false);
  return (
    <TextInput
      style={[
        styles.textInput,
        focus == name ? { borderWidth: 2, borderColor: "#00b4fc" } : {},
        props.fieldStyle,
      ]}
      clearButtonMode="while-editing"
      onChangeText={value => setFormData({ ...formData, [name]: value })}
      value={formData[name]}
      onFocus={() => setFocus(name)}
      onBlur={() => setFocus(false)}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: screenWidth - 20,
    margin: 8,
    padding: 12,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderColor: "#eee",
  },
});

export default TextField;
