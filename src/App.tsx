import { useState, useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Error from "./pages/Error";
import Login from "./pages/Login";

function App() {
  const [isLogin, setLogin] = useState(false);
  const [hasOpenedLogin, setHasOpenedLogin] = useState(() => {
    return sessionStorage.getItem("hasOpenedLogin") === "true";
  });

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
