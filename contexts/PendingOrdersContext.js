import React, { createContext, useState } from "react";

export const PendingOrdersContext = createContext();

const PendingOrdersContextProvider = ({ children }) => {
  const [tableNum, setTableNum] = useState();
  const [restName, setRestName] = useState();
  const [restUID, setRestUID] = useState();

  return (
    <PendingOrdersContext.Provider
      value={{
        tableNum,
        setTableNum,
        restName,
        setRestName,
        restUID,
        setRestUID
      }}
    >
      {children}
    </PendingOrdersContext.Provider>
  );
};

export default PendingOrdersContextProvider;
