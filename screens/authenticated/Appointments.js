import React, { useContext } from "react";

import {
  Dimensions,
  StyleSheet,
  Switch,
  Text,
  View,
  ScrollView,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import { showToast } from "../../common/ui";
import AppointmentCard from "../../components/AppointmentCard";
import ScreenTitle from "../../components/ScreenTitle";
import { ThemeContext } from "../Theme";

import { screenWidth } from "./../../common/values";

const data = [
  {
    id: 1,
    appointmentDate: new Date(),
    status: "accepted",
    listing: 123,
    propertyTitle: "5 Bedroom Luxury",
    buyerName: "Bruce Wayne",
  },
  {
    id: 2,
    appointmentDate: new Date(),
    status: "postponed",
    listing: 123,
    propertyTitle: "6 Room Mansion",
    buyerName: "Peter Parker",
  },
  {
    id: 3,
    appointmentDate: new Date(),
    status: "pending",
    listing: 123,
    propertyTitle: "Modern Studio Aparment",
    buyerName: "Clark Kent",
  },
];

const Appointments = () => {
  const { colors } = useContext(ThemeContext);
  const dispatch = useDispatch();

  const authUser = useSelector(state => state.authenticate.authUser);

  return (
    <SafeAreaView style={styles.safeView}>
      <ScreenTitle text="Appointments" />
      <FlatList
        style={{ width: screenWidth, paddingHorizontal: 10 }}
        ItemSeparatorComponent={ListItemSeparator}
        contentContainerStyle={styles.contentContainer}
        data={data}
        renderItem={({ item }) => (
          // TODO: Correct the user type
          <AppointmentCard
            userType={authUser.userType || "agent"}
            data={item}
            onDecline={() => showToast("Appointment declined.", colors.RED)}
            onAccept={() => showToast("Appointment accepted.", colors.GREEN)}
            onPostpone={() => showToast("Appointment reschedule.", colors.WARNING)}
          />
        )}
        keyExtractor={item => item.id}
        extraData={1}
      />
    </SafeAreaView>
  );
};

const ListItemSeparator = () => {
  return <View style={styles.seperator} />;
};
const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#eee",
  },

  seperator: {
    marginVertical: 8,
  },

  contentContainer: {
    padding: 4,
  },
  itemText: {
    marginLeft: 10,
  },
});

export default Appointments;
