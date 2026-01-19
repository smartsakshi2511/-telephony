import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { AuthProvider } from "./context/authContext";
import { PopupProvider } from "./context/iframeContext"; // Import PopupProvider

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <DarkModeContextProvider>
        <PopupProvider> {/* Wrap App with PopupProvider */}
          <App />
        </PopupProvider>
      </DarkModeContextProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
