import React from "react";

import Board from "./components/Board";
import "./styles/app.css";

const App = () => {
  return (
    <div className="hero">
      <h1>Chess</h1>
      <Board />
    </div>
  );
};

export default App;
