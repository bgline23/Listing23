import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import "react-native-gesture-handler";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";

//  redux
import store from "./redux/store";
import { Provider, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import authenticateSlice, { getUserState } from "./redux/authenticateSlice";
import {
  getDeviceLocation,
  getFingerprint,
  setDeviceLocation,
} from "./redux/preferenceSlice";

//  stack navigators
import { BottomTabStack } from "./screens/Stacks";
import { createStackNavigator } from "@react-navigation/stack";

import SignIn from "./screens/SignIn";
import { ThemeContextProvider } from "./screens/Theme";
import SignUp from "./screens/SignUp";

const RootNav = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Provider store={store}>
      <AsyncStoreReader setIsLoggedIn={setIsLoggedIn} />
      <SafeAreaProvider>
        <ThemeContextProvider>
          <NavigationContainer>
            <RootNav.Navigator
              screenOptions={{
                headerShown: false,
              }}
              initialRouteName={isLoggedIn ? "Landing" : "SignIn"}
            >
              <RootNav.Screen name="SignIn" component={SignIn} />

              <RootNav.Group screenOptions={{ presentation: "modal" }}>
                <RootNav.Screen
                  // options={{ unmountOnBlur: true }}
                  name="SignUp"
                  component={SignUp}
                />
              </RootNav.Group>

              <RootNav.Screen name="Landing" component={BottomTabStack} />
            </RootNav.Navigator>
          </NavigationContainer>
        </ThemeContextProvider>
      </SafeAreaProvider>
    </Provider>
  );
};

const AsyncStoreReader = ({ setIsLoggedIn }) => {
  const dispatch = useDispatch();
  const deviceLocationPref = useSelector(state => state.preferences?.deviceLocation);

  useEffect(() => {
    //  Restore the user state if component tree is unmounted
    dispatch(getUserState())
      .unwrap()
      .then(state => {
        setIsLoggedIn(Boolean(state.currentUser));
      });

    dispatch(getFingerprint());
    dispatch(getDeviceLocation())
      .unwrap()
      .then(value => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();

          const isFirstTimeRequest = status === "granted" && value == null;
          const isReenabled =
            status === "granted" && value?.deviceLocation === "denied" && value == null;

          if (isFirstTimeRequest || isReenabled) {
            const currentPosition = await Location.getCurrentPositionAsync({});
            dispatch(setDeviceLocation(currentPosition));

            // return currentPosition;
          }

          if (status == "denied") {
            dispatch(setDeviceLocation({ deviceLocation: status }));
            //return { deviceLocation: false };
          }
        })();
      });
  }, []);

  return <></>;
};

export default App;
