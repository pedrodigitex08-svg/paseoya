// components/layout/BottomNav.jsx
// Barra de navegación inferior fija — ruteo dinámico por rol (host / guest).

import { useNavigate, useLocation, useParams } from "react-router-dom";
import { LayoutDashboard, Vote, ShoppingBasket, Wallet } from "lucide-react";
import { usePaseo } from "../../store/usePaseoStore";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();
  const { state } = usePaseo();
  const paseo = state.activePaseo;
  const isShortWithoutLogistics = paseo?.category === "rumba" || paseo?.category === "restaurante" || paseo?.category === "regalo";

    // 📌 Determina la ruta de "Inicio" según el rol del usuario actual 📌
  // La forma más segura de saber si es el host es comparar su sesión autenticada con el hostId del paseo.
  // Si no hay hostId (paseo antiguo), usamos la lógica local asumiendo que es host_1.
  const isAuthHost = paseo?.hostId && state.session?.user?.id && paseo.hostId === state.session.user.id;
  
  const myParticipantRecord = paseo?.participants?.find(p => p.id === state.currentUser?.id);
  const isLocalHost = myParticipantRecord 
    ? myParticipantRecord.role === "host" 
    : state.currentUser?.role === "host";

  const isHost = isAuthHost || (!paseo?.hostId && isLocalHost);

  // Si no hay slug, preparamos un fallback seguro a la raíz.
  const homeRoute = isHost
    ? slug
      ? `/paseo/${slug}`
      : "/"
    : slug
    ? `/paseo/${slug}/guest-hub`
    : "/";

  const homeTabIds = ["dashboard", "guest-hub"];

  const TABS = [
    {
      id: isHost ? "dashboard" : "guest-hub",
      label: "Inicio",
      icon: LayoutDashboard,
      path: homeRoute,
    },
    {
      id: "votar",
      label: "Votar",
      icon: Vote,
      path: slug ? `/paseo/${slug}/votar` : "/",
    },
    {
      id: "logistica",
      label: "Logística",
      icon: ShoppingBasket,
      path: slug ? `/paseo/${slug}/logistica` : "/",
    },
    {
      id: "vaca",
      label: "La Vaca",
      icon: Wallet,
      path: slug ? `/paseo/${slug}/vaca` : "/",
    },
  ];

  const isActive = (tab) => {
    if (homeTabIds.includes(tab.id)) {
      // Reconoce si estamos en la ruta raíz del paseo del host o en el guest-hub
      return (
        location.pathname === `/paseo/${slug}` ||
        location.pathname === `/paseo/${slug}/guest-hub` ||
        location.pathname === "/"
      );
    }
    // Para las demás pantallas, comprobamos si la ruta incluye el identificador
    return location.pathname.includes(`/${tab.id}`);
  };

  const visibleTabs = isShortWithoutLogistics ? TABS.filter(t => t.id !== "logistica") : TABS;

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100"
      style={{
        boxShadow: "0 -4px 24px -4px rgba(15,23,42,0.08)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto px-1">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab);
          return (
            <button
              key={tab.id}
              id={`nav-${tab.id}`}
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
              onClick={() => {
                // Validación adicional de seguridad antes de navegar
                if (slug) {
                  navigate(tab.path);
                } else {
                  console.warn(
                    "Navegación abortada: No hay slug definido en el contexto."
                  );
                  navigate("/");
                }
              }}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-3 transition-all duration-200 cursor-pointer select-none"
            >
              <div
                className={`relative flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-200 ${
                  active ? "bg-orange-100" : "bg-transparent"
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={`transition-colors duration-200 ${
                    active ? "text-orange-500" : "text-slate-400"
                  }`}
                />
                {active && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full"
                    aria-hidden="true"
                  />
                )}
              </div>
              <span
                className={`text-[10px] font-semibold leading-none transition-colors duration-200 ${
                  active ? "text-orange-500" : "text-slate-400"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
