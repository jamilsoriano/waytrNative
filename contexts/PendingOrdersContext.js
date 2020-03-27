import React, { createContext, useState } from "react";

export const PendingOrdersContext = createContext();

const PendingOrdersContextProvider = ({ children }) => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [socket, setSocket] = useState();
  const [total, setTotal] = useState(0);

  return (
    <PendingOrdersContext.Provider
      value={{
        pendingOrders,
        setPendingOrders,
        socket,
        setSocket,
        total,
        setTotal
      }}
    >
      {children}
    </PendingOrdersContext.Provider>
  );
};

export default PendingOrdersContextProvider;
