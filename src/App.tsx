import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { EnxovalPage } from "./pages/EnxovalPage";
import { COUPLE } from "./config/site";

function App() {
  useEffect(() => {
    document.title = `${COUPLE.nome1} & ${COUPLE.nome2}`;
  }, []);

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
