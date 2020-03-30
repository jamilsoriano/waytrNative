import Firebase from "../../../firebase/firebase";

export default function handleFAB(name, data) {
  const {
    pendingOrders,
    dbOrders,
    restUID,
    restName,
    tableNum,
    currentUserId,
    socket,
    setPendingOrders,
    setTotal,
    navigation,
    orderDocId
  } = data;
  switch (name) {
    case "bill":
      if (dbOrders.length > 0) {
        Firebase.completeOrder({
          dbOrders: dbOrders,
          orderDocId: orderDocId
        });
        navigation.popToTop();
      }
      break;
    case "clearTable":
      if (dbOrders.length > 0) {
        Firebase.completeOrder({
          dbOrders: dbOrders,
          orderDocId: orderDocId
        });
        navigation.popToTop();
      }
      break;
    case "menu":
      navigation.navigate("OrderMenu", {
        restName: restName,
        restUID: restUID
      });
      break;
    case "sendOrder":
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
      break;
    case "staff":
      Firebase.db
        .collection("orders")
        .doc(orderDocId)
        .update({ assistanceNeeded: true });
      break;
    case "clearStaff":
      Firebase.db
        .collection("orders")
        .doc(orderDocId)
        .update({ assistanceNeeded: false });
      break;
  }
}
