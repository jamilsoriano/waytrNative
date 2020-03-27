import React, { useEffect, useContext } from "react";
import { View, ScrollView, Text } from "react-native";
import { TouchableOpacity, StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";
import { globalStyles } from "../../../styles/global";
import io from "socket.io-client";
import { DBOrdersContext } from "../../../contexts/dbOrdersContext";
import Firebase from "../../../firebase/firebase";
import { PendingOrdersContext } from "../../../contexts/PendingOrdersContext";
import DropDown from "../components/pendingDropDown";
import { UserContext } from "../../../contexts/UserContext";
import { SeatingContext } from "../../../contexts/SeatingContext";

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

  function sendOrder() {
    if (pendingOrders.length > 0) {
      if (dbOrders.length === 0) {
        Firebase.sendOrder({
          orders: pendingOrders,
          restaurantId: restUID,
          restName,
          tableNum,
          uid: currentUserId.uid,
          orderDateTime: new Date(),
          orderCompleted: false
        });
      } else {
        pendingOrders.map(item => {
          dbOrders.map(order => {
            if (order.item === item.item) {
              item.quantity = item.quantity + order.quantity;
            }
            return order;
          });
          return item;
        });
        let concat = pendingOrders.concat(dbOrders);
        let updatedOrders = Array.from(
          new Set(concat.map(order => order.item))
        ).map(i => {
          return concat.find(order => order.item === i);
        });

        Firebase.db
          .collection("orders")
          .doc(orderDocId)
          .update({ orders: updatedOrders });
      }

      setPendingOrders([]);
      setTotal(0);
      socket.emit("sendOrder", null, () => {});
    }
  }

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
          onPress={() => {
            navigation.navigate("OrderMenu", {
              restName,
              restUID
            });
          }}
          style={{
            ...globalStyles.logInButton,
            minWidth: 120
          }}
        >
          <Text style={globalStyles.buttonText}>Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => sendOrder()}
          style={{
            ...globalStyles.logInButton,
            minWidth: 120
          }}
        >
          <Text style={globalStyles.buttonText}>Send Order</Text>
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
