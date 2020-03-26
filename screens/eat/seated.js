import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { globalStyles } from "../../styles/global";
import { Divider } from "react-native-paper";
import PendingOrders from "./orderComponents/pendingOrders";
import DBOrders from "./orderComponents/dbOrders";
import io from "socket.io-client";
import Firebase from "../../firebase/firebase";
import { UserContext } from "../../contexts/UserContext";
import { PendingOrdersContext } from "../../contexts/PendingOrdersContext";

let socket;

export default function Seated({ navigation, route }) {
  const tableNum = route.params.tableNum;
  const restName = route.params.restName;
  const restUID = route.params.restUID;
  const [isLoading, setisLoading] = useState(true);
  const [dbOrders, setDbOrders] = useState([]);
  const [orderDocId, setOrderDocId] = useState("");
  const [orderToggle, setOrderToggle] = useState(false);
  const { currentUserId } = useContext(UserContext);
  const { pendingOrders, setPendingOrders, setSocket, setTotal } = useContext(
    PendingOrdersContext
  );
  const currentDateTime = Math.round(new Date().getTime() / 1000);
  const ENDPOINT = "http://192.168.1.31:4000";

  useEffect(() => {
    socket = io(ENDPOINT);
    setSocket(socket);
    setPendingOrders([]);
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
        setisLoading(false);
      });
  }, []);

  function toggleOrderView() {
    setOrderToggle(!orderToggle);
  }

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

  function completeOrder() {
    if (dbOrders) {
      Firebase.db
        .collection("orders")
        .doc(orderDocId)
        .update({ orderCompleted: true });
    }
  }

  return (
    <View style={globalStyles.container}>
      <Text
        style={{
          ...globalStyles.motto,
          marginTop: 30,
          marginBottom: 15,
          fontSize: 28
        }}
      >
        Eating at {restName} - Table {tableNum}
      </Text>
      <Divider style={{ marginBottom: 8 }} />
      <ScrollView>
        {orderToggle ? (
          <DBOrders
            toggleOrderView={toggleOrderView}
            dbOrders={dbOrders}
            isLoading={isLoading}
          />
        ) : (
          <PendingOrders toggleOrderView={toggleOrderView} />
        )}
      </ScrollView>
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
          onPress={() => {
            orderToggle ? completeOrder() : sendOrder();
          }}
          style={{
            ...globalStyles.logInButton,
            minWidth: 120
          }}
        >
          <Text style={globalStyles.buttonText}>
            {orderToggle ? "Bill" : "Send Order"}
          </Text>
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
