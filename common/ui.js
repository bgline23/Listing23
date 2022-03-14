import Toast from "react-native-root-toast";
import { screenHeight } from "./values";

const showToast = (message, color = "black") => {
  Toast.show(message, {
    duration: Toast.durations.LONG,
    position: -screenHeight * 0.1,
    shadow: true,
    animation: true,
    hideOnPress: false,
    delay: 0,
    backgroundColor: color,
  });
};

export { showToast };
