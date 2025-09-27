import React from "react";

import { BrowserRouter as Router } from "react-router-dom";

import ConfigRoutes from "./router";

// import "./App.css";


const App: React.FC = () => {

  return (

    <Router>

      <ConfigRoutes />

    </Router>

  );

};


export default App;