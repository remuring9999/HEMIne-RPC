import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  const [isLogin, setLogin] = useState(false);
  const [hasOpenedLogin, setHasOpenedLogin] = useState(() => {
    return sessionStorage.getItem("hasOpenedLogin") === "true";
  });

  useEffect(() => {
    if (!isLogin && !hasOpenedLogin) {
      window.open("http://localhost:3000/login", "_blank");
      setHasOpenedLogin(true);
      sessionStorage.setItem("hasOpenedLogin", "true");
    }
  }, [isLogin, hasOpenedLogin]);

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
