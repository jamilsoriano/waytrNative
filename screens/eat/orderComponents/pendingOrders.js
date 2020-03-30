import React, { useEffect, useContext } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import io from "socket.io-client";
import { DBOrdersContext } from "../../../contexts/dbOrdersContext";
import Firebase from "../../../firebase/firebase";
import { PendingOrdersContext } from "../../../contexts/PendingOrdersContext";
import DropDown from "../components/pendingDropDown";
import { UserContext } from "../../../contexts/UserContext";
import { SeatingContext } from "../../../contexts/SeatingContext";
import { FloatingAction } from "react-native-floating-action";
import handleFAB from "./handleFAB";

let socket;

export default function PendingOrders({ navigation }) {
  const {
    pendingOrders,
    setPendingOrders,
    setSocket,
    total,
    setTotal
  } = useContext(PendingOrdersContext);
  const { currentUserId } = useContext(UserContext);
  const { tableNum, restName, restUID } = useContext(SeatingContext);
  const {
    setIsLoading,
    dbOrders,
    setDbOrders,
    orderDocId,
    setOrderDocId
  } = useContext(DBOrdersContext);

  const ENDPOINT = "http://192.168.1.31:4000";
  let currentDateTime = Math.round(new Date().getTime() / 1000);
  let data = {
    navigation,
    restName,
    restUID,
    pendingOrders,
    dbOrders,
    tableNum,
    socket,
    currentUserId,
    setPendingOrders,
    setTotal,
    orderDocId
  };
  const actions = [
    {
      text: "Add to order",
      name: "menu",
      position: 1,
      icon: <Entypo name="menu" size={22} color="white" />,
      color: "#5CDC58"
    },
    {
      text: "Send order to the kitchen",
      name: "sendOrder",
      position: 2,
      icon: <MaterialCommunityIcons name="send" size={18} color="white" />,
      color: "#5CDC58"
    }
  ];

  useEffect(() => {
    socket = io(ENDPOINT);
    setSocket(socket);
    setTotal(0);
    setPendingOrders([]);
    setDbOrders([]);
    socket.emit(
      "join",
      {
        uid: currentUserId.uid,
        name: currentUserId.displayName,
        restaurantId: restUID,
        restName,
        tableNum
      },
      () => {}
    );

    socket.on("order", order => {
      setPendingOrders(order);
      let Total = 0;
      order.map(item => {
        Total = Total + item.price * item.quantity;
        return Total;
      });
      setTotal(Total);
    });

    socket.on("orderSent", () => {
      setPendingOrders([]);
    });

    return () => {
      socket.emit("disconnect");
      socket.close();
      socket.off();
    };
  }, []);

  useEffect(() => {
    Firebase.db
      .collection("orders")
      .where("tableNum", "==", tableNum)
      .where("restaurantId", "==", restUID)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (
            (change.type === "added" || change.type === "modified") &&
            currentDateTime - change.doc.data().orderDateTime.seconds < 3600
          ) {
            if (change.doc.data().orderCompleted === false) {
              setDbOrders(change.doc.data().orders);
            } else {
              setDbOrders([]);
            }
            setOrderDocId(change.doc.id);
          }
        });
        setIsLoading(false);
      });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.viewContainer}></View>
      <DataTable>
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
              return <DropDown key={i} order={order} i={i} />;
            })}
          <DataTable.Row>
            <DataTable.Cell style={{ justifyContent: "flex-end" }}>
              Total : ${total.toFixed(2)}
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
