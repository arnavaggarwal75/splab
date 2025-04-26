import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { UserProvider } from "./contexts/UserContext.jsx";
import { SocketProvider } from "./contexts/SocketContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocketProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </SocketProvider>
  </StrictMode>
);
