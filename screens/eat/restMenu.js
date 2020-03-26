import React, { useState } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { globalStyles } from "../../styles/global";
import Firebase from "../../firebase/firebase";
import { ActivityIndicator, Divider } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";

export default function RestMenu({ navigation, route }) {
  const [menu, setMenu] = useState();
  const [isLoading, setIsLoading] = useState(true);
  let restUID = route.params.restUID;
  const restTableMax = route.params.restTableMax;
  const restTableMin = route.params.restTableMin;
  const restName = route.params.restName;

  Firebase.getRestaurantMenu(restUID)
    .then(response => {
      if (isLoading !== response.loading) {
        setIsLoading(response.loading);
      }
      if (!response.loading && !menu) {
        setMenu(response.menu);
      }
    })
    .catch(error => console.log(error));

  const goBack = () => {
    navigation.pop();
  };
  if (!isLoading && menu) {
    if (Object.keys(menu).length > 0) {
      return (
        <View style={{ flex: 1, marginTop: 80 }}>
          <Divider />
          <ScrollView>
            {menu.items.map((item, i) => (
              <View key={i} style={{ marginHorizontal: 25, marginVertical: 8 }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                    {menu.items[i]}
                  </Text>

                  <Text style={{ textAlign: "center" }}>${menu.prices[i]}</Text>
                </View>
                <Text style={{ fontFamily: "raleway-italic", marginRight: 50 }}>
                  {menu.descriptions[i]}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      );
    } else
      return (
        <View>
          <Text
            style={{
              ...globalStyles.titleText,
              marginTop: 50,
              marginHorizontal: 30
            }}
          >
            Restaurant menu was not found. Please try again later.
          </Text>
          <TouchableOpacity
            onPress={goBack}
            style={{ ...globalStyles.logInButton, marginHorizontal: 30 }}
          >
            <Text style={globalStyles.buttonText}>Go back to restaurants</Text>
          </TouchableOpacity>
        </View>
      );
  } else
    return (
      <ActivityIndicator
        style={{ marginTop: 150 }}
        animating={true}
        size="large"
        color="#5CDC58"
      />
    );
}
