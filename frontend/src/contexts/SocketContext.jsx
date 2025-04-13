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

  const connectToSocket = (code, isOwner, memberName, memberId, onRegistered) => {
    if(!socketRef.current && !attemptConnect.current) {
      socketRef.current = io("http://localhost:8000", {
        query: {
          code: code,
          isOwner: isOwner,
          member: memberName,
          memberId: memberId,
        },
        transports: ["websocket"], // Optional: for force WebSocket
        autoConnect: false,
      });
      socketRef.current.connect();
      attemptConnect.current = true;

      socketRef.current.on("connect", () => {
        console.log("Connected:", socketRef.current.id);
      })

      socketRef.current.on("disconnect", () => {
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
