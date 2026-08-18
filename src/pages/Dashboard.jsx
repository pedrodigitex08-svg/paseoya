// pages/Dashboard.jsx - Panel de Control del Anfitrión + Menú Inferior
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePaseo } from "../store/usePaseoStore";
import {
  Copy,
  Check,
  Users,
  MapPin,
  DollarSign,
  Lock,
  Unlock,
  ShieldAlert,
} from "lucide-react";
import BottomNav from "../components/layout/BottomNav";

// Helper para formatear moneda
const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);

export default function Dashboard() {
  const { slug } = useParams();
  const navigate = useNavigate();
  // 🔄 Cambiamos deletePaseoFromCloud por updatePaseo
  const { state, loadPaseoFromCloud, updatePaseo } = usePaseo();
  const paseo = state.activePaseo;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isLocking, setIsLocking] = useState(false);

  // 🔒 Detectamos si el paseo ya fue cerrado
  const isLocked = paseo?.estado === "finalizado";

  useEffect(() => {
    let timeoutId;
    if (copied) {
      timeoutId = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
    return () => clearTimeout(timeoutId);
  }, [copied]);

  useEffect(() => {
    const fetchPaseo = async () => {
      if (!slug) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setNotFound(false);

        await loadPaseoFromCloud(slug);

        // Verificamos si después de la llamada a Supabase tenemos el paseo en el estado
        const currentState = usePaseo.getState().state;
        if (currentState.activePaseo) {
          setIsLoading(false);
        } else {
          setNotFound(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error obteniendo paseo:", error);
        setNotFound(true);
        setIsLoading(false);
      }
    };

    fetchPaseo();
  }, [slug, loadPaseoFromCloud]);

  if (isLoading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-bold animate-pulse">
          Cargando dashboard...
        </p>
      </div>
    );
  }

  if (notFound || !paseo) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">
          Plan no encontrado
        </h2>
        <p className="text-slate-500 font-medium">
          El paseo que buscas no existe o el enlace es incorrecto.
        </p>
      </div>
    );
  }

  const handleCopyLink = async () => {
    try {
      // Link explícito apuntando al invitado usando el slug del paseo
      const inviteLink = `${window.location.origin}/paseo/${slug}/invite`;
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  // 🔒 LÓGICA DEL CANDADO GLOBAL
  const handleToggleLock = async () => {
    const action = isLocked ? "reabrir" : "finalizar y bloquear";
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas ${action} este paseo?\n\n${
        !isLocked
          ? "Las cuentas se cerrarán para todos. Nadie podrá agregar más gastos y pasará a modo Solo Lectura."
          : "Los invitados volverán a poder agregar gastos y editar información."
      }`
    );
    if (!confirmed) return;

    setIsLocking(true);
    try {
      if (typeof updatePaseo === "function") {
        await updatePaseo(paseo.id, {
          estado: isLocked ? "activo" : "finalizado",
        });
      }
      setIsLocking(false);
    } catch (error) {
      console.error(`Error al ${action} el paseo:`, error);
      alert(`Hubo un error al intentar ${action} el paseo.`);
      setIsLocking(false);
    }
  };

  return (
    <div className="min-h-dvh bg-slate-50 pb-28 font-sans relative">
      {/* ── BANNER DE SOLO LECTURA ── */}
      {isLocked && (
        <div className="bg-slate-800 px-4 py-2.5 flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md">
          <Lock size={14} className="text-orange-400" />
          <span className="text-xs font-bold text-white tracking-wide uppercase">
            Plan Finalizado · Solo Lectura
          </span>
        </div>
      )}

      {/* ── HERO SECTION ── */}
      <div className="bg-white rounded-b-[2.5rem] shadow-sm overflow-hidden mb-8 relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-orange-400 to-rose-500 rounded-full blur-3xl opacity-10 pointer-events-none" />

        <div className="px-6 pt-14 pb-10 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 mb-5 shadow-inner">
            <span className="text-2xl">{paseo.emoji}</span>
          </div>

          <h2 className="text-sm font-extrabold text-orange-500 uppercase tracking-widest mb-1">
            ¡Hola, {paseo.createdBy || "Anfitrión"}!
          </h2>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
            Panel de control de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
              {paseo.name}
            </span>
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            El plan ya está creado. Comparte el enlace o gestiona la logística
            abajo.
          </p>
        </div>
      </div>

      <div className="px-5 space-y-6">
        {/* ── BOTÓN DE COMPARTIR ── */}
        <div className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <h3 className="font-extrabold text-slate-800 text-lg mb-2">
            ¡Es hora de invitar! 🚀
          </h3>
          <p className="text-xs text-slate-500 mb-6 px-4">
            Comparte este enlace por WhatsApp para que tus amigos confirmen
            asistencia y voten.
          </p>

          <button
            onClick={handleCopyLink}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-extrabold text-lg transition-all duration-300 active:scale-95 shadow-xl ${
              copied
                ? "bg-emerald-500 text-white shadow-emerald-500/30"
                : "bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-slate-900/30 hover:shadow-slate-900/40 hover:-translate-y-0.5"
            }`}
          >
            {copied ? (
              <>
                <Check size={22} className="animate-in zoom-in" />
                <span className="animate-in fade-in">¡Link copiado!</span>
              </>
            ) : (
              <>
                <Copy size={22} />
                <span>Copiar Link de Invitación</span>
              </>
            )}
          </button>
        </div>

        {/* ── RESUMEN RÁPIDO ── */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-3">
              <MapPin size={16} className="text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Destino Original
              </p>
              <p className="font-extrabold text-slate-800 text-sm truncate">
                {paseo.location ||
                  paseo.logistics?.destination ||
                  "Por definir"}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
              <DollarSign size={16} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Presupuesto
              </p>
              <p className="font-extrabold text-slate-800 text-sm">
                {formatCurrency(paseo.finance?.totalBudget || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* ── PARTICIPANTES CONFIRMADOS ── */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Users size={18} className="text-indigo-500" /> Confirmados
            </h3>
            <span className="bg-indigo-50 text-indigo-600 font-extrabold text-xs px-2 py-1 rounded-full">
              {paseo.participants?.length || 0}
            </span>
          </div>

          <div className="space-y-3">
            {paseo.participants?.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-inner">
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm">
                    {p.name} {p.id === "host_1" && "👑"}
                  </p>
                  <p className="text-xs text-emerald-500 font-medium">
                    ¡Asistencia confirmada!
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECCIÓN DE CONTROL (CANDADO) ── */}
        <div
          className={`p-5 rounded-3xl border shadow-sm mt-8 ${
            isLocked
              ? "bg-slate-50 border-slate-200"
              : "bg-white border-orange-100"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert
              size={18}
              className={isLocked ? "text-slate-500" : "text-orange-500"}
            />
            <h3
              className={`font-bold ${
                isLocked ? "text-slate-600" : "text-orange-600"
              }`}
            >
              Control del Plan
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            {isLocked
              ? "El paseo está finalizado. Nadie puede agregar gastos ni modificar la información de las vacas."
              : "Finalizar el paseo bloqueará la edición para todos los invitados. Úsalo cuando las cuentas estén saldadas y cerradas."}
          </p>
          <button
            onClick={handleToggleLock}
            disabled={isLocking}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all disabled:opacity-50 ${
              isLocked
                ? "border-2 border-slate-200 text-slate-600 hover:bg-slate-100"
                : "bg-orange-100 text-orange-600 hover:bg-orange-200"
            }`}
          >
            {isLocking ? (
              <span className="animate-pulse">Procesando...</span>
            ) : isLocked ? (
              <>
                <Unlock size={18} />
                <span>Reabrir Paseo (Emergencia)</span>
              </>
            ) : (
              <>
                <Lock size={18} />
                <span>Finalizar y Bloquear Cuentas</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── BARRA DE NAVEGACIÓN INFERIOR (Fija y accesible) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-lg">
        <BottomNav />
      </div>
    </div>
  );
}
