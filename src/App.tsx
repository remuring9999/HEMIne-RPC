import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  const [isLogin, setLogin] = useState(false);
  const [hasOpenedLogin, setHasOpenedLogin] = useState(() => {
    return sessionStorage.getItem("hasOpenedLogin") === "true";
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
