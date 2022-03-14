import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";

const TextField = ({ name, formData, setFormData, ...props }) => {
  const [focus, setFocus] = useState(false);
  return (
    <TextInput
      style={[
        styles.textInput,
        focus == name ? { borderWidth: 2, borderColor: "#00b4fc" } : {},
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
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#eee",
    padding: 12,
    width: "60%",
    margin: 8,
  },
});

export default TextField;
