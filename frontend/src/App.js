import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CVEList from "./components/cveList";
import CVEDetails from "./components/cveDetails";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/cves/list" replace />} />
        <Route path="/cves/list" element={<CVEList />} />
        <Route path="/cves/:id" element={<CVEDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
