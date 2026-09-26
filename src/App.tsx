import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { EnxovalPage } from "./pages/EnxovalPage";
import { GaleriaPage } from "./pages/GaleriaPage";
import { MuralPage } from "./pages/MuralPage";
import { HistoriaPage } from "./pages/HistoriaPage";
import { COUPLE } from "./config/site";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  useEffect(() => {
    document.title = `${COUPLE.nome1} & ${COUPLE.nome2}`;
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/galeria" element={<GaleriaPage />} />
        <Route path="/mural" element={<MuralPage />} />
        <Route path="/historia" element={<HistoriaPage />} />
        <Route path="/enxoval" element={<EnxovalPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
