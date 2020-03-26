import React, { useContext } from "react";
import { Text, View } from "react-native";
import { globalStyles } from "../styles/global";
import { UserContext } from "../contexts/UserContext";

export default function Home() {
  const { currentUserId } = useContext(UserContext);

  // console.log(currentUserId.restaurantManager);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.motto}>Your Virtual Waytr</Text>
      <Text style={globalStyles.titleText}>
        The easier way to order from your favourite restaurants
      </Text>
    </View>
  );
}
