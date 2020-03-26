import React, { createContext, useState } from "react";

export const DBOrdersContext = createContext();

const DBOrdersContextProvider = ({ children }) => {
  const [dbOrders, setDbOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderDocId, setOrderDocId] = useState();

  return (
    <DBOrdersContext.Provider
      value={{
        dbOrders,
        setDbOrders,
        isLoading,
        setIsLoading,
        orderDocId,
        setOrderDocId
      }}
    >
      {children}
    </DBOrdersContext.Provider>
  );
};

export default DBOrdersContextProvider;
