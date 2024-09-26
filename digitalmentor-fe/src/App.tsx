import React from "react";
// import logo from "./logo.svg";
import "./App.css";
// import ContainedButtons from "./Test";
import Auth from "./Components/Authentication/Auth"
import { SnackbarProvider } from "./Services/SnackbarContext";

function App() {
  return (
    <SnackbarProvider>
      <React.StrictMode>
        <Auth />
      </React.StrictMode>
      {/* Other components */}
    </SnackbarProvider>
  );
}

export default App;
