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

//  custom message for axios request error
const interceptError =
  func =>
  async (...data) => {
    try {
      return await func(...data);
    } catch (e) {
      if (e.response) {
        //  server returned an error message
        throw new Error(e.response.data);
      }

      if (e.code) {
        throw new Error("Could not communicate with the server at: " + API_URL);
      }

      throw new Error("Could not process request");
    }
  };

export { axiosInstance, axiosAuthInstance, interceptError };
