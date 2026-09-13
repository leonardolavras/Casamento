import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { EnxovalPage } from "./pages/EnxovalPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/enxoval" element={<EnxovalPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
