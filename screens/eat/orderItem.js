import React, { useState, useContext } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from "react-native";
import { globalStyles } from "../../styles/global";
import { Divider } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { PendingOrdersContext } from "../../contexts/PendingOrdersContext";

export default function OrderItem({ navigation, route }) {
  const [quantity, setQuantity] = useState(0);
  const [note, setNote] = useState("");
  const {
    pendingOrders,
    setPendingOrders,
    socket,
    total,
    setTotal
  } = useContext(PendingOrdersContext);

  let item = route.params.item;
  let price = route.params.price;
  let description = route.params.description;
  let allergens = route.params.allergens;

  function addToOrder() {
    let TPOrders = pendingOrders;
    let orderItem = { item, price, quantity, note, status: 0 };
    let index;
    let inOrder = false;

    if (quantity > 0) {
      TPOrders.map((order, i) => {
        if (order.item === item) {
          orderItem.quantity = order.quantity + quantity;
          index = i;
          inOrder = true;
        }
        return order, inOrder;
      });
      if (inOrder) {
        TPOrders.splice(index, 1, orderItem);
      } else {
        TPOrders = [...TPOrders, orderItem];
      }

      socket.emit("sendTempOrder", TPOrders, () => {});
      setTotal(total + orderItem.price * orderItem.quantity);
      setPendingOrders(TPOrders);
      navigation.pop();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{item}</Text>
      <Divider style={styles.divider} />
      <ScrollView>
        <Text style={styles.itemInfoText}>{description}</Text>
        <Text style={styles.price}>${price.toFixed(2)}</Text>
        <Text style={styles.allergen}>
          {allergens !== "None"
            ? `Please be aware, this item contains ${allergens.toLowerCase()}`
            : null}
        </Text>
      </ScrollView>
      <View>
        <View style={styles.quantityView}>
          {quantity > 0 ? (
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity - 1)}
            >
              <FontAwesome name="minus-circle" size={40} color={"#5CDC58"} />
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityButton}>
              <FontAwesome name="minus-circle" size={40} color={"#C0C0C0"} />
            </View>
          )}

          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(quantity + 1)}
          >
            <FontAwesome name="plus-circle" size={40} color={"#5CDC58"} />
          </TouchableOpacity>
        </View>
        <TextInput
          style={globalStyles.logInInput}
          placeholder="Add note.."
          onChangeText={value => {
            setNote(value);
          }}
        />
        <TouchableOpacity style={styles.orderButton} onPress={addToOrder}>
          <Text style={globalStyles.buttonText}>Add to Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  heading: {
    marginTop: 30,
    fontFamily: "raleway-bold",
    textAlign: "center",
    fontSize: 25,
    color: "black",
    marginBottom: 15,
    textAlign: "center"
  },
  itemInfoText: {
    fontFamily: "raleway-italic",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10
  },
  price: {
    fontFamily: "raleway-regular",
    fontSize: 16,
    textAlign: "center",
    height: 30
  },
  quantity: {
    fontFamily: "raleway-regular",
    fontSize: 20,
    height: 30,
    textAlignVertical: "bottom"
  },
  divider: {
    backgroundColor: "black",
    marginVertical: 10
  },
  quantityView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 50
  },
  quantityButton: {
    height: 50,
    marginHorizontal: 60
  },
  orderButton: {
    ...globalStyles.logInButton,
    marginTop: 10
  },
  allergen: {
    fontFamily: "raleway-light",
    fontSize: 12,
    color: "red",
    textAlign: "center"
  }
});
