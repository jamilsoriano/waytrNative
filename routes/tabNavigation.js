import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/home";
import Account from "../screens/account/account";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { UserContext } from "../contexts/UserContext";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import OrdersList from "../screens/orders/ordersList";
import OrderDetails from "../screens/orders/orderDetails";
import RestList from "../screens/eat/restList";
import RestMenu from "../screens/eat/restMenu";
import TableConfirmation from "../screens/eat/tableConfirmation";
import OrderMenu from "../screens/eat/orderMenu";
import OrderItem from "../screens/eat/orderItem";
import Tables from "../screens/tables/tables";
import TableOrders from "../screens/tables/tableOrder";
import PendingOrders from "../screens/eat/orderComponents/pendingOrders";
import DBOrders from "../screens/eat/orderComponents/dbOrders";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

function createOrderStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OrderList"
        component={OrdersList}
        options={{
          headerTitle: "Orders",
          headerTitleAlign: "center",
          headerTransparent: true,
          headerTitleStyle: { fontFamily: "raleway-bold", fontSize: 32 }
        }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{
          headerTitle: "",
          headerTitleAlign: "center",
          headerTransparent: true,
          headerTitleStyle: { fontFamily: "raleway-bold", fontSize: 32 }
        }}
      />
    </Stack.Navigator>
  );
}

function createSeatedTab() {
  return (
    <TopTab.Navigator
      headerMode="none"
      backBehavior="initialRoute"
      tabBarOptions={{
        indicatorStyle: {
          backgroundColor: "#5CDC58"
        },
        pressOpacity: "#5CDC58"
      }}
    >
      <TopTab.Screen
        name="PendingOrdersStack"
        component={PendingOrders}
        options={{ tabBarLabel: "Pending" }}
      />
      <TopTab.Screen
        name="DBOrders"
        component={DBOrders}
        options={{ tabBarLabel: "Sent" }}
      />
    </TopTab.Navigator>
  );
}

function createTableStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TableList"
        component={Tables}
        options={{
          headerTitle: "Tables",
          headerTitleAlign: "center",
          headerTransparent: true,
          headerTitleStyle: { fontSize: 35 }
        }}
      />
      <Stack.Screen
        name="TableOrders"
        component={TableOrders}
        options={{
          headerTitle: "Table Order",
          headerTitleAlign: "center",
          headerTransparent: true,
          headerTitleStyle: { fontSize: 35 }
        }}
      />
    </Stack.Navigator>
  );
}

function createEatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RestList"
        component={RestList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RestMenu"
        component={RestMenu}
        options={{
          headerTitle: "",
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name="TableConfirmation"
        component={TableConfirmation}
        options={{
          headerTransparent: true,
          headerTitle: "Enter Table Number",
          headerTitleAlign: "center",
          headerTitleStyle: { fontFamily: "raleway-bold", fontSize: 32 }
        }}
      />
      <Stack.Screen
        name="Seated"
        children={createSeatedTab}
        options={{
          headerTitleAlign: "center",
          headerTitleStyle: { fontFamily: "raleway-bold", fontSize: 32 }
        }}
      />
      <Stack.Screen
        name="OrderMenu"
        component={OrderMenu}
        options={{
          headerTitleAlign: "center",
          headerTitle: "Order Menu",
          headerTitleStyle: { fontFamily: "raleway-bold", fontSize: 32 }
        }}
      />
      <Stack.Screen
        name="OrderItem"
        component={OrderItem}
        options={{ headerTransparent: true, headerTitle: null }}
      />
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
            switch (route.name) {
              case "Home":
                return <FontAwesome name="home" size={size} color={color} />;
              case "Tables":
                return (
                  <MaterialIcons
                    name="room-service"
                    size={size}
                    color={color}
                  />
                );
              case "Orders":
                return (
                  <FontAwesome name="list-alt" size={size} color={color} />
                );
              case "Restaurant":
                return (
                  <MaterialIcons name="settings" size={size} color={color} />
                );
              case "Account":
                return (
                  <FontAwesome name="user-circle-o" size={size} color={color} />
                );
              case "Eat":
                return <FontAwesome name="cutlery" size={size} color={color} />;
            }
          }
        })}
        tabBarOptions={{
          activeTintColor: "#5CDC58",
          inactiveTintColor: "gray"
        }}
      >
        {user.restaurantManager ? (
          <>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Tables" children={createTableStack} />
            <Tab.Screen name="Orders" children={createOrderStack} />
            <Tab.Screen name="Restaurant" component={Account} />
          </>
        ) : (
          <>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Eat" children={createEatStack} />
            <Tab.Screen name="Orders" children={createOrderStack} />
            <Tab.Screen name="Account" component={Account} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default TabNavigation;
