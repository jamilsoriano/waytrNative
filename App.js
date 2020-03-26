import React, { useState, useEffect } from "react";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import TabNavigation from "./routes/tabNavigation";
import { globalStyles } from "./styles/global";
import Firebase from "./firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import UserContextProvider from "./contexts/UserContext";
import { Provider as PaperProvider } from "react-native-paper";
import AccountStackCred from "./routes/accountCredStack";
import SignUpContextProvider from "./contexts/SignUpContext";
import RestaurantListContextProvider from "./contexts/RestaurantListContext";
import PendingOrdersContextProvider from "./contexts/PendingOrdersContext";
import { YellowBox } from "react-native";
import _ from "lodash";

YellowBox.ignoreWarnings(["Setting a timer"]);
YellowBox.ignoreWarnings([
  "Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?"
]);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

const getFonts = () =>
  Font.loadAsync({
    "raleway-regular": require("./assets/fonts/Raleway-Regular.ttf"),
    "raleway-bold": require("./assets/fonts/Raleway-Bold.ttf"),
    "raleway-light": require("./assets/fonts/Raleway-Light.ttf"),
    "raleway-italic": require("./assets/fonts/Raleway-Italic.ttf")
  });

export default function App() {
  const [user, initialising] = useAuthState(Firebase.auth);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [userDataLoading, setUserDataLoading] = useState(true);

  useEffect(() => {
    setUserDataLoading(true);
    if (user) {
      user.getIdTokenResult().then(idTokenResult => {
        user.admin = idTokenResult.claims.admin ? true : false;
        user.restaurantManager = idTokenResult.claims.restaurantID
          ? idTokenResult.claims.restaurantID
          : null;
        setUserDataLoading(false);
      });
    } else if (!initialising) {
      setUserDataLoading(false);
    }
  }, [user, initialising]);

  if (fontsLoaded) {
    if (!initialising && !userDataLoading) {
      return user ? (
        <UserContextProvider>
          <RestaurantListContextProvider>
            <PaperProvider>
              <PendingOrdersContextProvider>
                <TabNavigation user={user} styles={globalStyles.tabNav} />
              </PendingOrdersContextProvider>
            </PaperProvider>
          </RestaurantListContextProvider>
        </UserContextProvider>
      ) : (
        <SignUpContextProvider>
          <AccountStackCred />
        </SignUpContextProvider>
      );
    } else {
      return <AppLoading />;
    }
  } else {
    return (
      <AppLoading startAsync={getFonts} onFinish={() => setFontsLoaded(true)} />
    );
  }
}
