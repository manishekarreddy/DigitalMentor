import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "./Services/SnackbarContext";
import Auth from "./Components/Authentication/Auth";
import Dashboard from "./Pages/Dashboard";
import CreateProgram from "./Components/CreateProgram1";
import HeaderPanel from "./Pages/HeaderPanel";
import RequirementsPage from "./Pages/RequirementsPage";
import LSS from "./Services/LSS";
import GuestExamForm from "./Components/GuestExamForm";
import StatsDash from "./Components/StatsDash";
import EditProfile from "./Pages/EditProfile";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in (this could be based on a token or localStorage)
    const token = LSS.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <SnackbarProvider>
      <Router>
        {/* Render HeaderPanel outside Routes, but inside Router */}
        {<HeaderPanel />}

        <Routes>
          {/* Default Route */}
          <Route path="/login" element={<Auth />} />
          <Route path="/" element={<Auth />} />

          {/* Dashboard Route */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Other Routes */}
          <Route path="/create-program/:id?" element={<CreateProgram />} />
          <Route path="/requirements" element={<RequirementsPage />} />
          <Route path="/profileform" element={<GuestExamForm />} />
          <Route path="/stats" element={<StatsDash />} />
          <Route path="/editProfile" element={<EditProfile />} />

        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
