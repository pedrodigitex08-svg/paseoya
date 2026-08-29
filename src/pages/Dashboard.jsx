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
  Trash2,
  Link2,
  Backpack,
  Dices,
  Calendar
} from "lucide-react";
import { calculateDuration, formatDuration } from "../utils/dateUtils";
import BottomNav from "../components/layout/BottomNav";
import CountdownShareModal from "../components/CountdownShareModal";
import { Camera } from "lucide-react";
import { PackingModal } from "../components/modals/PackingModal";
import { RouletteModal } from "../components/modals/RouletteModal";

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
  const { state, loadPaseoFromCloud, updatePaseo, removeParticipant } = usePaseo();
  const paseo = state.activePaseo;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [showPacking, setShowPacking] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [showCountdownShare, setShowCountdownShare] = useState(false);

  // 🔒 Detectamos si el paseo ya fue cerrado
  const isLocked = paseo?.estado === "finalizado";

  let labelLocation = "Destino Original";
  let labelBudget = "Presupuesto";
  const isShortEvent = paseo?.category === "rumba" || paseo?.category === "restaurante" || paseo?.category === "asado" || paseo?.category === "regalo" || paseo?.category === "futbol";
  
  if (paseo?.category === "futbol") {
    labelLocation = "Cancha / Sede";
    labelBudget = "Costo Cancha + Árbitro";
  } else if (paseo?.category === "regalo") {
    labelLocation = "Lugar de entrega";
    labelBudget = "Meta del Regalo (Total)";
  } else if (paseo?.category === "asado") {
    labelLocation = "Destino / Lugar";
    labelBudget = "Presupuesto Carnes/Bebidas";
  } else if (isShortEvent) {
    labelLocation = "Lugar o ubicación";
    labelBudget = "Cover o Consumo estimado";
  }

  const rawVotingState = paseo?.votingState || {};
  const isVoting = rawVotingState.location?.isActive || rawVotingState.date?.isActive;
  
  const winnerDate =
    paseo?.tentativeDates?.length > 0
      ? [...paseo.tentativeDates].sort((a, b) => {
          const yesA = Object.values(paseo.votes?.dates?.[a.id] || {}).filter((v) => v === "yes").length;
          const yesB = Object.values(paseo.votes?.dates?.[b.id] || {}).filter((v) => v === "yes").length;
          return yesB - yesA;
        })[0]
      : null;

  const isSameDay = paseo?.isSameDay || false;
  const duration = isSameDay
    ? { days: 1, nights: 0 }
    : calculateDuration(winnerDate?.startDate || paseo?.fechaIda, winnerDate?.endDate || paseo?.fechaRegreso);

  const winningPlace =
    paseo?.places?.length > 0
      ? [...paseo.places].sort((a, b) => {
          const likesA = Object.values(paseo.votes?.places?.[a.id] || {}).filter((v) => v === "like").length;
          const likesB = Object.values(paseo.votes?.places?.[b.id] || {}).filter((v) => v === "like").length;
          return likesB - likesA;
        })[0]
      : null;

  const hasLikes = winningPlace
    ? Object.values(paseo?.votes?.places?.[winningPlace.id] || {}).some((v) => v === "like")
    : false;

  const confirmedLocation =
    (hasLikes ? winningPlace.location || winningPlace.name : null) ||
    paseo?.ubicacion ||
    paseo?.location ||
    paseo?.destination ||
    paseo?.city ||
    paseo?.place ||
    paseo?.places?.[0]?.location ||
    paseo?.places?.[0]?.name ||
    "Por definir";


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

          {/* BOTÓN DE CUENTA REGRESIVA */}
          <button
            onClick={() => setShowCountdownShare(true)}
            className="w-full bg-orange-100 text-orange-600 rounded-2xl py-3.5 mt-3 font-bold flex items-center justify-center gap-2 hover:bg-orange-200 transition-colors"
          >
            <Camera size={18} />
            Generar Cuenta Regresiva (IG)
          </button>
        </div>

        {/* 📍 PUNTO DE ENCUENTRO (Mapa + Clima) */}
        {confirmedLocation !== "Por definir" && !isVoting && (
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-between gap-4 mt-8 animate-in fade-in duration-300">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                <span className="text-2xl relative z-10">{['playa'].includes(paseo?.category) ? '☀️' : '⛅'}</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-200/50 to-transparent"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Destino confirmado</p>
                <p className="text-sm font-extrabold text-slate-800 truncate">{confirmedLocation}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">26°C · Clima ideal</p>
              </div>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(confirmedLocation)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all"
            >
              <span className="text-xl">🚗</span>
            </a>
          </div>
        )}

        {/* ⚡ RESUMEN RÁPIDO ⚡ */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-3">
              <MapPin size={16} className="text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                {labelLocation}
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
                {labelBudget}
              </p>
              <p className="font-extrabold text-slate-800 text-sm">
                {formatCurrency(paseo.finance?.totalBudget || 0)}
              </p>
            </div>
          </div>
          </div>

          {/* 📅 DURACIÓN (Días / Noches) */}
          {!isShortEvent && (
            <div className="bg-white mt-4 p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Calendar size={18} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Duración del plan
                </p>
                <p className="font-extrabold text-slate-800 text-sm">
                  {formatDuration(duration)}
                </p>
              </div>
            </div>
          )}

          {/* 👥 PARTICIPANTES CONFIRMADOS 👥 */}
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
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl relative group"
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
                                {p.id !== "host_1" && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}/paseo/${slug}/recover/${p.id}`;
                        const msg = `¡Hola ${p.name.split(' ')[0]}! 🏕️\n\nParece que se te cerró la sesión de PaseoYa. Toca este link mágico para recuperar tu perfil y volver al parche:\n\n${url}`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                      title="Enviar Link de Rescate"
                    >
                      <Link2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if(window.confirm(`¿Seguro que quieres eliminar a ${p.name}? Esto reajustará La Vaca para todos.`)) {
                          removeParticipant(p.id);
                        }
                      }}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Eliminar invitado"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 🎮 OPCIONES RÁPIDAS (Gamificación) */}
        <div className="mt-8 space-y-3">
          <h2 className="text-sm font-extrabold text-slate-800 mb-4 ml-1">Gamificación y Extras</h2>
          <button
            onClick={() => setShowPacking(true)}
            className="flex items-center gap-3 w-full p-4 bg-white rounded-2xl border border-slate-100 text-left transition-all duration-200 hover:shadow-md active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
              <Backpack size={18} className="text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-slate-800 text-sm">🎒 Mi Maleta</p>
              <p className="text-xs text-slate-500 mt-0.5">Checklist sugerido para no olvidar nada</p>
            </div>
          </button>
          
          <button
            onClick={() => setShowRoulette(true)}
            className="flex items-center gap-3 w-full p-4 bg-white rounded-2xl border border-slate-100 text-left transition-all duration-200 hover:shadow-md active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
              <Dices size={18} className="text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-slate-800 text-sm">🎲 Ruleta del Paseo</p>
              <p className="text-xs text-slate-500 mt-0.5">Gamifica las tareas y castigos</p>
            </div>
          </button>
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

      {showPacking && <PackingModal paseo={paseo} onClose={() => setShowPacking(false)} />}
      {showRoulette && <RouletteModal paseo={paseo} onClose={() => setShowRoulette(false)} />}

      {/* 📱 BARRA DE NAVEGACIÓN INFERIOR (Fija y accesible) 📱 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-lg">
        
      {showCountdownShare && (
        <CountdownShareModal
          paseo={paseo}
          winnerDate={winnerDate}
          onClose={() => setShowCountdownShare(false)}
        />
      )}

        <BottomNav />
      </div>
    </div>
  );
}
