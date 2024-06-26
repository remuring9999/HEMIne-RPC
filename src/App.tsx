import { HashRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Error from "./pages/Error";
import Login from "./pages/Login";
import Connection from "./pages/Connection";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/error" element={<Error />} />
        <Route path="/connection" element={<Connection />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
