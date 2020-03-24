import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/home";
import Account from "../screens/account/account";
import { FontAwesome } from "@expo/vector-icons";
import { UserContext } from "../contexts/UserContext";
import { createStackNavigator } from "@react-navigation/stack";
import OrdersList from "../screens/orders/ordersList";
import OrderDetails from "../screens/orders/orderDetails";
import RestList from "../screens/eat/restList";
import RestMenu from "../screens/eat/restMenu";
import TableConfirmation from "../screens/eat/tableConfirmation";
import Seated from "../screens/eat/seated";
import OrderMenu from "../screens/eat/orderMenu";
import OrderItem from "../screens/eat/orderItem";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function createOrderStack() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="OrderList" component={OrdersList} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
    </Stack.Navigator>
  );
}
function createEatStack() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="RestList" component={RestList} />
      <Stack.Screen name="RestMenu" component={RestMenu} />
      <Stack.Screen name="TableConfirmation" component={TableConfirmation} />
      <Stack.Screen name="Seated" component={Seated} />
      <Stack.Screen name="OrderMenu" component={OrderMenu} />
      <Stack.Screen name="OrderItem" component={OrderItem} />
    </Stack.Navigator>
  );
}

const TabNavigation = ({ user }) => {
  const { setCurrentUserId } = useContext(UserContext);

  setCurrentUserId(user);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Eat") {
              iconName = "cutlery";
            } else if (route.name === "Orders") {
              iconName = "list-alt";
            } else if (route.name === "Account") {
              iconName = "user-circle-o";
            }
            return <FontAwesome name={iconName} size={size} color={color} />;
          }
        })}
        tabBarOptions={{
          activeTintColor: "#5CDC58",
          inactiveTintColor: "gray"
        }}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Eat" children={createEatStack} />
        <Tab.Screen name="Orders" children={createOrderStack} />
        <Tab.Screen name="Account" component={Account} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default TabNavigation;
