import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { UserContextProvider } from "./UserContext/UserContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </ChakraProvider>
  </StrictMode>
);
