// pages/GuestDashboard.jsx — PANTALLA 2: Dashboard Central
// Banner de paseo + % organización + stats + participantes + acceso rápido a pantallas.
// Lógica Camaleónica integrada para planes de Rumba/Restaurante.

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Users,
  CalendarDays,
  MapPin,
  Wallet,
  ChevronRight,
  Vote,
  ShoppingBasket,
  Link2,
  Crown,
  Plus,
  TrendingUp,
  PartyPopper,
  AlertCircle,
  Clock,
  Flame,
  Receipt,
} from "lucide-react";
import { usePaseo } from "../store/usePaseoStore";
import BottomNav from "../components/layout/BottomNav";

// ─────────────────────────────────────────────
// CONFIGURACIÓN DE COLORES
// ─────────────────────────────────────────────
const CATEGORY_STYLE = {
  playa: { from: "#38BDF8", to: "#2563EB", label: "Playa" },
  finca: { from: "#4ADE80", to: "#059669", label: "Finca" },
  montana: { from: "#94A3B8", to: "#44403C", label: "Montaña" },
  ciudad: { from: "#A78BFA", to: "#7C3AED", label: "Ciudad" },
  rumba: { from: "#F472B6", to: "#E11D48", label: "Rumba / Bar" },
  restaurante: { from: "#FB923C", to: "#EA580C", label: "Restaurante" },
};

// ─────────────────────────────────────────────
// FUNCIONES DE CÁLCULO
// ─────────────────────────────────────────────
function calcOrgPercentage(paseo) {
  if (!paseo) return 0;
  let score = 0;
  if (paseo.name) score += 20;
  if (paseo.tentativeDates?.some((d) => d.startDate)) score += 20;
  if (paseo.places?.length > 0) score += 20;
  if (paseo.participants?.length >= 2) score += 20;
  if (
    paseo.finance?.totalBudget > 0 ||
    paseo.category === "rumba" ||
    paseo.category === "restaurante"
  )
    score += 20;
  return score;
}

function calcRecaudo(paseo) {
  if (!paseo || !paseo.participants || paseo.finance?.totalBudget === 0)
    return 0;
  const paid = paseo.participants.filter(
    (p) => p.hasPaid && p.status !== "cancelled"
  ).length;
  const total = paseo.participants.filter(
    (p) => p.status !== "cancelled"
  ).length;
  return total === 0 ? 0 : Math.round((paid / total) * 100);
}

const MONTHS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

function parseDateParts(str) {
  if (!str) return null;
  const [y, m, d] = str.split("-");
  return {
    day: parseInt(d),
    month: MONTHS[parseInt(m) - 1],
    year: parseInt(y),
  };
}

function formatSingleDate(str) {
  const p = parseDateParts(str);
  if (!p) return "—";
  return `${p.day} ${p.month} ${p.year}`;
}

function formatDateRange(dateObj, isSameDay) {
  if (!dateObj || !dateObj.startDate) return "Sin fecha aún";
  const start = parseDateParts(dateObj.startDate);
  const end = parseDateParts(dateObj.endDate);
  if (!start) return "—";
  if (isSameDay || !dateObj.endDate || dateObj.endDate === dateObj.startDate) {
    return `${start.day} ${start.month} ${start.year}`;
  }
  if (start.month === end?.month) {
    return `${start.day} – ${end.day} ${end.month} ${end.year}`;
  }
  return `${start.day} ${start.month} – ${end?.day} ${end?.month}`;
}

// ─────────────────────────────────────────────
// MOTOR DE HYPE (Versión Inclusiva y Familiar)
// ─────────────────────────────────────────────
function getHypeMessage(paseo, winnerDate, recaudoPct, isShortEvent) {
  if (!paseo) return null;

  const rawVotingState = paseo.votingState || {};
  const isVoting =
    rawVotingState.location?.isActive || rawVotingState.date?.isActive;

  if (isVoting) {
    return {
      icon: Flame,
      title: "¡El plan está tomando forma!",
      text: "Las votaciones están abiertas. ¡Entra y decide los detalles de la salida!",
      color: "text-orange-600",
      bg: "bg-orange-100",
      border: "border-orange-200",
    };
  }

  if (winnerDate && winnerDate.startDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [year, month, day] = winnerDate.startDate.split("-");
    const start = new Date(year, month - 1, day);
    start.setHours(0, 0, 0, 0);

    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return {
        icon: PartyPopper,
        title: "¡Mañana nos vemos!",
        text: "Pon la alarma y prepárate. ¡Qué emoción! 🚀",
        color: "text-fuchsia-600",
        bg: "bg-fuchsia-100",
        border: "border-fuchsia-200",
      };
    } else if (diffDays > 1 && diffDays <= 7) {
      if (recaudoPct < 100 && !isShortEvent) {
        return {
          icon: AlertCircle,
          title: `¡Faltan solo ${diffDays} días!`,
          text: "Aún hay aportes pendientes en la vaca 👀. ¡Es hora de ponerse al día!",
          color: "text-rose-600",
          bg: "bg-rose-100",
          border: "border-rose-200",
        };
      } else {
        return {
          icon: PartyPopper,
          title: `¡A ${diffDays} días del encuentro!`,
          text: "Todo organizado. ¡Solo nos falta disfrutar! ✅",
          color: "text-emerald-600",
          bg: "bg-emerald-100",
          border: "border-emerald-200",
        };
      }
    } else if (diffDays > 7) {
      return {
        icon: Clock,
        title: `Faltan ${diffDays} días para vernos`,
        text: "Ve organizando tu tiempo y separando el presupuesto 🎒",
        color: "text-blue-600",
        bg: "bg-blue-100",
        border: "border-blue-200",
      };
    } else if (diffDays <= 0) {
      return {
        icon: PartyPopper,
        title: "¡Llegó el gran día!",
        text: "¡A disfrutar del momento y crear muy buenos recuerdos! 📸",
        color: "text-indigo-600",
        bg: "bg-indigo-100",
        border: "border-indigo-200",
      };
    }
  }

  return {
    icon: Clock,
    title: "Armando el plan...",
    text: "Faltan algunos detallitos para cuadrar todo.",
    color: "text-slate-600",
    bg: "bg-slate-100",
    border: "border-slate-200",
  };
}

// ─────────────────────────────────────────────
// COMPONENTES MENORES
// ─────────────────────────────────────────────
function CircularProgress({
  value = 0,
  size = 84,
  stroke = 9,
  color = "#F97316",
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const cx = size / 2;
  return (
    <svg width={size} height={size} aria-label={`${value}% organizado`}>
      <circle
        cx={cx}
        cy={cx}
        r={r}
        stroke="#E2E8F0"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={cx}
        cy={cx}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{
          transition: "stroke-dashoffset 0.9s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      <text
        x="50%"
        y="46%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#FFFFFF"
        fontSize="18"
        fontWeight="800"
        fontFamily="inherit"
      >
        {value}%
      </text>
      <text
        x="50%"
        y="66%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#FFFFFF"
        fontSize="9"
        fontWeight="600"
        fontFamily="inherit"
      >
        LISTO
      </text>
    </svg>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-2 p-4 bg-white rounded-2xl border border-slate-100 text-left w-full transition-all duration-200 hover:shadow-md active:scale-95 cursor-pointer"
      style={{ boxShadow: "0 2px 12px -2px rgba(15,23,42,0.07)" }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: `${color}18` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-xl font-extrabold text-slate-900 leading-none">
          {value}
        </p>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-slate-300 mt-0.5">{sub}</p>}
      </div>
    </button>
  );
}

function ParticipantBubble({ participant }) {
  const initials = participant.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const statusColors = {
    confirmed: "#22C55E",
    pending: "#F59E0B",
    cancelled: "#EF4444",
  };
  const bgColors = [
    "#FED7AA",
    "#BBF7D0",
    "#BAE6FD",
    "#DDD6FE",
    "#FBCFE8",
    "#FEF08A",
    "#CCFBF1",
    "#E9D5FF",
  ];
  const bg = bgColors[participant.name.charCodeAt(0) % bgColors.length];

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-slate-700"
          style={{ background: bg }}
        >
          {initials}
        </div>
        <span
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
          style={{ background: statusColors[participant.status] || "#94A3B8" }}
        />
        {participant.role === "host" && (
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs">
            👑
          </span>
        )}
      </div>
      <span className="text-[10px] font-semibold text-slate-500 max-w-[44px] truncate text-center leading-tight">
        {participant.name.split(" ")[0]}
      </span>
    </div>
  );
}

function QuickAction({ icon: Icon, label, sublabel, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-4 bg-white rounded-2xl border border-slate-100 text-left transition-all duration-200 hover:shadow-md active:scale-95"
      style={{ boxShadow: "0 2px 12px -2px rgba(15,23,42,0.06)" }}
    >
      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-orange-500" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-slate-800">{label}</p>
        <p className="text-xs text-slate-400">{sublabel}</p>
      </div>
      {badge && (
        <span className="text-xs font-bold text-white bg-orange-500 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />
    </button>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function GuestDashboard() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { state, loadPaseoFromCloud, generateLink } = usePaseo();

  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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

  // 🔥 BLINDAJE DE RENDERIZADO: Evita la pantalla en blanco
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-bold animate-pulse">
          Cargando paseo...
        </p>
      </div>
    );
  }

  const paseo = state.activePaseo;

  if (notFound || !paseo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
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

  // 🦎 LÓGICA CAMALEÓNICA (Restaurante/Rumba vs Paseo Regular)
  const isShortEvent =
    paseo.category === "rumba" || paseo.category === "restaurante";
  const catStyle = CATEGORY_STYLE[paseo.category] || CATEGORY_STYLE.finca;
  const orgPct = calcOrgPercentage(paseo);
  const recaudoPct = calcRecaudo(paseo);
  const confirmed =
    paseo.participants?.filter((p) => p.status === "confirmed").length || 0;
  const total = paseo.participants?.length || 0;
  const pendingCount =
    paseo.participants?.filter((p) => p.status === "pending").length || 0;
  const shareLink = generateLink ? generateLink(paseo) : window.location.href;

  const rawVotingState = paseo?.votingState || {};
  const locationVoting = rawVotingState.location || { isActive: false };
  const dateVoting = rawVotingState.date || { isActive: false };
  const isSameDay = paseo.isSameDay || false;

  const winnerDate = [...(paseo.tentativeDates || [])].sort((a, b) => {
    const yesA = Object.values(paseo.votes?.dates?.[a.id] || {}).filter(
      (v) => v === "yes"
    ).length;
    const yesB = Object.values(paseo.votes?.dates?.[b.id] || {}).filter(
      (v) => v === "yes"
    ).length;
    return yesB - yesA;
  })[0];

  const winnerVotes = winnerDate
    ? Object.values(paseo.votes?.dates?.[winnerDate.id] || {}).filter(
        (v) => v === "yes"
      ).length
    : 0;

  const winningPlace =
    paseo.places?.length > 0
      ? [...paseo.places].sort((a, b) => {
          const likesA = Object.values(
            paseo.votes?.places?.[a.id] || {}
          ).filter((v) => v === "like").length;
          const likesB = Object.values(
            paseo.votes?.places?.[b.id] || {}
          ).filter((v) => v === "like").length;
          return likesB - likesA;
        })[0]
      : null;

  const hasLikes = winningPlace
    ? Object.values(paseo.votes?.places?.[winningPlace.id] || {}).some(
        (v) => v === "like"
      )
    : false;

  const confirmedLocation =
    (hasLikes ? winningPlace.location || winningPlace.name : null) ||
    paseo.ubicacion ||
    paseo.location ||
    paseo.destination ||
    paseo.city ||
    paseo.place ||
    paseo.places?.[0]?.location ||
    paseo.places?.[0]?.name ||
    "Por definir";

  const formatDate = (str) => {
    if (!str) return "—";
    const [y, m, d] = str.split("-");
    return `${d} ${MONTHS[parseInt(m) - 1]}`;
  };

  const heroBannerDate = formatDateRange(winnerDate, isSameDay);
  const hype = getHypeMessage(paseo, winnerDate, recaudoPct, isShortEvent);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      alert("¡Enlace copiado!");
    } catch {
      prompt("Copia este enlace:", shareLink);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* ── HERO BANNER ──────────────────── */}
      <div
        className="relative overflow-hidden px-5 pt-14 pb-6"
        style={{
          background: `linear-gradient(135deg, ${catStyle.from} 0%, ${catStyle.to} 100%)`,
        }}
      >
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <span className="text-orange-500/90 text-xl font-black tracking-wide drop-shadow-md">
            {paseo.emoji} PaseoYa
          </span>
        </div>
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: "white", transform: "translate(30%, -30%)" }}
        />

        <div className="flex items-start justify-between mb-5 relative mt-4">
          <div className="flex-1 min-w-0 pr-4">
            <span className="text-white/70 text-xs font-bold uppercase tracking-widest">
              {isShortEvent ? "MOTIVO" : "NOMBRE DEL PASEO"}
            </span>
            <h1 className="text-white text-2xl font-extrabold leading-tight mt-0.5 truncate">
              {paseo.emoji} {paseo.name}
            </h1>
            <p className="text-white/90 text-sm mt-1">
              Organiza:{" "}
              <span className="font-extrabold">{paseo.createdBy}</span>
            </p>
          </div>
          <CircularProgress
            value={orgPct}
            color={isShortEvent ? "#F472B6" : "#F97316"}
          />
        </div>

        <div className="flex flex-col gap-2 relative mt-2">
          <div className="flex items-center justify-between bg-black/15 rounded-xl px-3 py-2.5 w-full backdrop-blur-sm">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin size={16} className="text-white flex-shrink-0" />
              <span className="text-sm font-bold text-white truncate">
                {confirmedLocation}
              </span>
            </div>
            {locationVoting.isActive ? (
              <span className="text-[10px] font-extrabold bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full ml-2 shadow-sm flex-shrink-0">
                ⏳ En votación
              </span>
            ) : (
              <span className="text-[10px] font-extrabold bg-green-400 text-green-950 px-2 py-0.5 rounded-full ml-2 shadow-sm flex-shrink-0">
                ✅ Confirmado
              </span>
            )}
          </div>
          <div className="flex items-center justify-between bg-black/15 rounded-xl px-3 py-2.5 w-full backdrop-blur-sm">
            <div className="flex items-center gap-2 min-w-0">
              <CalendarDays size={16} className="text-white flex-shrink-0" />
              <span className="text-sm font-bold text-white truncate">
                {heroBannerDate}
              </span>
              {isSameDay && (
                <span className="text-[9px] font-extrabold text-orange-600 bg-white px-1.5 py-0.5 rounded flex-shrink-0">
                  PASADÍA
                </span>
              )}
            </div>
            {dateVoting.isActive ? (
              <span className="text-[10px] font-extrabold bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full ml-2 shadow-sm flex-shrink-0">
                ⏳ En votación
              </span>
            ) : (
              <span className="text-[10px] font-extrabold bg-green-400 text-green-950 px-2 py-0.5 rounded-full ml-2 shadow-sm flex-shrink-0">
                ✅ Confirmada
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 space-y-5 mt-5">
        {/* ── 🔥 HYPE BANNER ──────────────────── */}
        {hype && (
          <div
            className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${hype.bg} ${hype.border}`}
          >
            <div className={`mt-0.5 ${hype.color}`}>
              <hype.icon size={22} />
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-extrabold ${hype.color}`}>
                {hype.title}
              </h3>
              <p
                className={`text-xs font-medium mt-0.5 ${hype.color} opacity-90 leading-snug`}
              >
                {hype.text}
              </p>
            </div>
          </div>
        )}

        {/* ── STAT CARDS GRID ──────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={Users}
            label="Confirmados"
            value={`${confirmed}/${total}`}
            sub={
              pendingCount > 0
                ? `${pendingCount} pendientes`
                : "Todos listos 🎉"
            }
            color="#F97316"
            onClick={() => {}}
          />
          <StatCard
            icon={isShortEvent ? Receipt : Wallet}
            label={isShortEvent ? "Cuenta / Base" : "Recaudado"}
            value={
              isShortEvent
                ? paseo.finance?.totalBudget > 0
                  ? `$${(paseo.finance.totalBudget / 1000).toFixed(0)}K`
                  : "--"
                : `${recaudoPct}%`
            }
            sub={
              isShortEvent
                ? "Consumo estimado"
                : paseo.finance?.totalBudget > 0
                ? `Meta: $${(paseo.finance.totalBudget / 1000).toFixed(0)}K`
                : "Sin presupuesto aún"
            }
            color="#0D9488"
            onClick={() => navigate(`/paseo/${slug}/vaca`)}
          />
          <StatCard
            icon={Vote}
            label="Fechas propuestas"
            value={winnerVotes > 0 ? `${winnerVotes} Sí` : "Sin votos"}
            sub={
              winnerDate?.startDate
                ? `Líder: ${formatDate(winnerDate.startDate)}`
                : "A votar →"
            }
            color="#8B5CF6"
            onClick={() => navigate(`/paseo/${slug}/votar`)}
          />
          <StatCard
            icon={MapPin}
            label={isShortEvent ? "Lugares sugeridos" : "Lugares y fechas"}
            value={paseo.places?.length > 0 ? paseo.places.length : "Sugerir"}
            sub={paseo.places?.length > 0 ? "En votación" : "Ninguno aún"}
            color="#EC4899"
            onClick={() => navigate(`/paseo/${slug}/votar`)}
          />
        </div>

        {/* ── PARTICIPANTES ──────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-extrabold text-slate-800">Grupo</h2>
            <button
              onClick={() => {}}
              className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-colors"
            >
              <Plus size={12} /> Invitar
            </button>
          </div>
          <div
            className="bg-white rounded-2xl border border-slate-100 p-4"
            style={{ boxShadow: "0 2px 12px -2px rgba(15,23,42,0.06)" }}
          >
            <div className="flex gap-3 overflow-x-auto pb-1">
              {paseo.participants?.map((p) => (
                <ParticipantBubble key={p.id} participant={p} />
              ))}
            </div>

            {!isShortEvent && (
              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                    {confirmed} confirmados
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all duration-700"
                      style={{ width: `${recaudoPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-teal-600">
                    {recaudoPct}% pagó
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── ACCIONES RÁPIDAS (CAMALEÓNICAS) ────────── */}
        <section>
          <h2 className="text-base font-extrabold text-slate-800 mb-3">
            Opciones
          </h2>
          <div className="space-y-2.5">
            <QuickAction
              icon={Vote}
              label="Ir a Votaciones"
              sublabel={`${paseo.tentativeDates?.length || 0} fechas · ${
                paseo.places?.length || 0
              } lugares propuestos`}
              badge={paseo.tentativeDates?.length > 0 ? "¡Votar!" : null}
              onClick={() => navigate(`/paseo/${slug}/votar`)}
            />

            {!isShortEvent && (
              <QuickAction
                icon={ShoppingBasket}
                label="Logística y Transporte"
                sublabel="Ingredientes, carros y buseta"
                onClick={() => navigate(`/paseo/${slug}/logistica`)}
              />
            )}

            <QuickAction
              icon={isShortEvent ? Receipt : Wallet}
              label={isShortEvent ? "Dividir la Cuenta" : "La Vaca"}
              sublabel={
                isShortEvent
                  ? "Registra gastos y divide la factura final"
                  : "Define el presupuesto y recauda"
              }
              onClick={() => navigate(`/paseo/${slug}/vaca`)}
            />

            <QuickAction
              icon={Link2}
              label="Compartir enlace"
              sublabel="Invita al grupo por WhatsApp"
              onClick={handleCopyLink}
            />
          </div>
        </section>

        {/* ── PROGRESO DE ORGANIZACIÓN (CAMALEÓNICO) ──── */}
        <section
          className="p-4 rounded-2xl border border-slate-100"
          style={{
            background: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
            boxShadow: "0 2px 12px -2px rgba(15,23,42,0.06)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={15} className="text-slate-400" />
            <h3 className="text-sm font-bold text-slate-600">Checklist</h3>
          </div>
          <div className="space-y-2">
            {[
              { done: !!paseo.name, label: "Evento creado", action: null },
              {
                done: paseo.tentativeDates?.some((d) => d.startDate),
                label: "Fecha definida",
                action: `/paseo/${slug}/votar`,
              },
              {
                done: paseo.places?.length > 0,
                label: "Lugar confirmado",
                action: `/paseo/${slug}/votar`,
              },
              {
                done: paseo.participants?.length >= 2,
                label: "Grupo invitado",
                action: null,
              },
              {
                done: isShortEvent ? false : paseo.finance?.totalBudget > 0,
                label: isShortEvent
                  ? "Dividir gastos al final"
                  : "Presupuesto y Vaca listos",
                action: `/paseo/${slug}/vaca`,
              },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => item.action && navigate(item.action)}
                className={`flex items-center gap-3 w-full text-left ${
                  item.action ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                    item.done
                      ? "bg-green-500 text-white"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {item.done ? "✓" : i + 1}
                </div>
                <span
                  className={`text-xs font-semibold flex-1 ${
                    item.done ? "text-slate-400 line-through" : "text-slate-700"
                  }`}
                >
                  {item.label}
                </span>
                {!item.done && item.action && (
                  <ChevronRight size={13} className="text-slate-300" />
                )}
              </button>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Progreso
              </span>
              <span
                className={`text-sm font-extrabold ${
                  isShortEvent ? "text-pink-500" : "text-orange-500"
                }`}
              >
                {orgPct}%
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${orgPct}%`,
                  background: isShortEvent
                    ? "linear-gradient(90deg, #F472B6, #E11D48)"
                    : "linear-gradient(90deg, #F97316, #FBBF24)",
                }}
              />
            </div>
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
