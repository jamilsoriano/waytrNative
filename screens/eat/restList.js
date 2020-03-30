import React, { useState, useContext } from "react";
import { View, ScrollView } from "react-native";
import { RestaurantListContext } from "../../contexts/RestaurantListContext";
import Firebase from "../../firebase/firebase";
import RestListCards from "./components/restListCards";
import { ActivityIndicator, Searchbar } from "react-native-paper";

export default function RestList({ navigation }) {
  const { restaurantList, setRestaurantList } = useContext(
    RestaurantListContext
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  Firebase.getRestaurantList().then(response => {
    if (isLoading !== response.loading) {
      setIsLoading(response.loading);
    }
    if (!response.loading && restaurantList.length === 0) {
      setRestaurantList(response.restCollection);
    }
  });
  if (!isLoading && restaurantList.length !== 0) {
    return (
      <View style={{ flex: 1 }}>
        <Searchbar
          style={{ marginTop: 10, marginHorizontal: 12, marginBottom: 10 }}
          onChangeText={value => {
            setSearchQuery(value);
          }}
          placeholder="Search"
        />
        <ScrollView>
          <RestListCards
            searchQuery={searchQuery}
            navigation={navigation}
            restaurantList={restaurantList}
          />
        </ScrollView>
      </View>
    );
  } else {
    return (
      <ActivityIndicator
        style={{ marginTop: 150 }}
        animating={true}
        size="large"
        color="#5CDC58"
      />
    );
  }
}
