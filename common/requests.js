import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const config = {
  baseURL: API_URL,
  timeout: 6000,
};

const axiosInstance = axios.create(config);

//  create the authorized request object
const axiosAuthInstance = axios.create(config);

(async () => {
  const storeItem = await AsyncStorage.getItem("authToken");

  if (storeItem) {
    const { token } = JSON.parse(storeItem);
    axiosAuthInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
})();

export { axiosInstance, axiosAuthInstance };
