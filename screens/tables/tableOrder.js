import React from "react";
import { View, ScrollView } from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";
import DropDown from "../eat/components/DBDropDown";
import { useHeaderHeight } from "@react-navigation/stack";
import { FloatingAction } from "react-native-floating-action";
import handleFAB from "../eat/orderComponents/handleFAB";

export default function TableOrders({ navigation, route }) {
  const headerHeight = useHeaderHeight();
  let tableTotal = 0;
  let tableOrder = route.params.tableOrder.orders;
  let data = {
    navigation,
    orderDocId: route.params.tableOrder.docId,
    dbOrders: tableOrder
  };
  const actions = [
    {
      text: "Clear Table",
      name: "clearTable",
      position: 1,
      icon: <Entypo name="menu" size={22} color="white" />,
      color: "#5CDC58"
    },
    {
      text: "Clear Staff Required Notification",
      name: "clearStaff",
      position: 2,
      icon: <MaterialCommunityIcons name="send" size={18} color="white" />,
      color: "#5CDC58"
    }
  ];

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

      <FloatingAction
        color="#5CDC58"
        actions={actions}
        overlayColor="rgba(255, 255, 255, 0)"
        onPressItem={name => {
          handleFAB(name, data);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    padding: 15
  }
});
