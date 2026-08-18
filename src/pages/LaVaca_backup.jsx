// pages/LaVaca.jsx — PANTALLA 5 v12 (Seguridad Tesorero + Gastos Extras estilo Splitwise)
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  CheckCircle2,
  Circle,
  Link2,
  Plus,
  X,
  TrendingUp,
  Copy,
  ArrowRight,
  HandCoins,
  Check,
  ChevronDown,
  Receipt,
  Utensils,
  Camera,
  Percent,
} from "lucide-react";
import { usePaseo } from "../store/usePaseoStore";
import BottomNav from "../components/layout/BottomNav";
import Button from "../components/ui/Button";

// ─────────────────────────────────────────────
// MOTOR SPLITWISE (Simplificador de Deudas)
// ─────────────────────────────────────────────
function calculateSimplifiedDebts(debts) {
  const balances = {};

  // 1. Calcular balance neto por persona
  debts.forEach((d) => {
    if (!d.settled) {
      balances[d.debtor] = (balances[d.debtor] || 0) - d.amount;
      balances[d.creditor] = (balances[d.creditor] || 0) + d.amount;
    }
  });

  // 2. Separar deudores (negativo) y acreedores (positivo)
  const debtors = [];
  const creditors = [];
  for (const [person, amount] of Object.entries(balances)) {
    if (amount < -0.01) debtors.push({ person, amount: -amount });
    if (amount > 0.01) creditors.push({ person, amount });
  }

  // 3. Emparejamiento inteligente (Greedy Algorithm)
  const optimized = [];
  let i = 0,
    j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const minAmount = Math.min(debtor.amount, creditor.amount);

    optimized.push({
      id: `opt_${Math.random().toString(36).substr(2, 9)}`,
      debtor: debtor.person,
      creditor: creditor.person,
      amount: minAmount,
      concept: "Deuda simplificada ✨",
      settled: false,
      isOptimized: true,
    });

    debtor.amount -= minAmount;
    creditor.amount -= minAmount;

    if (Math.abs(debtor.amount) < 0.01) i++;
    if (Math.abs(creditor.amount) < 0.01) j++;
  }
  return optimized;
}

// ─────────────────────────────────────────────
// LOCAL CALCULATORS
// ─────────────────────────────────────────────
function calcAdjustedTotalBudget(paseo) {
  if (!paseo) return 0;
  // NOTA ARQUITECTÓNICA: Los Gastos Extras (expenses) NO entran en la cuota base
  const ingredients = paseo.logistics?.ingredients || [];
  const marketReal = ingredients.reduce((sum, item) => {
    const cost =
      item.actualCost !== null &&
      item.actualCost !== undefined &&
      item.actualCost !== 0
        ? item.actualCost
        : item.estimatedCost || 0;
    return sum + cost;
  }, 0);
  return (paseo.finance?.totalBudget || 0) + marketReal;
}

function calcBaseCuota(paseo) {
  if (!paseo) return 0;
  const active =
    paseo.participants?.filter((p) => p.status !== "cancelled").length || 0;
  return active === 0 ? 0 : calcAdjustedTotalBudget(paseo) / active;
}

function calcBusAddonForPerson(paseo, participantId) {
  if (!paseo || !participantId || !paseo.logistics?.transport?.bus) return 0;
  const { bus } = paseo.logistics.transport;
  if (
    !bus.enabled ||
    !bus.includeInVaca ||
    bus.totalCost <= 0 ||
    !bus.assignedParticipants ||
    bus.assignedParticipants.length === 0
  )
    return 0;
  return bus.assignedParticipants.includes(participantId)
    ? bus.totalCost / bus.assignedParticipants.length
    : 0;
}

function calcRecaudo(paseo) {
  if (!paseo || calcAdjustedTotalBudget(paseo) === 0) return 0;
  const paid =
    paseo.participants?.filter((p) => p.hasPaid && p.status !== "cancelled")
      .length || 0;
  const total =
    paseo.participants?.filter((p) => p.status !== "cancelled").length || 0;
  return total === 0 ? 0 : Math.round((paid / total) * 100);
}

const formatCOP = (n) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n || 0);

const EXPENSE_CATEGORIES = [
  { id: "alojamiento", label: "Alojamiento", emoji: "🏡" },
  { id: "comida", label: "Comida", emoji: "🍖" },
  { id: "transporte", label: "Transporte", emoji: "🚗" },
  { id: "bebidas", label: "Bebidas", emoji: "🍺" },
  { id: "actividades", label: "Actividades", emoji: "🎯" },
  { id: "otro", label: "Otro", emoji: "📌" },
];

const AVATAR_COLORS = [
  "#FED7AA",
  "#BBF7D0",
  "#BAE6FD",
  "#DDD6FE",
  "#FBCFE8",
  "#FEF08A",
  "#CCFBF1",
  "#E9D5FF",
];
const getAvatarBg = (name) =>
  AVATAR_COLORS[(name || "").charCodeAt(0) % AVATAR_COLORS.length];
const getInitials = (name) =>
  (name || "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// ─────────────────────────────────────────────
// COMPONENTES REUTILIZABLES
// ─────────────────────────────────────────────

function DebtModal({ participants, onSubmit, onClose }) {
  const [creditor, setCreditor] = useState(participants[0]?.name || "");
  const [debtor, setDebtor] = useState(
    participants[1]?.name || participants[0]?.name || ""
  );
  const [amount, setAmount] = useState("");
  const [concept, setConcept] = useState("");

  const isValid =
    creditor &&
    debtor &&
    creditor !== debtor &&
    parseFloat(amount) > 0 &&
    concept.trim();

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl px-5 pt-5 pb-10 space-y-4"
        style={{ boxShadow: "0 -8px 40px -8px rgba(15,23,42,0.2)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Registro de deuda personal
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Quien le prestó / pagó a quien
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X size={16} className="text-slate-600" />
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex-1 text-center">
            <div
              className="w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-bold text-slate-700"
              style={{ background: getAvatarBg(creditor) }}
            >
              {getInitials(creditor)}
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">
              Prestó / Pagó
            </p>
            <p className="text-xs font-extrabold text-slate-800">
              {creditor.split(" ")[0]}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ArrowRight size={18} className="text-orange-400" />
            {amount && (
              <span className="text-[10px] font-extrabold text-orange-500">
                {formatCOP(parseInt(amount) || 0)}
              </span>
            )}
          </div>
          <div className="flex-1 text-center">
            <div
              className="w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-bold text-slate-700"
              style={{ background: getAvatarBg(debtor) }}
            >
              {getInitials(debtor)}
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">
              Le debe a
            </p>
            <p className="text-xs font-extrabold text-slate-800">
              {debtor.split(" ")[0]}
            </p>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
            Quien prestó o pagó (Acreedor){" "}
            <span className="text-orange-500">*</span>
          </label>
          <select
            value={creditor}
            onChange={(e) => setCreditor(e.target.value)}
            className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-orange-400 transition-colors bg-white"
          >
            {participants.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
            Quien debe (Deudor) <span className="text-orange-500">*</span>
          </label>
          <select
            value={debtor}
            onChange={(e) => setDebtor(e.target.value)}
            className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-orange-400 transition-colors bg-white"
          >
            {participants.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
          {creditor === debtor && (
            <p className="text-[10px] text-red-500 font-semibold mt-1">
              El acreedor y el deudor no pueden ser la misma persona.
            </p>
          )}
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
            Monto $ <span className="text-orange-500">*</span>
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            placeholder="0"
            className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-orange-400 transition-colors placeholder:text-slate-300"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
            Concepto <span className="text-orange-500">*</span>
          </label>
          <input
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="Ej: Hielo y gaseosas, taxi, etc."
            maxLength={60}
            className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-orange-400 transition-colors placeholder:text-slate-300"
          />
        </div>

        <Button
          variant="primary"
          fullWidth
          disabled={!isValid}
          icon={HandCoins}
          onClick={() => {
            if (!isValid) return;
            onSubmit({
              creditor,
              debtor,
              amount: parseInt(amount) || 0,
              concept: concept.trim(),
            });
          }}
        >
          Registrar deuda
        </Button>
      </div>
    </div>
  );
}

function DebtCard({ debt, onSettle, onRemove, isSimplified }) {
  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
        debt.settled
          ? "bg-green-50 border-green-100 opacity-70"
          : isSimplified
          ? "bg-indigo-50/30 border-indigo-100"
          : "bg-white border-slate-100"
      }`}
      style={{ boxShadow: "0 2px 8px -2px rgba(15,23,42,0.06)" }}
    >
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-700"
              style={{ background: getAvatarBg(debt.creditor) }}
            >
              {getInitials(debt.creditor)}
            </div>
            <span className="text-xs font-bold text-slate-700">
              {debt.creditor.split(" ")[0]}
            </span>
          </div>
          <ArrowRight
            size={12}
            className={`${
              isSimplified ? "text-indigo-400" : "text-slate-300"
            } flex-shrink-0`}
          />
          <div className="flex items-center gap-1.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-700"
              style={{ background: getAvatarBg(debt.debtor) }}
            >
              {getInitials(debt.debtor)}
            </div>
            <span className="text-xs font-bold text-slate-700">
              {debt.debtor.split(" ")[0]}
            </span>
          </div>
          <div className="flex-1 text-right">
            <span
              className={`text-sm font-extrabold ${
                debt.settled
                  ? "text-green-600 line-through"
                  : isSimplified
                  ? "text-indigo-600"
                  : "text-red-500"
              }`}
            >
              {formatCOP(debt.amount)}
            </span>
          </div>
        </div>
        <p
          className={`text-[11px] font-semibold mb-2.5 ${
            debt.settled
              ? "text-slate-400 line-through"
              : isSimplified
              ? "text-indigo-500"
              : "text-slate-500"
          }`}
        >
          {debt.concept}
        </p>

        {isSimplified ? (
          <div className="text-[10px] bg-indigo-100 text-indigo-600 font-bold px-2 py-1 rounded-lg text-center mt-1">
            Modo Simplificado (Solo lectura)
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSettle(debt.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 ${
                debt.settled
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-slate-100 text-slate-600 hover:bg-green-100 hover:text-green-700"
              }`}
            >
              {debt.settled ? (
                <>
                  <Check size={12} /> Saldada
                </>
              ) : (
                <>
                  <Circle size={12} /> Marcar saldada
                </>
              )}
            </button>
            <button
              onClick={() => onRemove(debt.id)}
              className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors flex-shrink-0"
            >
              <X size={13} className="text-red-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ParticipantPayRow({ participant, paseo, onToggle, currentUser }) {
  const [expanded, setExpanded] = useState(false);
  const isActive = participant.status !== "cancelled";
  const baseCuota = calcBaseCuota(paseo);
  const busAddon = calcBusAddonForPerson(paseo, participant.id);
  const totalCuota = baseCuota + busAddon;
  const hasBusAddon = busAddon > 0;
  const activeCount =
    paseo.participants?.filter((p) => p.status !== "cancelled").length || 0;
  const { bus } = paseo.logistics?.transport || { bus: {} };

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all duration-200 ${
        participant.hasPaid
          ? "bg-green-50 border-green-100"
          : "bg-white border-slate-100"
      }`}
    >
      <div
        className={`flex items-center gap-3 p-3 ${
          isActive
            ? "cursor-pointer hover:bg-black/[0.02] active:bg-black/[0.04]"
            : ""
        } transition-colors`}
        onClick={() => isActive && setExpanded((v) => !v)}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-slate-700 flex-shrink-0"
          style={{ background: getAvatarBg(participant.name) }}
        >
          {getInitials(participant.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-sm font-bold ${
                participant.hasPaid ? "text-slate-700" : "text-slate-800"
              }`}
            >
              {participant.name.split(" ")[0]}
            </span>
            {participant.role === "host" && (
              <span className="text-[9px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full">
                ANFITRIÓN
              </span>
            )}
            {participant.status === "pending" && (
              <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                PENDIENTE
              </span>
            )}
            {hasBusAddon && isActive && (
              <span className="text-[9px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full">
                🚌 +transp.
              </span>
            )}
          </div>
          {isActive && (
            <p
              className={`text-xs font-semibold mt-0.5 ${
                participant.hasPaid ? "text-green-600" : "text-slate-500"
              }`}
            >
              {formatCOP(totalCuota)}{" "}
              <span className="text-slate-300 font-normal ml-1.5">
                · toca para ver desglose
              </span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isActive && (
            <div
              className={`transition-transform duration-300 ${
                expanded ? "rotate-180" : "rotate-0"
              }`}
            >
              <ChevronDown size={15} className="text-slate-400" />
            </div>
          )}

          {/* CANDADO DEL TESORERO: Solo el Host puede cambiar el estado de pago */}
          {currentUser?.role === "host" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                isActive && onToggle(participant.id);
              }}
              disabled={!isActive}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                participant.hasPaid
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              } ${
                !isActive ? "opacity-40 cursor-not-allowed" : "active:scale-95"
              }`}
            >
              {participant.hasPaid ? (
                <>
                  <CheckCircle2 size={11} /> Pagó
                </>
              ) : (
                <>
                  <Circle size={11} /> Pendiente
                </>
              )}
            </button>
          ) : (
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                participant.hasPaid
                  ? "bg-green-50 text-green-600 border border-green-100"
                  : "bg-amber-50 text-amber-600 border border-amber-100"
              }`}
            >
              {participant.hasPaid ? (
                <>
                  <CheckCircle2 size={11} /> Pagado
                </>
              ) : (
                <>
                  <Circle size={11} /> Pendiente
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {expanded && isActive && (
        <div className="px-3 pb-3">
          <div
            className="rounded-2xl overflow-hidden border border-slate-100"
            style={{
              background: "linear-gradient(135deg, #FAFAFA 0%, #F8FAFC 100%)",
            }}
          >
            <div
              className="px-4 py-2.5 border-b border-slate-100"
              style={{ background: "linear-gradient(90deg, #FFF7ED, #FFFBF5)" }}
            >
              <p className="text-[10px] font-extrabold text-orange-600 uppercase tracking-widest">
                Desglose de cuota (Vaca Principal)
              </p>
            </div>
            <div className="p-3 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      Costo Compartido Base
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {formatCOP(calcAdjustedTotalBudget(paseo))} /{" "}
                      {activeCount} personas
                    </p>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-slate-800 flex-shrink-0">
                  {formatCOP(baseCuota)}
                </span>
              </div>
              {hasBusAddon && (
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-teal-700">
                        🚌 Transporte individual
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {bus.vendor ? `${bus.vendor} · ` : ""}
                        {formatCOP(bus.totalCost)} /{" "}
                        {bus.assignedParticipants.length} asignados
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-teal-600 flex-shrink-0">
                    +{formatCOP(busAddon)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t-2 border-slate-200 mt-1">
                <div>
                  <p className="text-sm font-extrabold text-slate-800">
                    Total a pagar
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Solo incluye Finca/Base + Transporte + Mercado
                  </p>
                </div>
                <span
                  className="text-xl font-extrabold"
                  style={{ color: "#F97316" }}
                >
                  {formatCOP(totalCuota)}
                </span>
              </div>
              <div
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold ${
                  participant.hasPaid
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-50 text-amber-600 border border-amber-200"
                }`}
              >
                {participant.hasPaid ? (
                  <>
                    <CheckCircle2 size={13} /> ¡Cuota pagada! Gracias{" "}
                    {participant.name.split(" ")[0]} 🎉
                  </>
                ) : (
                  <>
                    <Circle size={13} /> Pago pendiente de{" "}
                    {formatCOP(totalCuota)}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentLinkCard({ label, icon, placeholder, value, onChange, color }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      alert(`¡${label} copiado!`);
    } catch {
      prompt(`Copia tu ${label}:`, value);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
      style={{ boxShadow: "0 2px 10px -2px rgba(15,23,42,0.07)" }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
          style={{ background: `${color}18` }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-400">{label}</p>
          {editing ? (
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={placeholder}
              autoFocus
              className="w-full text-sm font-semibold text-slate-800 outline-none border-b-2 border-orange-400 pb-0.5 bg-transparent"
            />
          ) : (
            <p
              className={`text-sm font-bold truncate ${
                value ? "text-slate-800" : "text-slate-300"
              }`}
            >
              {value || placeholder}
            </p>
          )}
        </div>
        <div className="flex gap-1.5">
          {value && !editing && (
            <button
              onClick={handleCopy}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <Copy size={13} className="text-slate-500" />
            </button>
          )}
          {editing ? (
            <button
              onClick={() => {
                onChange(draft.trim());
                setEditing(false);
              }}
              className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
            >
              <CheckCircle2 size={13} className="text-white" />
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center hover:bg-orange-100 transition-colors"
            >
              <Link2 size={13} className="text-orange-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────
export default function LaVaca() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const {
    state,
    updatePaseo,
    loadPaseoFromCloud,
    updateBudget,
    togglePayment,
    updatePaymentLinks,
    addExpense,
    removeExpense,
    addDebt,
    removeDebt,
    toggleDebtSettled,
    addBillItem,
    removeBillItem,
    toggleBillItemParticipant,
  } = usePaseo();

  // 1. TODOS LOS HOOKS DE ESTADO PRIMERO
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [budgetInput, setBudgetInput] = useState("");
  const [editBudget, setEditBudget] = useState(false);
  const [showExpForm, setShowExpForm] = useState(false);
  const [showDebtModal, setShowDebtModal] = useState(false);

  // Toggle del Motor Simplificador
  const [showSimplify, setShowSimplify] = useState(false);

  // Estados para Gastos Extras (Estilo Splitwise)
  const [expDesc, setExpDesc] = useState("");
  const [expAmt, setExpAmt] = useState("");
  const [expCat, setExpCat] = useState("otro");
  const [expPaidBy, setExpPaidBy] = useState("");
  const [expSharedBy, setExpSharedBy] = useState([]); // Arreglo de IDs de participantes que comparten el gasto

  // Estados para Parte-Cuentas
  const [showBillModal, setShowBillModal] = useState(false);
  const [billDesc, setBillDesc] = useState("");
  const [billAmt, setBillAmt] = useState("");
  const [tipPercentage, setTipPercentage] = useState(10);
  const [expandedBill, setExpandedBill] = useState(null);

  // 2. EXTRACCIÓN SEGURA DE VARIABLES DEPENDIENTES DE HOOKS
  const paseo = state.activePaseo;
  const activePartic =
    paseo?.participants?.filter((p) => p.status !== "cancelled") || [];
  const currentUser = state.currentUser;

  // 3. HOOKS DE EFECTOS
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

  // Inicializar select de quien pagó un gasto extra y quiénes lo comparten por defecto
  useEffect(() => {
    if (activePartic.length > 0 && !expPaidBy && currentUser) {
      setExpPaidBy(currentUser.name);
      setExpSharedBy(activePartic.map((p) => p.id)); // Todos comparten por defecto
    }
  }, [activePartic, expPaidBy, currentUser]);

  // 4. RETORNOS TEMPRANOS (EARLY RETURNS) DESPUÉS DE TODOS LOS HOOKS
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-bold animate-pulse">Cargando...</p>
      </div>
    );
  }

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

  // 5. LÓGICA Y CÁLCULOS RESTANTES (AQUÍ PASEO YA ES SEGURO)
  const isShortEvent =
    paseo.category === "rumba" || paseo.category === "restaurante";

  // Cálculos Originales Vaca (Solo Cuota Base, sin Gastos Extras)
  const adjustedTotalBudget = calcAdjustedTotalBudget(paseo);
  const ingredients = paseo.logistics?.ingredients || [];
  const marketEstimated = ingredients.reduce(
    (sum, item) => sum + (item.estimatedCost || 0),
    0
  );
  const marketReal = ingredients.reduce((sum, item) => {
    const cost =
      item.actualCost !== null &&
      item.actualCost !== undefined &&
      item.actualCost !== 0
        ? item.actualCost
        : item.estimatedCost || 0;
    return sum + cost;
  }, 0);
  const marketDifference = marketReal - marketEstimated;
  const recaudoPct = calcRecaudo(paseo);
  const baseCuota = calcBaseCuota(paseo);
  const myTransport = calcBusAddonForPerson(paseo, currentUser?.id);
  const myTotal = baseCuota + myTransport;
  const paidCount = activePartic.filter((p) => p.hasPaid).length;
  const pendingCount = activePartic.length - paidCount;
  const collected = paidCount * baseCuota;
  const balance = collected - adjustedTotalBudget; // Balance estricto de la Vaca Principal

  // Cálculo de deudas internas
  const debts = paseo.finance.debts || [];
  const unsettled = debts.filter((d) => !d.settled);
  const settled = debts.filter((d) => d.settled);

  // Ejecución del motor simplificador (Splitwise)
  const simplifiedTransactions = calculateSimplifiedDebts(unsettled);

  const handleBudgetSave = () => {
    const val = parseInt(budgetInput.replace(/\D/g, "")) || 0;
    if (val > 0) updateBudget(val);
    setBudgetInput("");
    setEditBudget(false);
  };

  const handleAddExpense = () => {
    if (!expDesc || !expAmt || !expPaidBy) return;
    addExpense({
      description: expDesc,
      amount: parseInt(expAmt),
      paidBy: expPaidBy,
      category: expCat,
      sharedBy:
        expSharedBy.length > 0 ? expSharedBy : activePartic.map((p) => p.id),
    });
    setExpDesc("");
    setExpAmt("");
    setShowExpForm(false);
    setExpSharedBy(activePartic.map((p) => p.id)); // Reset
  };

  const handleToggleExpenseParticipant = async (expenseId, participantId) => {
    if (!updatePaseo) return;
    const currentExpenses = paseo.finance?.expenses || [];
    const newExpenses = currentExpenses.map((e) => {
      if (e.id === expenseId) {
        const sharedBy = e.sharedBy || activePartic.map((p) => p.id);
        const newSharedBy = sharedBy.includes(participantId)
          ? sharedBy.filter((id) => id !== participantId)
          : [...sharedBy, participantId];
        return { ...e, sharedBy: newSharedBy };
      }
      return e;
    });

    await updatePaseo({
      finance: {
        ...paseo.finance,
        expenses: newExpenses,
      },
    });
  };

  // Cálculos Parte-Cuentas Avanzado con Desglose
  const billItems = paseo.finance?.billItems || [];
  const splitTotals = {};
  activePartic.forEach((p) => {
    splitTotals[p.id] = {
      name: p.name,
      total: 0,
      items: [],
      tipAmount: 0,
      finalTotal: 0,
    };
  });

  billItems.forEach((item) => {
    const sharedCount = item.sharedBy?.length || 0;
    if (sharedCount > 0) {
      const splitAmount = item.amount / sharedCount;
      item.sharedBy.forEach((pid) => {
        if (splitTotals[pid]) {
          splitTotals[pid].total += splitAmount;
          splitTotals[pid].items.push({
            name: item.description,
            fraction: sharedCount === 1 ? "1" : `1/${sharedCount}`,
            amount: splitAmount,
          });
        }
      });
    }
  });

  Object.values(splitTotals).forEach((st) => {
    st.tipAmount = st.total * (tipPercentage / 100);
    st.finalTotal = st.total + st.tipAmount;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* MODAL DE DEUDAS INTERNAS */}
      {showDebtModal && (
        <DebtModal
          participants={activePartic}
          onSubmit={(d) => {
            addDebt(d);
            setShowDebtModal(false);
          }}
          onClose={() => setShowDebtModal(false)}
        />
      )}

      {/* MODAL AGREGAR CONSUMO (PARTE CUENTAS) */}
      {showBillModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">Agregar Consumo</h3>
              <button
                onClick={() => setShowBillModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  value={billDesc}
                  onChange={(e) => setBillDesc(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-400 transition-colors"
                  placeholder="Ej: Pizza familiar"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                  Precio Total
                </label>
                <input
                  type="number"
                  value={billAmt}
                  onChange={(e) => setBillAmt(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-400 transition-colors"
                  placeholder="Ej: 45000"
                  min="0"
                />
              </div>
              <Button
                variant="primary"
                fullWidth
                disabled={!billDesc || !billAmt || Number(billAmt) <= 0}
                onClick={() => {
                  if (billDesc && billAmt) {
                    addBillItem({
                      description: billDesc,
                      amount: parseInt(billAmt) || 0,
                    });
                    setShowBillModal(false);
                    setBillDesc("");
                    setBillAmt("");
                  }
                }}
              >
                Guardar Consumo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TOP BAR FIJA */}
      <div
        className="bg-white px-4 pt-12 pb-3 sticky top-0 z-40 border-b border-slate-100"
        style={{ boxShadow: "0 2px 8px -2px rgba(15,23,42,0.04)" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <ChevronLeft size={18} className="text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-extrabold text-slate-900 leading-tight">
              {!isShortEvent ? "Finanzas y Pagos" : "Parte-Cuentas"}
            </h1>
            <p className="text-xs text-slate-400">
              {paseo.emoji} {paseo.name}
            </p>
          </div>
          {!isShortEvent && (
            <div className="text-right">
              <p className="text-xs text-slate-400 font-semibold">Recaudado</p>
              <p className="text-lg font-extrabold text-teal-600">
                {recaudoPct}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────── */}
      {/* 🐄 INTERFAZ CLÁSICA: LA VACA (Viajes, Fincas, Playa) */}
      {/* ───────────────────────────────────────────── */}
      {!isShortEvent && (
        <div className="px-4 pt-5 space-y-5 animate-in fade-in duration-300">
          {/* HERO: TRANSPARENCIA FINANCIERA */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #F97316 0%, #FBBF24 100%)",
              boxShadow: "0 8px 32px -8px rgba(249,115,22,0.45)",
            }}
          >
            <div className="px-5 pt-5 pb-3 text-center">
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-1">
                Transparencia Financiera
              </p>
            </div>
            {/* Tarjeta Recibo */}
            <div className="mx-4 mb-3 bg-white/10 border border-white/20 rounded-xl p-3 shadow-sm">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-white/90 text-sm">
                  <span className="flex items-center gap-1.5">
                    🏠 Hospedaje y Base
                    {currentUser?.role === "host" && (
                      <button
                        onClick={() => {
                          setBudgetInput(
                            String(paseo.finance?.totalBudget || "")
                          );
                          setEditBudget(true);
                        }}
                        className="text-white/50 hover:text-white transition-colors text-xs"
                        title="Editar Hospedaje y Base"
                      >
                        ✏️
                      </button>
                    )}
                  </span>
                  {editBudget ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={budgetInput}
                        onChange={(e) => setBudgetInput(e.target.value)}
                        placeholder={String(paseo.finance?.totalBudget || "0")}
                        className="w-20 bg-white/20 text-white text-sm font-bold rounded px-1.5 py-0.5 outline-none text-right placeholder:text-white/40 border border-white/30"
                        autoFocus
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleBudgetSave()
                        }
                      />
                      <button
                        onClick={handleBudgetSave}
                        className="text-white text-[10px] bg-orange-500 rounded px-2 py-1 font-bold shadow-sm hover:bg-orange-600"
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <span className="font-semibold text-white">
                      {formatCOP(paseo.finance?.totalBudget || 0)}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center text-white/90 text-sm">
                  <span>🛒 Mercado (Menú)</span>
                  <span className="font-semibold text-white">
                    {formatCOP(marketReal)}
                  </span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-white/20 flex justify-between items-center">
                <span className="text-white font-extrabold text-sm">
                  Total Compartido
                </span>
                <span className="text-white font-extrabold text-lg">
                  {formatCOP(adjustedTotalBudget)}
                </span>
              </div>
            </div>

            {/* Tarjeta de Cuota Final */}
            {baseCuota > 0 && (
              <div className="mx-4 mb-4 bg-white border border-white/30 rounded-xl p-4 shadow-lg text-center">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Tu Total a Pagar
                </p>
                <p className="text-orange-500 text-4xl font-black mb-3">
                  {formatCOP(myTotal)}
                </p>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Cuota Base Compartida</span>
                    <span className="font-bold text-slate-800">
                      {formatCOP(baseCuota)}
                    </span>
                  </div>
                  {myTransport > 0 && (
                    <div className="flex justify-between items-center text-teal-600 border-t border-slate-200 pt-1.5">
                      <span>🚌 Transporte Individual</span>
                      <span className="font-bold">
                        +{formatCOP(myTransport)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-slate-300 text-[9px] mt-2.5 font-bold uppercase tracking-wider">
                  Dividido entre {activePartic.length} persona
                  {activePartic.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>

          {/* PROGRESS DE RECAUDO */}
          <div
            className="bg-white rounded-2xl border border-slate-100 p-4"
            style={{ boxShadow: "0 2px 12px -2px rgba(15,23,42,0.07)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-extrabold text-slate-800">
                Estado del recaudo
              </h2>
              <span className="text-sm font-extrabold text-teal-600">
                {recaudoPct}%
              </span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full rounded-full transition-all duration-700 relative"
                style={{
                  width: `${recaudoPct}%`,
                  background: "linear-gradient(90deg, #0D9488, #10B981)",
                }}
              ></div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-green-50 rounded-xl p-2">
                <p className="text-lg font-extrabold text-green-600">
                  {paidCount}
                </p>
                <p className="text-[10px] font-bold text-green-500">
                  Pagaron ✓
                </p>
              </div>
              <div className="bg-amber-50 rounded-xl p-2">
                <p className="text-lg font-extrabold text-amber-500">
                  {pendingCount}
                </p>
                <p className="text-[10px] font-bold text-amber-500">
                  Pendientes
                </p>
              </div>
              <div
                className={`rounded-xl p-2 ${
                  balance >= 0 ? "bg-teal-50" : "bg-red-50"
                }`}
              >
                <p
                  className={`text-lg font-extrabold ${
                    balance >= 0 ? "text-teal-600" : "text-red-500"
                  }`}
                >
                  {balance >= 0 ? "✓" : "!"}
                </p>
                <p
                  className={`text-[10px] font-bold ${
                    balance >= 0 ? "text-teal-500" : "text-red-500"
                  }`}
                >
                  Balance Base
                </p>
              </div>
            </div>
          </div>

          {/* PANEL DEL TESORERO */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-extrabold text-slate-800">
                Panel del tesorero 💼
              </h2>
            </div>
            <div className="space-y-2.5">
              {activePartic
                .sort((a, b) => (b.hasPaid ? 1 : 0) - (a.hasPaid ? 1 : 0))
                .map((p) => (
                  <ParticipantPayRow
                    key={p.id}
                    participant={p}
                    paseo={paseo}
                    onToggle={togglePayment}
                    currentUser={currentUser}
                  />
                ))}
            </div>
          </section>

          {/* GASTOS EXTRAS (ESTILO SPLITWISE) */}
          <section>
            <div className="flex items-center justify-between mb-3 mt-8">
              <div>
                <h2 className="text-base font-extrabold text-slate-800">
                  Gastos Extras 💸
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Cuentas independientes a la vaca principal
                </p>
              </div>
              <button
                onClick={() => setShowExpForm(!showExpForm)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <Plus
                  size={16}
                  className={
                    showExpForm
                      ? "rotate-45 transition-transform"
                      : "transition-transform"
                  }
                />
              </button>
            </div>

            {showExpForm && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                    Nombre del gasto
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Leña, peajes, hielo..."
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                    Monto total
                  </label>
                  <input
                    type="number"
                    placeholder="Monto $"
                    value={expAmt}
                    onChange={(e) => setExpAmt(e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-orange-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                      ¿Quién pagó?
                    </label>
                    <select
                      value={expPaidBy}
                      onChange={(e) => setExpPaidBy(e.target.value)}
                      className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none bg-white focus:border-orange-400"
                    >
                      {activePartic.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                      Categoría
                    </label>
                    <select
                      value={expCat}
                      onChange={(e) => setExpCat(e.target.value)}
                      className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none bg-white focus:border-orange-400"
                    >
                      {EXPENSE_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.emoji} {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-2">
                    ¿Quiénes comparten este gasto?
                  </label>
                  <div className="flex overflow-x-auto gap-3 pb-2 snap-x -mx-2 px-2 scrollbar-hide">
                    {activePartic.map((p) => {
                      const isSelected = expSharedBy.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            if (isSelected) {
                              setExpSharedBy(
                                expSharedBy.filter((id) => id !== p.id)
                              );
                            } else {
                              setExpSharedBy([...expSharedBy, p.id]);
                            }
                          }}
                          className={`snap-center flex flex-col items-center gap-1.5 min-w-[3.5rem] transition-all duration-200 active:scale-95 ${
                            isSelected ? "opacity-100" : "opacity-40 grayscale"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-slate-700 transition-all ${
                              isSelected
                                ? "ring-2 ring-orange-500 ring-offset-2 shadow-sm scale-105"
                                : ""
                            }`}
                            style={{ background: getAvatarBg(p.name) }}
                          >
                            {getInitials(p.name)}
                          </div>
                          <span
                            className={`text-[10px] font-semibold text-center truncate w-full ${
                              isSelected ? "text-slate-800" : "text-slate-500"
                            }`}
                          >
                            {p.name.split(" ")[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  disabled={
                    !expDesc ||
                    !expAmt ||
                    !expPaidBy ||
                    expSharedBy.length === 0
                  }
                  onClick={handleAddExpense}
                >
                  Crear Gasto Compartido
                </Button>
              </div>
            )}

            {paseo.finance?.expenses?.length > 0 ? (
              <div className="space-y-3">
                {paseo.finance.expenses.map((e) => {
                  const sharedBy = e.sharedBy || activePartic.map((p) => p.id);
                  const sharedCount = sharedBy.length;
                  const splitAmount =
                    sharedCount > 0 ? e.amount / sharedCount : 0;

                  return (
                    <div
                      key={e.id}
                      className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">
                            {e.description}
                          </h4>
                          <p className="font-extrabold text-orange-500 mt-0.5">
                            {formatCOP(e.amount)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeExpense(e.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1 bg-slate-50 rounded-full"
                          title="Eliminar gasto"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="mb-3">
                        <p className="text-[10px] text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 font-medium">
                          Dividido entre {sharedCount} persona
                          {sharedCount !== 1 ? "s" : ""}. Cada uno le debe{" "}
                          <strong className="text-orange-600 font-extrabold">
                            {formatCOP(splitAmount)}
                          </strong>{" "}
                          a <strong>{e.paidBy}</strong>.
                        </p>
                      </div>

                      <div className="flex overflow-x-auto gap-3 pb-2 snap-x -mx-2 px-2 scrollbar-hide">
                        {activePartic.map((p) => {
                          const isSelected = sharedBy.includes(p.id);
                          return (
                            <button
                              key={p.id}
                              onClick={() =>
                                handleToggleExpenseParticipant(e.id, p.id)
                              }
                              className={`snap-center flex flex-col items-center gap-1.5 min-w-[3.5rem] transition-all duration-200 active:scale-95 ${
                                isSelected
                                  ? "opacity-100"
                                  : "opacity-40 grayscale"
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-slate-700 transition-all ${
                                  isSelected
                                    ? "ring-2 ring-orange-500 ring-offset-2 shadow-sm scale-105"
                                    : ""
                                }`}
                                style={{ background: getAvatarBg(p.name) }}
                              >
                                {getInitials(p.name)}
                              </div>
                              <span
                                className={`text-[10px] font-semibold text-center truncate w-full ${
                                  isSelected
                                    ? "text-slate-800"
                                    : "text-slate-500"
                                }`}
                              >
                                {p.name.split(" ")[0]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200 mt-2">
                <span className="text-4xl mb-3">💸</span>
                <p className="text-sm font-semibold">
                  ¡La billetera está en paz! Cuando haya un gasto extra
                  compartido (como los peajes o cervezas), regístralo aquí y la
                  app lo dividirá estilo Splitwise.
                </p>
              </div>
            )}
          </section>
        </div>
      )}

      {/* ───────────────────────────────────────────── */}
      {/* 🧾 INTERFAZ NUEVA: PARTE-CUENTAS (Rumba y Restaurante) */}
      {/* ───────────────────────────────────────────── */}
      {isShortEvent && (
        <div className="px-4 pt-5 space-y-5 animate-in fade-in duration-300">
          <div className="bg-slate-800 rounded-3xl p-6 text-center relative overflow-hidden shadow-lg shadow-slate-900/20">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Utensils size={100} className="text-white" />
            </div>
            <div className="relative z-10">
              <span className="text-3xl mb-3 block">🍕🍻</span>
              <h2 className="text-xl font-black text-white mb-2">
                El "Tinder" de la Factura
              </h2>
              <p className="text-slate-300 text-xs mb-4">
                La herramienta mágica para dividir cuentas complejas sin pelear.
                Asigna platos a cada amigo y calcula propinas al instante.
              </p>
            </div>
          </div>

          {billItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
              <Receipt size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-bold text-sm mb-1">
                Aún no hay consumos
              </p>
              <p className="text-slate-400 text-xs">
                Agrega los platos de la factura para empezar a dividirlos.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {billItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        {item.description}
                      </h4>
                      <p className="font-extrabold text-orange-500 mt-0.5">
                        {formatCOP(item.amount)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeBillItem(item.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                      title="Eliminar consumo"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="flex overflow-x-auto gap-3 pb-2 snap-x -mx-2 px-2 scrollbar-hide">
                    {activePartic.map((p) => {
                      const isSelected = item.sharedBy?.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={() =>
                            toggleBillItemParticipant(item.id, p.id)
                          }
                          className={`snap-center flex flex-col items-center gap-1.5 min-w-[3.5rem] transition-all duration-200 active:scale-95 ${
                            isSelected ? "opacity-100" : "opacity-40 grayscale"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-slate-700 transition-all ${
                              isSelected
                                ? "ring-2 ring-orange-500 ring-offset-2 shadow-sm scale-105"
                                : ""
                            }`}
                            style={{ background: getAvatarBg(p.name) }}
                          >
                            {getInitials(p.name)}
                          </div>
                          <span
                            className={`text-[10px] font-semibold text-center truncate w-full ${
                              isSelected ? "text-slate-800" : "text-slate-500"
                            }`}
                          >
                            {p.name.split(" ")[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={() => setShowBillModal(true)}
              className="flex flex-col items-center justify-center gap-2 bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-4 text-indigo-600 hover:bg-indigo-100 transition-all active:scale-95"
            >
              <Plus size={24} />
              <span className="text-xs font-bold">Agregar Manual</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 text-slate-500 hover:bg-slate-100 transition-all active:scale-95 relative overflow-hidden">
              <Camera size={24} />
              <span className="text-xs font-bold">Escanear Foto</span>
              <span className="text-[9px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full absolute top-2 right-2">
                Próximamente
              </span>
            </button>
          </div>

          {/* Configuración Rápida y Calculadora Dinámica con Desglose */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 mt-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Percent size={16} className="text-orange-500" />
                <span className="text-sm font-bold text-slate-800">
                  Propina y Servicio
                </span>
              </div>
              <select
                value={tipPercentage}
                onChange={(e) => setTipPercentage(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg px-2 py-1 outline-none"
              >
                <option value={10}>10% (Propina)</option>
                <option value={18}>18% (Propina + Impuesto)</option>
                <option value={0}>0% (Sin extras)</option>
              </select>
            </div>

            {/* Calculadora de Totales por Persona (Con Acordeón/Desglose) */}
            {Object.values(splitTotals).some((t) => t.total > 0) && (
              <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Total a Pagar por Persona
                </p>
                {Object.entries(splitTotals)
                  .filter(([id, t]) => t.total > 0)
                  .map(([id, t]) => {
                    const isExpanded = expandedBill === id;
                    return (
                      <div
                        key={id}
                        className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden mb-2 transition-all duration-200"
                      >
                        <div
                          className="flex justify-between items-center p-3 cursor-pointer hover:bg-slate-100/50"
                          onClick={() =>
                            setExpandedBill(isExpanded ? null : id)
                          }
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-700 flex-shrink-0"
                              style={{ background: getAvatarBg(t.name) }}
                            >
                              {getInitials(t.name)}
                            </div>
                            <div>
                              <span className="text-sm font-bold text-slate-700 block">
                                {t.name.split(" ")[0]}
                              </span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                Ver desglose
                                <ChevronDown
                                  size={10}
                                  className={`transition-transform ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </span>
                            </div>
                          </div>
                          <span className="text-base font-extrabold text-orange-500">
                            {formatCOP(t.finalTotal)}
                          </span>
                        </div>

                        {/* Desglose Individual */}
                        {isExpanded && (
                          <div className="px-3 pb-3 border-t border-slate-100/50 pt-3 bg-white">
                            <ul className="space-y-2 text-xs text-slate-600 mb-3">
                              {t.items.map((item, idx) => (
                                <li
                                  key={idx}
                                  className="flex justify-between items-center"
                                >
                                  <span>
                                    <span className="text-slate-400 font-semibold mr-1">
                                      {item.fraction} de
                                    </span>
                                    {item.name}
                                  </span>
                                  <span className="font-semibold text-slate-700">
                                    {formatCOP(item.amount)}
                                  </span>
                                </li>
                              ))}
                              {t.tipAmount > 0 && (
                                <li className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200 text-slate-500">
                                  <span>
                                    Servicio / Propina ({tipPercentage}%)
                                  </span>
                                  <span className="font-semibold">
                                    {formatCOP(t.tipAmount)}
                                  </span>
                                </li>
                              )}
                            </ul>
                            <div className="flex justify-between items-center pt-2.5 border-t-2 border-slate-100">
                              <span className="text-xs font-bold text-slate-800">
                                Total final
                              </span>
                              <span className="text-sm font-black text-orange-600">
                                {formatCOP(t.finalTotal)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────── */}
      {/* 💳 SECCIONES COMPARTIDAS (Vaca Clásica y Parte-Cuentas) */}
      {/* ───────────────────────────────────────────── */}
      <div className="px-4 mt-8 space-y-8">
        {/* LINKS DE PAGO */}
        <section>
          <h2 className="text-base font-extrabold text-slate-800 mb-3">
            Links de pago 💳
          </h2>
          <div className="space-y-2.5">
            <PaymentLinkCard
              label="Nequi"
              icon="💜"
              placeholder="Número o usuario"
              color="#7C3AED"
              value={paseo.finance?.paymentLinks?.nequi}
              onChange={(v) => updatePaymentLinks({ nequi: v })}
            />
            <PaymentLinkCard
              label="Daviplata"
              icon="🔴"
              placeholder="Número de celular"
              color="#EF4444"
              value={paseo.finance?.paymentLinks?.daviplata}
              onChange={(v) => updatePaymentLinks({ daviplata: v })}
            />
            <PaymentLinkCard
              label="Tus llave Bre-B"
              icon="🟡"
              placeholder="CBU o número de cuenta"
              color="#F59E0B"
              value={paseo.finance?.paymentLinks?.breb}
              onChange={(v) => updatePaymentLinks({ breb: v })}
            />
          </div>
        </section>

        {/* CUENTAS INTERNAS (DEUDAS) */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-extrabold text-slate-800">
              Cuentas internas 🤝
            </h2>
            {unsettled.length > 1 && (
              <button
                onClick={() => setShowSimplify(!showSimplify)}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 active:scale-95 transition-all ${
                  showSimplify
                    ? "bg-orange-100 text-orange-600 border border-orange-200"
                    : "bg-indigo-50 text-indigo-600 border border-indigo-50"
                }`}
              >
                <TrendingUp size={12} />
                {showSimplify ? "Ver Originales" : "Simplificar"}
              </button>
            )}
          </div>

          <button
            onClick={() => setShowDebtModal(true)}
            className="w-full flex flex-col items-center justify-center gap-1.5 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-orange-500 hover:border-orange-200 transition-all active:scale-95 mb-3"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-current">
              <Plus size={16} />
            </div>
            <span className="text-xs font-bold text-current">
              Registrar deuda personal
            </span>
          </button>

          {unsettled.length === 0 && settled.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200 mt-2">
              <span className="text-4xl mb-3">🤝</span>
              <p className="text-sm font-semibold">
                Sin deudas a la vista. Aquí aparecerán los detalles de quién le
                debe a quién para ajustar cuentas sin pelear.
              </p>
            </div>
          ) : showSimplify ? (
            /* VISTA SIMPLIFICADA (SPLITWISE) */
            <div className="space-y-2.5 animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl mb-3">
                <p className="text-xs text-indigo-700 font-semibold text-center">
                  ✨ <strong>Magia activada:</strong> Se cruzaron las cuentas
                  para que hagan la menor cantidad de transferencias posibles.
                </p>
              </div>

              {simplifiedTransactions.length === 0 ? (
                <p className="text-xs text-center text-slate-400 font-semibold py-2">
                  Todo está balanceado mágicamente.
                </p>
              ) : (
                simplifiedTransactions.map((d) => (
                  <DebtCard
                    key={d.id}
                    debt={d}
                    isSimplified={true}
                    onSettle={() => {}}
                    onRemove={() => {}}
                  />
                ))
              )}
            </div>
          ) : (
            /* VISTA ORIGINAL */
            <div className="space-y-2.5 animate-in fade-in duration-300">
              {unsettled.map((d) => (
                <DebtCard
                  key={d.id}
                  debt={d}
                  onSettle={toggleDebtSettled}
                  onRemove={removeDebt}
                />
              ))}
              {settled.length > 0 && (
                <div className="pt-2">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5">
                    Saldadas
                  </p>
                  <div className="space-y-2.5 opacity-75">
                    {settled.map((d) => (
                      <DebtCard
                        key={d.id}
                        debt={d}
                        onSettle={toggleDebtSettled}
                        onRemove={removeDebt}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
