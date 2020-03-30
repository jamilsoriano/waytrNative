import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { globalStyles } from "../../styles/global";
import { SeatingContext } from "../../contexts/SeatingContext";
import { useHeaderHeight } from "@react-navigation/stack";

export default function TableConfirmation({ navigation, route }) {
  const headerHeight = useHeaderHeight();
  const {
    tableNum,
    setTableNum,
    setRestUID,
    setRestName,
    restName
  } = useContext(SeatingContext);
  setRestName(route.params.restName);
  setRestUID(route.params.restUID);
  const restTableMax = route.params.restTableMax;
  const restTableMin = route.params.restTableMin;
  const defaultMessage =
    "Please note that once seated, you will be unable to join another table until the order is completed.";
  const [subText, setSubText] = useState({
    message: defaultMessage,
    err: false
  });

  function confirmTable() {
    if (tableNum >= restTableMin && tableNum <= restTableMax) {
      navigation.navigate("Seated");
    } else {
      setSubText({
        message: `${restName} table numbers range from ${restTableMin} to ${restTableMax} - please enter a valid table number.`,
        err: true
      });
    }
  }

  return (
    <View style={{ marginHorizontal: 15, marginTop: headerHeight + 15 }}>
      <TextInput
        style={globalStyles.logInInput}
        keyboardType="numeric"
        placeholder="Table Number"
        onChangeText={value => {
          setSubText({ message: defaultMessage, err: false });
          setTableNum(value);
        }}
      />
      <Text style={subText.err ? globalStyles.errMessage : globalStyles.center}>
        {subText.message}
      </Text>

      <TouchableOpacity
        onPress={confirmTable}
        style={{ ...globalStyles.logInButton, marginTop: 50 }}
      >
        <Text style={globalStyles.buttonText}>Let's eat!</Text>
      </TouchableOpacity>
    </View>
  );
}
