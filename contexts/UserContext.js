import React, { createContext, useState } from "react";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState({
    restaurantManager: null,
    admin: false
  });
  const [currentUserData, setCurrentUserData] = useState({
    firstName: "",
    lastName: ""
  });

  return (
    <UserContext.Provider
      value={{
        currentUserId,
        setCurrentUserId,
        currentUserData,
        setCurrentUserData
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
