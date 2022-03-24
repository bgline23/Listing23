import Toast from "react-native-root-toast";
import { screenHeight } from "./values";

const showToast = (message, options = {}) => {
  Toast.show(message, {
    duration: Toast.durations.LONG,
    position: -screenHeight * 0.2,
    shadow: true,
    animation: true,
    hideOnPress: false,
    delay: 0,
    opacity: 1,
    ...options,
  });
};

export { showToast };
