import React from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";
import DropDown from "../eat/components/DBDropDown";
import { useHeaderHeight } from "@react-navigation/stack";
import Firebase from "../../firebase/firebase";

export default function TableOrders({ navigation, route }) {
  const headerHeight = useHeaderHeight();
  let tableTotal = 0;
  let tableOrder = route.params.tableOrder.orders;

  function completeOrder() {
    navigation.pop();
    Firebase.db
      .collection("orders")
      .doc(route.params.tableOrder.docId)
      .update({ orderCompleted: true });
  }

  return (
    <View style={styles.viewContainer}>
      <DataTable style={{ marginTop: headerHeight }}>
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
        <ScrollView>
          {tableOrder.map((order, i) => {
            tableTotal = tableTotal + order.price * order.quantity;
            return <DropDown order={order} key={i} />;
          })}
          <DataTable.Row>
            <DataTable.Cell style={{ justifyContent: "flex-end" }}>
              Total : ${tableTotal.toFixed(2)}
            </DataTable.Cell>
          </DataTable.Row>
        </ScrollView>
      </DataTable>
      <View style={{ position: "absolute", bottom: 0, left: 10, right: 10 }}>
        <TouchableOpacity
          onPress={() => {
            completeOrder();
          }}
        >
          <Text style={{ fontSize: 50 }}>Complete Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    padding: 15
  }
});
