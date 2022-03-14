import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import Dashboard from "./authenticated/Dashboard";
import Appointments from "./authenticated/Appointments";
import PropertyForm from "./authenticated/PropertyForm";

import PropertyInfo from "./shared/PropertyInfo";
import PhotoGallery from "./shared/PhotoGallery";

import Home from "./Home";
import Preferences from "./shared/Preferences";
import SignUp from "./SignUp";
import SignIn from "./SignIn";

const HomeStackNav = createStackNavigator();

const HomeStack = () => {
  return (
    <HomeStackNav.Navigator
      screenOptions={{
        headerShown: false,
        initialRoute: "HomeScreen",
      }}
    >
      <HomeStackNav.Screen name="HomeScreen" component={Home} />
      <HomeStackNav.Screen name="PropertyInfo" component={PropertyInfo} />
    </HomeStackNav.Navigator>
  );
};

const DashboardStackNav = createStackNavigator();

const DashboardStack = () => {
  return (
    <DashboardStackNav.Navigator
      screenOptions={{
        headerShown: false,
        initialRoute: "DashboardScreen",
      }}
    >
      <DashboardStackNav.Screen name="DashboardScreen" component={Dashboard} />
      <DashboardStackNav.Screen name="Preferences" component={Preferences} />
      <DashboardStackNav.Screen name="PropertyForm" component={PropertyForm} />
      <DashboardStackNav.Group screenOptions={{ presentation: "modal" }}>
        <DashboardStackNav.Screen name="PhotoGallery" component={PhotoGallery} />
      </DashboardStackNav.Group>
    </DashboardStackNav.Navigator>
  );
};
const TabNav = createBottomTabNavigator();

const BottomTabStack = () => {
  const authUser = useSelector(state => state.authenticate.authUser);

  const createIcon = ({ focused, route, color }) => {
    let iconName;

    switch (route.name) {
      case "Dashboard":
        iconName = "briefcase-variant-outline";
        break;
      case "Home":
        iconName = "newspaper-variant-outline";
        break;
      case "SignIn":
        iconName = "account";
        break;
      case "Appointments":
        iconName = "clipboard-list-outline";
        break;
      case "Preferences":
        iconName = "cog-outline";
        break;
      default:
        break;
    }

    return <MaterialCommunityIcons name={iconName} size={24} color={color} />;
  };

  return (
    <TabNav.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "#6761A8",
          width: "95%",
          left: 10,
          borderRadius: 6,
          bottom: 8,
          elevaton: 4,
          paddingBottom: 4,
        },

        headerShown: false,
        tabBarIcon: ({ focused, color }) => createIcon({ focused, route, color }),
        tabBarActiveTintColor: "#00b4fc",
        tabBarInactiveTintColor: "#eee",
      })}
    >
      <TabNav.Screen
        options={{ unmountOnBlur: true }}
        name="Home"
        component={HomeStack}
      />
      {authUser && (
        <TabNav.Screen
          options={{ unmountOnBlur: true }}
          name="Dashboard"
          component={DashboardStack}
        />
      )}
      {authUser && (
        <TabNav.Screen
          options={{ unmountOnBlur: true }}
          name="Appointments"
          component={Appointments}
        />
      )}
      {!authUser && <TabNav.Screen name="SignIn" component={SignIn} />}
    </TabNav.Navigator>
  );
};

export { HomeStack, BottomTabStack };
