import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const defaultUser = {
    name: "",
    paymentInfo: "",
    isOwner: false,
    memberId: "",
    code: "",
  }
  
  const [user, setUser] = useState(null);

  const saveUser = (newUser) => {
    if(newUser) {
      localStorage.setItem("splab_user", JSON.stringify(newUser));
      setUser(newUser);
    } else {
      localStorage.setItem("splab_user", JSON.stringify(user));
    }
  }

  const getUser = () => {
    const seralizedUser = localStorage.getItem("splab_user");
    const savedUser = JSON.parse(seralizedUser);
    return savedUser;
  }

  const restoreUser = () => {
    const serializedUser = localStorage.getItem("splab_user");
    const savedUser = JSON.parse(serializedUser);
    setUser(savedUser);
  }

  const removeUser = () => {
    localStorage.removeItem("splab_user");
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, setUser, saveUser, restoreUser, removeUser, getUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
