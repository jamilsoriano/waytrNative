import React, { useEffect, useContext } from "react";
import { View, ScrollView, Text } from "react-native";
import { TouchableOpacity, StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { PendingOrdersContext } from "../../../contexts/PendingOrdersContext";
import DropDown from "../components/pendingDropDown";

export default function PendingOrders({ toggleOrderView }) {
  const { pendingOrders } = useContext(PendingOrdersContext);
  let total = 0;

  return (
    <View>
      <View style={styles.viewContainer}>
        <Text style={styles.heading2}>Pending Orders</Text>
        <TouchableOpacity onPress={toggleOrderView}>
          <Entypo name="chevron-right" size={28} style={{ marginLeft: 20 }} />
        </TouchableOpacity>
      </View>
      <DataTable style={{ marginTop: 25 }}>
        <DataTable.Header>
          <DataTable.Title style={{ flex: 1 }} numeric></DataTable.Title>
          <DataTable.Title style={{ flex: 8 }}>Item</DataTable.Title>
          <DataTable.Title style={{ flex: 2 }} numeric>
            Quantity
          </DataTable.Title>
          <DataTable.Title style={{ flex: 3 }} numeric>
            Price ($)
          </DataTable.Title>
        </DataTable.Header>
        <ScrollView>
          {pendingOrders.length > 0 &&
            pendingOrders.map((order, i) => {
              total = total + order.price * order.quantity;
              return <DropDown key={i} order={order} i={i} />;
            })}
          <DataTable.Row>
            <DataTable.Cell style={{ justifyContent: "flex-end" }}>
              Total : ${total.toFixed(2)}
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
  },
  heading2: {
    fontSize: 20,
    fontWeight: "bold",
    height: 50
  }
});
