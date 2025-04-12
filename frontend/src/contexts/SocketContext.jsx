// socket.js
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef({ attemptConnect: false });

  useEffect(() => {
    return () => {
      if(socketRef.current?.attemptConnect) {
        socketRef.current.disconnect();
        console.log("❌ Disconnected");
      }
    };
  }, []);

  const connectToSocket = (code) => {
    if(!socketRef.current?.connected && !socketRef.attemptConnect) {
      socketRef.current = io("http://localhost:8000", {
        query: {
          code: code
        },
        transports: ["websocket"], // Optional: for force WebSocket
        autoConnect: false,
      });
      socketRef.current.connect();
      socketRef.attemptConnect = true;

      socketRef.current.on("connect", () => {
        console.log("Connected:", socketRef.current.id);
      })

      socketRef.current.on("disconnect", () => {
        console.log("❌ Disconnected");
      });
    }
  }

  return (
    <SocketContext.Provider value={{
      currentSocket: socketRef.current,
      connectToSocket,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
