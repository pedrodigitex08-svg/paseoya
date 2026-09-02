// pages/Voting.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Plus,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  XCircle,
  Crown,
  ChevronLeft,
  Sparkles,
  X,
} from "lucide-react";
import { usePaseo } from "../store/usePaseoStore";
import BottomNav from "../components/layout/BottomNav";
import Button from "../components/ui/Button";
import { CurrencyInput } from "../components/ui/CurrencyInput";

// ─────────────────────────────────────────────
// HELPERS

const AvatarList = ({ userIds, participants }) => {
  if (!userIds || userIds.length === 0 || !participants) return null;
  return (
    <div className="flex -space-x-1.5 mt-1">
      {userIds.map(id => {
        const p = participants.find(x => x.id === id);
        if (!p) return null;
        return (
          <div
            key={id}
            className="w-5 h-5 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[8px] font-bold text-slate-600 shadow-sm"
            title={p.name}
          >
            {p.name.charAt(0).toUpperCase()}
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────
const formatDate = (str) => {
  if (!str) return "—";
  const [y, m, d] = str.split("-");
  const months = [
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
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
};

const formatCOP = (n) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);

// ─────────────────────────────────────────────
// DATE VOTE CARD
// ─────────────────────────────────────────────
function DateVoteCard({
  date,
  votes,
  userVote,
  totalParticipants,
  participants,
  isLeader,
  isWinner,
  isVotingLocked,
  onVote,
}) {
  const totalVotes = votes.yes + votes.no;
  const yesWidth =
    totalVotes > 0 ? Math.round((votes.yes / totalVotes) * 100) : 0;
  const noWidth =
    totalVotes > 0 ? Math.round((votes.no / totalVotes) * 100) : 0;
  const dateRange =
    date.endDate && date.endDate !== date.startDate
      ? `${formatDate(date.startDate)} – ${formatDate(date.endDate)}`
      : formatDate(date.startDate);

  return (
    <div
      className={`rounded-2xl border-2 overflow-hidden transition-all duration-200 ${
        isWinner
          ? "border-amber-400 ring-4 ring-amber-400/20"
          : isLeader
          ? "border-amber-400"
          : "border-slate-100"
      }`}
      style={{
        boxShadow:
          isLeader || isWinner
            ? "0 4px 20px -4px rgba(251,191,36,0.35)"
            : "0 2px 12px -2px rgba(15,23,42,0.07)",
      }}
    >
      <div
        className={`px-4 py-3 flex items-center justify-between ${
          isWinner || isLeader
            ? "bg-gradient-to-r from-amber-400 to-orange-400"
            : "bg-white border-b border-slate-50"
        }`}
      >
        <div className="flex items-center gap-2">
          {(isWinner || isLeader) && <Crown size={14} className="text-white" />}
          <CalendarDays
            size={15}
            className={isWinner || isLeader ? "text-white" : "text-orange-500"}
          />
          <span
            className={`font-extrabold text-sm ${
              isWinner || isLeader ? "text-white" : "text-slate-800"
            }`}
          >
            {dateRange}
          </span>
        </div>
        {isWinner ? (
          <span className="text-[10px] font-bold text-slate-800 bg-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            🏆 Ganadora
          </span>
        ) : isLeader ? (
          <span className="text-[10px] font-bold text-white/90 bg-white/20 px-2 py-0.5 rounded-full">
            👑 Favorita
          </span>
        ) : null}
      </div>

      <div className="px-4 pt-3 pb-1 bg-white space-y-2">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-green-600 flex items-center gap-1">
              <CheckCircle2 size={11} /> Sí
            </span>
            <span className="text-[11px] font-bold text-slate-500">
              {votes.yes} voto{votes.yes !== 1 ? "s" : ""} · {yesWidth}%
            </span>
          </div>
          <AvatarList userIds={votes.yesUsers} participants={participants} />
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-1.5">
            <div
              className="h-full bg-green-400 rounded-full transition-all duration-500"
              style={{ width: `${yesWidth}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-red-500 flex items-center gap-1">
              <XCircle size={11} /> No
            </span>
            <span className="text-[11px] font-bold text-slate-500">
              {votes.no} voto{votes.no !== 1 ? "s" : ""} · {noWidth}%
            </span>
          </div>
          <AvatarList userIds={votes.noUsers} participants={participants} />
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-1.5">
            <div
              className="h-full bg-red-400 rounded-full transition-all duration-500"
              style={{ width: `${noWidth}%` }}
            />
          </div>
        </div>

        <p className="text-[10px] text-slate-300 text-right pb-1">
          {totalVotes} de {totalParticipants} participantes votaron
        </p>
      </div>

      {!isVotingLocked && (
        <div className="flex border-t border-slate-100">
          <button
            onClick={() => onVote(date.id, "yes")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-bold transition-all duration-200 active:scale-95 ${
              userVote === "yes"
                ? "bg-green-500 text-white"
                : "bg-white text-slate-500 hover:bg-green-50 hover:text-green-600"
            }`}
          >
            <CheckCircle2 size={16} />
            {userVote === "yes" ? "Votado ✓" : "Sí puedo"}
          </button>

          <div className="w-px bg-slate-100" />

          <button
            onClick={() => onVote(date.id, "no")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-bold transition-all duration-200 active:scale-95 ${
              userVote === "no"
                ? "bg-red-500 text-white"
                : "bg-white text-slate-500 hover:bg-red-50 hover:text-red-500"
            }`}
          >
            <XCircle size={16} />
            {userVote === "no" ? "Votado ✓" : "No puedo"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PLACE VOTE CARD
// ─────────────────────────────────────────────
const PLACE_COLORS = [
  { from: "#F97316", to: "#FBBF24" },
  { from: "#10B981", to: "#0D9488" },
  { from: "#8B5CF6", to: "#EC4899" },
  { from: "#3B82F6", to: "#06B6D4" },
  { from: "#EF4444", to: "#F97316" },
];

function PlaceVoteCard({
  place,
  votes,
  userVote,
  index,
  isWinner,
  isVotingLocked,
  onVote,
  onRemove,
  participants,
}) {
  const colors = PLACE_COLORS[index % PLACE_COLORS.length];
  const totalVotes = votes.likes + votes.dislikes;

  return (
    <div
      className={`rounded-2xl overflow-hidden border transition-all duration-200 ${
        isWinner
          ? "border-amber-400 ring-4 ring-amber-400/20"
          : "border-slate-100"
      }`}
      style={{ boxShadow: "0 2px 16px -4px rgba(15,23,42,0.10)" }}
    >
      <div
        className="relative px-4 py-5"
        style={{
          background: place.imageUrl 
            ? `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.9)), url(${place.imageUrl})`
            : isWinner
            ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
            : `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {!isVotingLocked && (
          <button
            onClick={() => onRemove(place.id)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
          >
            <X size={13} className="text-white" />
          </button>
        )}

        {isWinner && (
          <div className="absolute top-3 right-3 bg-white text-amber-500 text-xs font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            🏆 Ganadora
          </div>
        )}

        <div className="flex items-start gap-3">
          <span className="text-4xl leading-none">{place.emoji}</span>
          <div className="flex-1 min-w-0 pr-16">
            <h3 className="text-white font-extrabold text-lg leading-tight">
              {place.name}
            </h3>
            {place.location && (
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={11} className="text-white/70" />
                <span className="text-white/80 text-xs">{place.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white px-4 py-3">
        {place.link && (
          <a 
            href={place.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mb-2.5 text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors"
          >
            <Link2 size={12} /> Ver alojamiento ↗
          </a>
        )}
        <p className="text-slate-500 text-sm leading-relaxed">
          {place.description}
        </p>

        {place.budget > 0 && (
          <div className="flex items-center gap-2 mt-2.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Presupuesto estimado:
            </span>
            <span className="text-sm font-extrabold text-teal-600">
              {formatCOP(place.budget)}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-50">
          <div className="flex items-center gap-1.5">
            <ThumbsUp size={13} className="text-green-500" />
            <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
              {votes.likes}
              <AvatarList userIds={votes.likesUsers} participants={participants} />
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <ThumbsDown size={13} className="text-red-400" />
            <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
              {votes.dislikes}
              <AvatarList userIds={votes.dislikesUsers} participants={participants} />
            </span>
          </div>
          <span className="text-[10px] text-slate-300 flex-1 text-right">
            {totalVotes} voto{totalVotes !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {!isVotingLocked && (
        <div className="flex border-t border-slate-100">
          <button
            onClick={() => onVote(place.id, "like")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all duration-200 active:scale-95 ${
              userVote === "like"
                ? "bg-green-500 text-white"
                : "bg-white text-slate-500 hover:bg-green-50 hover:text-green-600"
            }`}
          >
            <ThumbsUp size={16} />
            {userVote === "like" ? "Te gusta ✓" : "Me gusta"}
          </button>
          <div className="w-px bg-slate-100" />
          <button
            onClick={() => onVote(place.id, "dislike")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all duration-200 active:scale-95 ${
              userVote === "dislike"
                ? "bg-red-500 text-white"
                : "bg-white text-slate-500 hover:bg-red-50 hover:text-red-500"
            }`}
          >
            <ThumbsDown size={16} />
            {userVote === "dislike" ? "No te gusta ✓" : "No me gusta"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SUGGEST DATE FORM
// ─────────────────────────────────────────────
function SuggestDateForm({ onSubmit, onCancel }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [duration, setDuration] = useState(86400000);

  const handleSubmit = () => {
    if (!start) return;
    onSubmit({ startDate: start, endDate: end || start }, duration);
    setStart("");
    setEnd("");
  };

  return (
    <div className="bg-white border-2 border-orange-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
          <Sparkles size={14} className="text-orange-500" />
          Sugiere una fecha alternativa
        </h4>
        <button
          onClick={onCancel}
          className="text-slate-300 hover:text-slate-500 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      <p className="text-slate-400 text-[11px] leading-tight mt-1">
        💡 Al iniciar, el grupo tendrá un tiempo límite para votar. La opción
        ganadora se actualizará automáticamente en el paseo y en La Vaca.
      </p>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
            Fecha inicio <span className="text-orange-500">*</span>
          </label>
          <input
            type="date"
            value={start}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setStart(e.target.value)}
            className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-orange-400 transition-colors"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
            Fecha fin (opcional)
          </label>
          <input
            type="date"
            value={end}
            min={start || new Date().toISOString().split("T")[0]}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-orange-400 transition-colors"
          />
        </div>
      </div>

      <div className="mt-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
          Duración de la votación
        </label>
        <p className="text-[10px] text-slate-400 mb-2">
          ⏳ Define cuánto tiempo tiene el grupo para decidir.
        </p>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-orange-400 transition-colors bg-white"
        >
          <option value={3600000}>1 Hora</option>
          <option value={86400000}>1 Día</option>
          <option value={432000000}>5 Días</option>
          <option value={864000000}>10 Días</option>
          <option value={1296000000}>15 Días</option>
          <option value={2592000000}>30 Días</option>
        </select>
      </div>

      <Button
        variant="primary"
        fullWidth
        size="md"
        disabled={!start}
        onClick={handleSubmit}
        icon={Plus}
      >
        Iniciar Votación
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ADD PLACE FORM
// ─────────────────────────────────────────────
const PLACE_EMOJIS = [
  "🏡",
  "🌲",
  "🌊",
  "🏖️",
  "⛰️",
  "🏕️",
  "🎪",
  "🌄",
  "🏞️",
  "🏰",
];

function AddPlaceForm({ onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🏡");
  const [description, setDesc] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");
  const [isExtractingImage, setIsExtractingImage] = useState(false);
  const [duration, setDuration] = useState(86400000);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    
    let imageUrl = null;
    if (link.trim()) {
      setIsExtractingImage(true);
      try {
        const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(link.trim())}`);
        const data = await res.json();
        if (data.status === 'success' && data.data?.image?.url) {
          imageUrl = data.data.image.url;
        }
      } catch (e) {
        console.error("Error fetching microlink:", e);
      }
      setIsExtractingImage(false);
    }

    onSubmit(
      {
        name: name.trim(),
        emoji,
        description: description.trim(),
        budget: parseInt(budget.replace(/\D/g, "")) || 0,
        location: location.trim(),
        link: link.trim(),
        imageUrl: imageUrl,
      },
      duration
    );
    setName("");
    setDesc("");
    setBudget("");
    setLocation("");
    setLink("");
  };

  return (
    <div className="bg-white border-2 border-teal-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
          <MapPin size={14} className="text-teal-600" />
          Proponer un lugar
        </h4>
        <button
          onClick={onCancel}
          className="text-slate-300 hover:text-slate-500 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      <p className="text-slate-400 text-[11px] leading-tight mt-1">
        💡 Al iniciar, el grupo tendrá un tiempo límite para votar. La opción
        ganadora se actualizará automáticamente en el paseo y en La Vaca.
      </p>

      <div className="mt-3">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-2">
          Ícono
        </label>
        <div className="flex flex-wrap gap-2">
          {PLACE_EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all active:scale-90 ${
                emoji === e
                  ? "bg-teal-100 ring-2 ring-teal-400"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
          Nombre del lugar <span className="text-orange-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Finca Villa Paz"
          maxLength={60}
          className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-teal-400 transition-colors placeholder:text-slate-300"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
            Ubicación
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ej: La Ceja"
            maxLength={40}
            className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-teal-400 transition-colors placeholder:text-slate-300"
          />
        </div>

      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
          Link de Airbnb / Booking (Opcional)
        </label>
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://www.airbnb.com/rooms/..."
          className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-teal-400 transition-colors placeholder:text-slate-300"
        />
      </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
            Presupuesto $
          </label>
          <CurrencyInput
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="500000"
            className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-teal-400 transition-colors placeholder:text-slate-300"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Piscina, BBQ, capacidad para 15 personas..."
          rows={2}
          maxLength={120}
          className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-teal-400 transition-colors resize-none placeholder:text-slate-300"
        />
      </div>

      <div className="mt-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
          Duración de la votación
        </label>
        <p className="text-[10px] text-slate-400 mb-2">
          ⏳ Define cuánto tiempo tiene el grupo para decidir.
        </p>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-teal-400 transition-colors bg-white"
        >
          <option value={3600000}>1 Hora</option>
          <option value={86400000}>1 Día</option>
          <option value={432000000}>5 Días</option>
          <option value={864000000}>10 Días</option>
          <option value={1296000000}>15 Días</option>
          <option value={2592000000}>30 Días</option>
        </select>
      </div>

      <Button
        variant="secondary"
        fullWidth
        size="md"
        disabled={!name.trim()}
        onClick={handleSubmit}
        icon={Plus}
      >
        Iniciar Votación
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function Voting() {
  const navigate = useNavigate();
  const {
    state,
    updatePaseo,
    voteDate,
    votePlace,
    getDateVotes,
    getUserDateVote,
    getPlaceVotes,
    getUserPlaceVote,
    removePlace,
  } = usePaseo();

  const [activeTab, setActiveTab] = useState("fechas");
  const [showDateForm, setShowDateForm] = useState(false);
  const [showPlaceForm, setShowPlaceForm] = useState(false);
  const [timeRemainingLocation, setTimeRemainingLocation] = useState(0);
  const [timeRemainingDate, setTimeRemainingDate] = useState(0);

  const paseo = state.activePaseo;
  const currentUser = state.currentUser;

  const rawVotingState =
    paseo?.votingState || paseo?.finance?._backupVotingState || {};
  const locationVoting = rawVotingState.location || {
    isActive: false,
    deadline: null,
  };
  const dateVoting = rawVotingState.date || { isActive: false, deadline: null };

  const hasAlternativePlaces = paseo?.places?.length > 1;
  const hasAlternativeDates = paseo?.tentativeDates?.length > 1;

  const isLocationFinished = hasAlternativePlaces && !locationVoting.isActive;
  const isDateFinished = hasAlternativeDates && !dateVoting.isActive;
  const isLocationLocked = isLocationFinished;
  const isDateLocked = isDateFinished;

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentStore = usePaseo.getState();
      const currentPaseo = currentStore.state.activePaseo;
      if (!currentPaseo) return;

      const vState =
        currentPaseo.votingState ||
        currentPaseo.finance?._backupVotingState ||
        {};

      if (vState.date?.isActive && vState.date?.deadline) {
        const remaining = vState.date.deadline - Date.now();
        if (remaining > 0) {
          setTimeRemainingDate(Math.floor(remaining / 1000));
        } else {
          setTimeRemainingDate(0);
          const sorted = [...(currentPaseo.tentativeDates || [])].sort(
            (a, b) =>
              currentStore.getDateVotes(currentPaseo, b.id).yes -
              currentStore.getDateVotes(currentPaseo, a.id).yes
          );
          const winner = sorted[0];
          const newVs = {
            ...vState,
            date: { isActive: false, deadline: null },
          };

          currentStore.updatePaseo(currentPaseo.id, {
            confirmedDate: winner,
            votingState: newVs,
            finance: {
              ...(currentPaseo.finance || {}),
              _backupVotingState: newVs,
            },
          });
        }
      } else {
        setTimeRemainingDate(0);
      }

      if (vState.location?.isActive && vState.location?.deadline) {
        const remaining = vState.location.deadline - Date.now();
        if (remaining > 0) {
          setTimeRemainingLocation(Math.floor(remaining / 1000));
        } else {
          setTimeRemainingLocation(0);
          const sorted = [...(currentPaseo.places || [])].sort(
            (a, b) =>
              currentStore.getPlaceVotes(currentPaseo, b.id).likes -
              currentStore.getPlaceVotes(currentPaseo, a.id).likes
          );
          const winner = sorted[0];

          const newPrice = Number(winner?.budget || winner?.price || 0);
          const activeParticipants = (currentPaseo.participants || []).filter(
            (p) => p.status !== "cancelled"
          );
          const quota =
            activeParticipants.length > 0
              ? newPrice / activeParticipants.length
              : 0;
          const updatedParticipants = (currentPaseo.participants || []).map(
            (p) => {
              if (p.status !== "cancelled")
                return {
                  ...p,
                  quota: quota,
                  amountToPay: quota,
                  balance: quota,
                };
              return p;
            }
          );

          const newVs = {
            ...vState,
            location: { isActive: false, deadline: null },
          };

          currentStore.updatePaseo(currentPaseo.id, {
            location: winner?.name,
            ubicacion: winner?.name,
            participants: updatedParticipants,
            votingState: newVs,
            finance: {
              ...(currentPaseo.finance || {}),
              totalBudget: newPrice,
              _backupVotingState: newVs,
            },
          });
        }
      } else {
        setTimeRemainingLocation(0);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleAddDate = (d, duration) => {
    if (!paseo) return;
    const newDates = [
      ...(paseo.tentativeDates || []),
      { ...d, id: `date_${Date.now()}` },
    ];
    const deadlineMs = Date.now() + duration;

    const currentVs =
      paseo.votingState || paseo.finance?._backupVotingState || {};
    const newVotingState = {
      ...currentVs,
      date: { ...(currentVs.date || {}), isActive: true, deadline: deadlineMs },
    };

    updatePaseo(paseo.id, {
      tentativeDates: newDates,
      votingState: newVotingState,
      finance: { ...(paseo.finance || {}), _backupVotingState: newVotingState },
    });
    setShowDateForm(false);
  };

  const handleAddLocation = (place, duration) => {
    if (!paseo) return;
    const newPlaces = [
      ...(paseo.places || []),
      { ...place, id: `place_${Date.now()}` },
    ];
    const deadlineMs = Date.now() + duration;

    const currentVs =
      paseo.votingState || paseo.finance?._backupVotingState || {};
    const newVotingState = {
      ...currentVs,
      location: {
        ...(currentVs.location || {}),
        isActive: true,
        deadline: deadlineMs,
      },
    };

    updatePaseo(paseo.id, {
      places: newPlaces,
      votingState: newVotingState,
      finance: { ...(paseo.finance || {}), _backupVotingState: newVotingState },
    });
    setShowPlaceForm(false);
  };

  const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  if (!paseo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 px-8 text-center">
        <span className="text-5xl">🗳️</span>
        <h2 className="text-xl font-extrabold text-slate-800">
          No hay paseo activo
        </h2>
        <p className="text-slate-400 text-sm">
          Primero crea un paseo para poder votar
        </p>
        <Button variant="primary" onClick={() => navigate("/")}>
          Crear paseo
        </Button>
      </div>
    );
  }

  const sortedDates = [...paseo.tentativeDates].sort(
    (a, b) => getDateVotes(paseo, b.id).yes - getDateVotes(paseo, a.id).yes
  );
  const sortedPlaces = [...paseo.places].sort(
    (a, b) =>
      getPlaceVotes(paseo, b.id).likes - getPlaceVotes(paseo, a.id).likes
  );

  const isCurrentTabFinished =
    activeTab === "fechas" ? isDateFinished : isLocationFinished;
  const isCurrentTabActive =
    activeTab === "fechas" ? dateVoting.isActive : locationVoting.isActive;
  const currentTabTimeRemaining =
    activeTab === "fechas" ? timeRemainingDate : timeRemainingLocation;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 relative">
      {/* ── TOP BAR ──────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 px-4 pt-12 pb-0 sticky top-0 z-40">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <ChevronLeft size={18} className="text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-extrabold text-slate-900 leading-tight">
              Democracia 🗳️
            </h1>
            <p className="text-xs text-slate-400">
              {paseo.emoji} {paseo.name}
            </p>
          </div>

          <div
            className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 shadow-sm flex items-center justify-center"
            title="PaseoYa"
          >
            <span className="text-orange-500 font-black text-[11px] tracking-tighter drop-shadow-sm">
              PY
            </span>
          </div>
        </div>

        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-0">
          {[
            {
              id: "fechas",
              label: "📅 Fechas",
              count: paseo.tentativeDates.length,
            },
            { id: "lugares", label: "📍 Lugares", count: paseo.places.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
              <span
                className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? "bg-orange-100 text-orange-500"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── TIMER BANNER ──────────────────────────────── */}
      {(isCurrentTabActive || isCurrentTabFinished) && (
        <div
          className={`px-4 py-3 text-center shadow-md sticky top-[132px] z-30 transition-colors duration-500 ${
            isCurrentTabFinished
              ? "bg-slate-800 text-white"
              : "bg-gradient-to-r from-orange-500 to-red-500 text-white"
          }`}
        >
          {isCurrentTabFinished ? (
            <span className="font-bold flex items-center justify-center gap-2 text-sm">
              Votación finalizada ya tenemos un ganador 🏆
            </span>
          ) : (
            <span className="font-bold flex items-center justify-center gap-2 text-sm">
              ⏳ La votación cierra en:{" "}
              <span className="font-mono text-base">
                {formatTime(currentTabTimeRemaining)}
              </span>
            </span>
          )}
        </div>
      )}

      <div className="px-4 pt-4 space-y-4">
        {/* ── TAB: FECHAS ──────────────────────────────── */}
        {activeTab === "fechas" && (
          <>
            <div className="flex items-center justify-between py-1">
              <p className="text-xs text-slate-400 font-semibold">
                {paseo.participants.length} participante
                {paseo.participants.length !== 1 ? "s" : ""} ·{" "}
                {!isDateLocked ? "Toca para votar" : "Votación cerrada"}
              </p>
              <span className="text-xs font-bold text-orange-500">
                {paseo.tentativeDates.length} opción
                {paseo.tentativeDates.length !== 1 ? "es" : ""}
              </span>
            </div>

            {sortedDates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-5xl mb-3">📅</span>
                <h3 className="text-slate-700 font-bold text-base">
                  Sin fechas aún
                </h3>
                <p className="text-slate-400 text-sm mt-1 mb-4">
                  Sugiere una fecha para que todos puedan votar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedDates.map((date, index) => (
                  <DateVoteCard
                    key={date.id}
                    date={date}
                    votes={getDateVotes(paseo, date.id)}
                    userVote={getUserDateVote(paseo, date.id, currentUser.id)}
                    totalParticipants={paseo.participants.length}
                    participants={paseo.participants}
                    isLeader={
                      index === 0 &&
                      getDateVotes(paseo, date.id).yes > 0 &&
                      !isDateLocked
                    }
                    isWinner={isDateLocked && index === 0}
                    isVotingLocked={isDateLocked}
                    onVote={voteDate}
                  />
                ))}
              </div>
            )}

            {!isDateLocked &&
              (showDateForm ? (
                <SuggestDateForm
                  onSubmit={(d, duration) => handleAddDate(d, duration)}
                  onCancel={() => setShowDateForm(false)}
                />
              ) : (
                <button
                  onClick={() => setShowDateForm(true)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-dashed border-orange-300 rounded-2xl text-sm font-bold text-orange-500 hover:bg-orange-50 transition-colors active:scale-95"
                >
                  <Plus size={16} /> Sugerir nueva fecha para el paseo
                </button>
              ))}
          </>
        )}

        {/* ── TAB: LUGARES ─────────────────────────────── */}
        {activeTab === "lugares" && (
          <>
            <div className="flex items-center justify-between py-1">
              <p className="text-xs text-slate-400 font-semibold">
                {!isLocationLocked
                  ? "Da 👍 o 👎 a cada opción propuesta"
                  : "Votación finalizada"}
              </p>
              <span className="text-xs font-bold text-teal-600">
                {paseo.places.length} lugar
                {paseo.places.length !== 1 ? "es" : ""}
              </span>
            </div>

            {sortedPlaces.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="text-5xl mb-3">📍</span>
                <h3 className="text-slate-700 font-bold text-base">
                  Sin lugares propuestos
                </h3>
                <p className="text-slate-400 text-sm mt-1 mb-4">
                  Agrega el primero para que el grupo pueda votar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedPlaces.map((place, index) => (
                  <PlaceVoteCard
                    key={place.id}
                    place={place}
                    index={index}
                    votes={getPlaceVotes(paseo, place.id)}
                    userVote={getUserPlaceVote(paseo, place.id, currentUser.id)}
                    isWinner={isLocationLocked && index === 0}
                    isVotingLocked={isLocationLocked}
                    onVote={votePlace}
                    onRemove={removePlace}
                      participants={paseo.participants}
                  />
                ))}
              </div>
            )}

            {!isLocationLocked &&
              (showPlaceForm ? (
                <AddPlaceForm
                  onSubmit={(p, duration) => handleAddLocation(p, duration)}
                  onCancel={() => setShowPlaceForm(false)}
                />
              ) : (
                <button
                  onClick={() => setShowPlaceForm(true)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-dashed border-teal-300 rounded-2xl text-sm font-bold text-teal-600 hover:bg-teal-50 transition-colors active:scale-95"
                >
                  <Plus size={16} /> Sugerir nuevo lugar para el paseo
                </button>
              ))}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
