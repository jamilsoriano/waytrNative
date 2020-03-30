import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from "react-native";
import Firebase from "../../firebase/firebase";
import { UserContext } from "../../contexts/UserContext";
import { ActivityIndicator } from "react-native-paper";
import { useHeaderHeight } from "@react-navigation/stack";

export default function Tables({ navigation }) {
  const headerHeight = useHeaderHeight();
  const { currentUserId } = useContext(UserContext);
  const [restData, setRestData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [tableOrders, setTableOrders] = useState([]);
  const currentDateTime = Math.round(new Date().getTime() / 1000);

  let tableRange = [];
  let tempTableOrders = [];

  useEffect(() => {
    console.log("reloaded");
    if (!restData.hasOwnProperty("restUID")) {
      Firebase.db
        .collection("restaurants")
        .where("restUID", "==", currentUserId.restaurantManager)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            setRestData(doc.data());
          });
        });
    } else {
      tableRange = Array.from(
        new Array(restData.restTableMax),
        (x, i) => i + 1
      );

      tableRange.map(() => {
        tempTableOrders = [...tempTableOrders, { orderCompleted: true }];
        return tempTableOrders;
      });
      Firebase.db
        .collection("orders")
        .where("restaurantId", "==", restData.restUID)
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
              if (
                currentDateTime - change.doc.data().orderDateTime.seconds <
                  3600 &&
                change.doc.data().orderCompleted === false
              ) {
                let tableNum = +change.doc.data().tableNum;
                let changeDoc = { ...change.doc.data(), docId: change.doc.id };
                tempTableOrders.splice(tableNum - 1, 1, changeDoc);
                return tempTableOrders;
              } else {
                Firebase.db
                  .collection("orders")
                  .doc(change.doc.id)
                  .update({ orderCompleted: true });
              }
            } else if (
              change.type === "modified" &&
              change.doc.data().orderCompleted === true
            ) {
              tempTableOrders[change.doc.data().tableNum - 1] = {
                orderCompleted: true
              };
              return tempTableOrders;
            }
          });
          setTableOrders(tempTableOrders);
          setDataLoaded(true);
        });
    }
  }, []);

  if (dataLoaded) {
    return (
      <ScrollView style={{ ...styles.container, marginTop: headerHeight }}>
        <View style={styles.tableLayout}>
          {tableOrders.map((tableOrder, i) =>
            tableOrder.orderCompleted ? (
              <TouchableOpacity
                key={i}
                style={{ ...styles.tableCard, backgroundColor: "#5CDC58" }}
              >
                <Text style={styles.tableCardText}>{i + 1}</Text>
                <Text style={styles.tableStatusText}>EMPTY</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("TableOrders", { tableOrder });
                }}
                key={i}
                style={{ ...styles.tableCard, backgroundColor: "#fe5956" }}
              >
                <Text style={styles.tableCardText}>{i + 1}</Text>
                <Text style={styles.tableStatusText}>OCCUPIED</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </ScrollView>
    );
  } else {
    return (
      <View>
        <ActivityIndicator
          style={{ marginTop: 150 }}
          animating={true}
          size="large"
          color="#5CDC58"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  tableLayout: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  tableCard: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "#97D895",
    marginHorizontal: 35,
    marginVertical: 25,
    height: 150,
    width: 150
  },
  tableCardText: {
    textAlign: "center",
    fontFamily: "raleway-regular",
    marginVertical: 20,
    fontSize: 50
  },
  tableStatusText: {
    textAlign: "center"
  }
});
