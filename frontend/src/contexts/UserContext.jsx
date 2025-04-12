import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: "",
    zelleId: "",
    isOwner: false,
    id: "",
    items: {}
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
