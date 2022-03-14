import { Pressable, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { ThemeContext } from "../screens/Theme";

const AppointmentCard = ({ data, userType, ...props }) => {
  return (
    <TouchableHighlight style={styles.cardContainer}>
      <>
        <View style={styles.cardInfo}>
          <Text style={styles.cardText}>
            {data?.appointmentDate?.toLocaleDateString()} - {data.status}
          </Text>
          <Text style={styles.cardText}>{data?.propertyTitle}</Text>

          {userType == "buyer" && <Text style={styles.cardText}>{data?.agentName}</Text>}
          {userType == "agent" && <Text style={styles.cardText}>{data?.buyerName}</Text>}
        </View>
        <View style={styles.cardActions}>
          <CardActionSelector
            userType={userType}
            appointmentStatus={data?.status}
            {...props}
          />
        </View>
      </>
    </TouchableHighlight>
  );
};

const CardActionSelector = ({ userType, appointmentStatus, ...props }) => {
  const { colors } = useContext(ThemeContext);
  const Decline = (
    <CardAction
      iconName="trash-can-outline"
      colors={{ released: colors.THEME, pressed: colors.RED, icon: colors.SURFACE }}
      onLongPress={props.onDecline}
    />
  );

  const Accept = (
    <CardAction
      iconName="check"
      colors={{ released: colors.THEME, pressed: colors.GREEN, icon: colors.SURFACE }}
      onLongPress={props.onAccept}
    />
  );

  const Postpone = (
    <CardAction
      iconName="calendar-clock"
      colors={{ released: colors.THEME, pressed: colors.WARNING, icon: colors.SURFACE }}
      onLongPress={props.onPostpone}
    />
  );

  let Actions = null;

  if (userType == "agent") {
    switch (appointmentStatus) {
      case "pending":
        Actions = (
          <View>
            {Decline}
            {Accept}
          </View>
        );
        break;
      case "postponed":
        Actions = (
          <View>
            {Decline}
            {Accept}
          </View>
        );
        break;
      case "accepted":
        Actions = <View>{Postpone}</View>;
        break;
      default:
        Actions = <></>;
        break;
    }
  }
  return Actions;
};

const CardAction = ({ iconName, colors, ...props }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed
            ? colors?.pressed || "green"
            : colors?.released || "grey",
        },
        styles.actionButton,
      ]}
      {...props}
    >
      <MaterialCommunityIcons name={iconName} size={32} color={colors?.icon || "black"} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 18,
    height: 120,
    elevation: 4,
  },
  cardInfo: {
    width: "80%",
    paddingLeft: 20,
    justifyContent: "space-evenly",
  },

  cardActions: {
    width: "20%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  actionButton: {
    borderRadius: 6,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  cardText: {
    color: "black",
  },
});

export default AppointmentCard;
