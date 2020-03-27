import React, { useState } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { globalStyles } from "../../styles/global";
import Firebase from "../../firebase/firebase";
import { ActivityIndicator } from "react-native-paper";

export default function OrderMenu({ navigation, route }) {
  const [menu, setMenu] = useState();
  const [isLoading, setIsLoading] = useState(true);
  let restUID = route.params.restUID;

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
    navigation.goBack();
  };

  if (!isLoading && menu) {
    if (Object.keys(menu).length > 0) {
      return (
        <View style={{ flex: 1 }}>
          <ScrollView>
            {menu.items.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={{ marginVertical: 12 }}
                onPress={() => {
                  navigation.navigate("OrderItem", {
                    item: menu.items[i],
                    description: menu.descriptions[i],
                    price: menu.prices[i],
                    allergens: menu.allergens[i]
                  });
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginLeft: 15
                  }}
                >
                  <View style={{ flex: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>{menu.items[i]}</Text>
                    <Text style={{ fontFamily: "raleway-italic" }}>
                      {menu.descriptions[i]}
                    </Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text>${menu.prices[i].toFixed(2)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
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
