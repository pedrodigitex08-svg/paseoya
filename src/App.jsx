// App.jsx — Router + Provider (v4 — Fase 4: Invitado)
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PaseoProvider, usePaseo } from "./store/usePaseoStore";

import CreatePaseo from "./pages/CreatePaseo";
import Dashboard from "./pages/Dashboard";
import GuestDashboard from "./pages/GuestDashboard";
import Voting from "./pages/Voting";
import Logistics from "./pages/Logistics";
import LaVaca from "./pages/LaVaca";
import GuestInvite from "./pages/GuestInvite";
import GuestRecovery from "./pages/GuestRecovery";
import Landing from "./pages/Landing";
import Privacidad from "./pages/Privacidad";


function AuthListener() {
  const { checkSession } = usePaseo();
  useEffect(() => {
    checkSession();
  }, []);
  return null;
}

export default function App() {

  return (
    <PaseoProvider>
      <AuthListener />
      <BrowserRouter>
        <Routes>
          {/* Pantalla 0: Landing Page */}
          <Route path="/" element={<Landing />} />
          <Route path="/privacidad" element={<Privacidad />} />

          {/* Pantalla 1: Creación */}
          <Route path="/crear" element={<CreatePaseo />} />

          {/* Pantalla 2: Dashboard del Anfitrión */}
          <Route path="/paseo/:slug" element={<Dashboard />} />

          {/* Hub del Invitado */}
          <Route path="/paseo/:slug/guest-hub" element={<GuestDashboard />} />

          {/* Pantalla 3: Votaciones */}
          <Route path="/paseo/:slug/votar" element={<Voting />} />

          {/* Pantalla 4: Logística */}
          <Route path="/paseo/:slug/logistica" element={<Logistics />} />

          {/* Pantalla 5: La Vaca */}
          <Route path="/paseo/:slug/vaca" element={<LaVaca />} />

          {/* Pantalla 6: Invitación del invitado — Fase 4 */}
          <Route path="/paseo/:slug/invite" element={<GuestInvite />} />

          {/* Recuperación de Sesión de Invitado */}
          <Route path="/paseo/:slug/recover/:guestId" element={<GuestRecovery />} />

          {/* Fallback - Atrapa cualquier ruta sin slug o inválida y la manda al creador */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PaseoProvider>
  );
}

