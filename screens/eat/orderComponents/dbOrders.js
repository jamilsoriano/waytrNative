import React from "react";
import { View, ScrollView, Text } from "react-native";
import { TouchableOpacity, StyleSheet } from "react-native";
import { DataTable, ActivityIndicator } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import DropDown from "../components/DBDropDown";

export default function DBOrders({ toggleOrderView, dbOrders, isLoading }) {
  let DBtotal = 0;

  return (
    <View>
      <View style={styles.viewContainer}>
        <Text style={styles.heading2}>Sent Orders</Text>
        <TouchableOpacity onPress={toggleOrderView}>
          <Entypo name="chevron-right" size={28} style={{ marginLeft: 20 }} />
        </TouchableOpacity>
      </View>
      <DataTable style={{ marginTop: 25 }}>
        <DataTable.Header>
          <DataTable.Title style={{ flex: 1 }}></DataTable.Title>
          <DataTable.Title style={{ flex: 8 }}>Item</DataTable.Title>
          <DataTable.Title style={{ flex: 2 }} numeric>
            Quantity
          </DataTable.Title>
          <DataTable.Title style={{ flex: 3 }} numeric>
            Price ($)
          </DataTable.Title>
        </DataTable.Header>
        {!isLoading ? (
          <ScrollView>
            {dbOrders.length > 0 &&
              dbOrders.map((order, i) => {
                DBtotal = DBtotal + order.price * order.quantity;
                return <DropDown order={order} key={i} />;
              })}
            <DataTable.Row>
              <DataTable.Cell style={{ justifyContent: "flex-end" }}>
                Total : ${DBtotal.toFixed(2)}
              </DataTable.Cell>
            </DataTable.Row>
          </ScrollView>
        ) : (
          <ActivityIndicator
            style={{ marginTop: 100 }}
            animating={true}
            size="large"
            color="#5CDC58"
          />
        )}
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    left: 15,
    right: 15
  },
  heading2: {
    fontSize: 20,
    fontWeight: "bold",
    height: 50
  }
});
