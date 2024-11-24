import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "./Services/SnackbarContext";
import Auth from "./Components/Authentication/Auth";
import CourseRecommendations from "./Components/misc/Recc";
import MySkills from "./Components/misc/Skills";
import ProgramRequirementsDashboard from "./Components/misc/ProgramRequirementsDashboard";
import ProgramApplicationsView from "./Components/misc/applicants";
import Dashboard from "./Pages/Dashboard";

function App() {
  return (
    <SnackbarProvider>
      <Router>
        <Routes>
          {/* Default Route */}

          <Route path="/login" element={<Auth />} />
          <Route path="/" element={<Auth />} />
          {/* Dashboard Route */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Other Routes */}
          <Route path="/recommendations" element={<CourseRecommendations />} />
          <Route path="/skills" element={<MySkills />} />
          <Route path="/requirements" element={<ProgramRequirementsDashboard />} />
          <Route path="/applications" element={<ProgramApplicationsView />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
