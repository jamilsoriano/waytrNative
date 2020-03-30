import React from "react";
import { Text, View } from "react-native";
import { globalStyles } from "../styles/global";

export default function Home() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.motto}>Your Virtual Waytr</Text>
      <Text style={globalStyles.titleText}>
        The easier way to order from your favourite restaurants
      </Text>
    </View>
  );
}
