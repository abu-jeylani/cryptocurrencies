import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import CryptoSummary from "./pages/cryptoSummary/index";

const App = () => {
  return (
    <Routes>
      <Route index element={<CryptoSummary />} />
    </Routes>
  );
};

export default App;
