import React, { createContext, useState } from "react";

export const SeatingContext = createContext();

const SeatingContextProvider = ({ children }) => {
  const [tableNum, setTableNum] = useState();
  const [restName, setRestName] = useState();
  const [restUID, setRestUID] = useState();

  return (
    <SeatingContext.Provider
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
    </SeatingContext.Provider>
  );
};

export default SeatingContextProvider;
