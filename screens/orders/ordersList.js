import React, { useState, useContext, useEffect } from "react";
import { Text, ScrollView, View } from "react-native";
import { globalStyles } from "../../styles/global";
import { UserContext } from "../../contexts/UserContext";
import Firebase from "../../firebase/firebase";
import { ActivityIndicator, Card, Paragraph } from "react-native-paper";
import { useHeaderHeight } from "@react-navigation/stack";

export default function OrdersList({ navigation }) {
  const headerHeight = useHeaderHeight();
  const { currentUserId } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    Firebase.getPreviousOrders(currentUserId.uid).then(response => {
      setOrders(response);
      setIsLoading(false);
    });
  }, []);

  function convertToDateTime(seconds) {
    var date = new Date(seconds * 1000);
    var months_arr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    var year = date.getFullYear();
    var month = months_arr[date.getMonth()];
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var dateTime =
      month + "-" + day + "-" + year + " " + hours + ":" + minutes.substr(-2);
    return dateTime;
  }

  if (!isLoading) {
    return (
      <View style={{ flex: 1, marginTop: headerHeight }}>
        <ScrollView
          style={{
            ...globalStyles.container,
            paddingTop: 0,
            paddingHorizontal: 15
          }}
        >
          {orders.length > 0 ? (
            orders.map((order, i) => (
              <Card
                style={{ marginTop: 5 }}
                onPress={() => {
                  navigation.navigate("OrderDetails", order);
                }}
                key={i}
              >
                <Card.Content
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <Paragraph style={globalStyles.titleText}>
                    {order.restName}
                  </Paragraph>
                  <Paragraph style={{ fontFamily: "raleway-light" }}>
                    {convertToDateTime(order.orderDateTime.seconds)}
                  </Paragraph>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text style={{ fontFamily: "raleway-light", textAlign: "center" }}>
              No previous orders made.{" "}
            </Text>
          )}
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
