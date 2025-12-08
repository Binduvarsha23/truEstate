import React from "react";
import Dashboard from "./components/Dashboard";
import SalesTable from "./components/SalesTable";

function App() {
  return (
    <div className="App">
      <h1>Retail Sales Dashboard</h1>
      <Dashboard />
      <hr/>
      <SalesTable />
    </div>
  );
}

export default App;
