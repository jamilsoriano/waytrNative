import React, { useContext } from "react";
import { View, ScrollView, Text } from "react-native";
import { TouchableOpacity, StyleSheet } from "react-native";
import { DataTable, ActivityIndicator } from "react-native-paper";
import { globalStyles } from "../../../styles/global";
import Firebase from "../../../firebase/firebase";
import DropDown from "../components/DBDropDown";
import { DBOrdersContext } from "../../../contexts/dbOrdersContext";

export default function DBOrders() {
  const { isLoading, dbOrders, orderDocId } = useContext(DBOrdersContext);

  let DBtotal = 0;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.viewContainer}></View>
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
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-around",
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20
        }}
      >
        <TouchableOpacity
          style={{
            ...globalStyles.logInButton,
            minWidth: 120
          }}
        >
          <Text style={globalStyles.buttonText}>Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (dbOrders.length > 0) {
              Firebase.completeOrder({ dbOrders, orderDocId });
            }
          }}
          style={{
            ...globalStyles.logInButton,
            minWidth: 120
          }}
        >
          <Text style={globalStyles.buttonText}>Bill</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...globalStyles.logInButton,
            minWidth: 120
          }}
        >
          <Text style={globalStyles.buttonText}>Call Staff</Text>
        </TouchableOpacity>
      </View>
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
