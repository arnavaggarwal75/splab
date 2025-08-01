// socket.js
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const attemptConnect = useRef(false);

  useEffect(() => {
    return () => {
      if(socketRef.current) {
        socketRef.current.disconnect();
        console.log("❌ Disconnected");
      }
    };
  }, []);

  const connectToSocket = (memberId, tabId) => {
    if(!socketRef.current && !attemptConnect.current) {
      socketRef.current = io(import.meta.env.VITE_API_URL, {
        query: {
          tab_id: tabId,
          member_id: memberId,
        },
        transports: ["websocket"], // Optional: for force WebSocket
        autoConnect: false,
      });
      socketRef.current.connect();

      socketRef.current.on("connect", () => {
        attemptConnect.current = true;
        console.log("Connected:", socketRef.current);
      })

      socketRef.current.on("disconnect", () => {
        attemptConnect.current = false;
        console.log("❌ Disconnected");
      });

      socketRef.current.on("member_registered", (data) => {
        console.log("Member registered:", data.memberId);
        if (onRegistered) onRegistered(data.member_id);
      });  
    }
  }

  return (
    <SocketContext.Provider value={{
      currentSocketRef: socketRef,
      connectToSocket,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
