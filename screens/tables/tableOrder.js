import React from "react";
import { View, ScrollView, Text } from "react-native";
import { StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";
import DropDown from "../eat/components/DBDropDown";
import { useHeaderHeight } from "@react-navigation/stack";

export default function TableOrders({ route }) {
  const headerHeight = useHeaderHeight();
  let tableTotal = 0;
  let tableOrder = route.params.orders;

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
  }
});
