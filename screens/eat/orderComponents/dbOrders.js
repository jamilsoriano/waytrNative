import React, { useContext } from "react";
import { View, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { DataTable, ActivityIndicator } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DropDown from "../components/DBDropDown";
import { DBOrdersContext } from "../../../contexts/dbOrdersContext";
import { FloatingAction } from "react-native-floating-action";
import handleFAB from "./handleFAB";

export default function DBOrders({ navigation }) {
  const { isLoading, dbOrders, orderDocId } = useContext(DBOrdersContext);
  const actions = [
    {
      text: "Get Bill",
      name: "bill",
      position: 1,
      icon: <MaterialCommunityIcons name="receipt" size={22} color="white" />,
      color: "#5CDC58"
    },
    {
      text: "Call Staff",
      name: "staff",
      position: 2,
      icon: <MaterialCommunityIcons name="hand" size={22} color="white" />,
      color: "#5CDC58"
    }
  ];

  let DBtotal = 0;
  let data = { dbOrders, orderDocId, navigation };

  return (
    <View style={{ flex: 1 }}>
      <DataTable>
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
