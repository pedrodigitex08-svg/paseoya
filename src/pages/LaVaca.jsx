import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  CheckCircle2,
  Circle,
  Link2,
  Plus,
  X, Settings,
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
  Lock,
  FileDown,
  MessageCircle,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { usePaseo } from "../store/usePaseoStore";
import BottomNav from "../components/layout/BottomNav";
import Button from "../components/ui/Button";

// ─────────────────────────────────────────────
// MOTOR 1: DEUDAS PERSONALES (Intacto)
// ─────────────────────────────────────────────
function calculateSimplifiedDebts(debts = []) {
  const balances = {};
  debts.forEach((d) => {
    if (!d.settled) {
      balances[d.debtor] = (balances[d.debtor] || 0) - d.amount;
      balances[d.creditor] = (balances[d.creditor] || 0) + d.amount;
    }
  });

  const debtors = [];
  const creditors = [];
  for (const [person, amount] of Object.entries(balances)) {
    if (amount < -0.01) debtors.push({ person, amount: -amount });
    if (amount > 0.01) creditors.push({ person, amount });
  }

  const optimized = [];
  let i = 0,
    j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const minAmount = Math.min(debtor.amount, creditor.amount);

    optimized.push({
      id: `opt_debt_${debtor.person.replace(
        /\s+/g,
        ""
      )}_${creditor.person.replace(/\s+/g, "")}`,
      debtor: debtor.person,
      creditor: creditor.person,
      amount: minAmount,
      concept: "Deuda personal simplificada ✨",
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
// MOTOR 2: CRUCE MATEMÁTICO (NETTING) 100% INFALIBLE
// ─────────────────────────────────────────────
function groupDetailedExpenses(
  expenses = [],
  activePartic = [],
  statusFilter = "pending"
) {
  const validIds = new Set(activePartic.map((p) => p.id));

  const normalizeName = (name) => (name || "").trim().toLowerCase();

  const nameToDisplay = {};
  activePartic.forEach((p) => {
    nameToDisplay[normalizeName(p.name)] = p.name;
  });

  const pairsMap = {};

  expenses.forEach((e) => {
    const paidByNorm = normalizeName(e.paidBy);
    if (!paidByNorm || !nameToDisplay[paidByNorm]) return;

    const sharedWith =
      e.sharedWith && e.sharedWith.length > 0
        ? e.sharedWith
        : (e.sharedBy || []).map((id) => {
            const p = activePartic.find((ap) => ap.id === id);
            return { id, name: p?.name || "Usuario", status: "pending" };
          });

    const validSharedWith = sharedWith.filter((sw) => validIds.has(sw.id));

    if (validSharedWith.length > 0) {
      const splitAmount = e.amount / validSharedWith.length;

      validSharedWith.forEach((debtor) => {
        const currentStatus = debtor.status || "pending";
        const debtorNorm = normalizeName(debtor.name);

        if (debtorNorm !== paidByNorm && currentStatus === statusFilter) {
          const p1 = debtorNorm < paidByNorm ? debtorNorm : paidByNorm;
          const p2 = debtorNorm < paidByNorm ? paidByNorm : debtorNorm;

          const key = `${p1}|${p2}`;

          if (!pairsMap[key]) {
            pairsMap[key] = { p1, p2, p1_owes_p2: [], p2_owes_p1: [] };
          }

          if (p1 === debtorNorm) {
            pairsMap[key].p1_owes_p2.push({
              description: e.description,
              amount: splitAmount,
            });
          } else {
            pairsMap[key].p2_owes_p1.push({
              description: e.description,
              amount: splitAmount,
            });
          }
        }
      });
    }
  });

  const groupedList = [];

  for (const key in pairsMap) {
    const pair = pairsMap[key];
    const sum1 = pair.p1_owes_p2.reduce((acc, curr) => acc + curr.amount, 0);
    const sum2 = pair.p2_owes_p1.reduce((acc, curr) => acc + curr.amount, 0);

    let finalDebtorNorm, finalCreditorNorm, netAmount;
    let debtorItems = [],
      creditorItems = [];

    if (sum1 > sum2) {
      finalDebtorNorm = pair.p1;
      finalCreditorNorm = pair.p2;
      netAmount = sum1 - sum2;
      debtorItems = pair.p1_owes_p2;
      creditorItems = pair.p2_owes_p1;
    } else if (sum2 > sum1) {
      finalDebtorNorm = pair.p2;
      finalCreditorNorm = pair.p1;
      netAmount = sum2 - sum1;
      debtorItems = pair.p2_owes_p1;
      creditorItems = pair.p1_owes_p2;
    } else if (sum1 === sum2 && sum1 > 0 && statusFilter === "paid") {
      finalDebtorNorm = pair.p1;
      finalCreditorNorm = pair.p2;
      netAmount = 0;
      debtorItems = pair.p1_owes_p2;
      creditorItems = pair.p2_owes_p1;
    } else {
      continue;
    }

    if (netAmount > 0.01 || statusFilter === "paid") {
      const safeId = `grp_${statusFilter}_${finalDebtorNorm}_${finalCreditorNorm}_${Math.random()
        .toString(36)
        .substr(2, 5)}`;
      groupedList.push({
        id: safeId,
        debtor: nameToDisplay[finalDebtorNorm] || finalDebtorNorm,
        creditor: nameToDisplay[finalCreditorNorm] || finalCreditorNorm,
        debtorNorm: finalDebtorNorm,
        creditorNorm: finalCreditorNorm,
        amount: netAmount,
        debtorItems,
        creditorItems,
      });
    }
  }

  return groupedList;
}

// ─────────────────────────────────────────────
// CALCULADORAS GLOBALES
// ─────────────────────────────────────────────
function calcAdjustedTotalBudget(paseo) {
  if (!paseo) return 0;
  const ingredients = paseo.logistics?.ingredients || [];
  const marketReal = ingredients.reduce(
    (sum, item) => sum + (item.actualCost || item.estimatedCost || 0),
    0
  );
  return (paseo.finance?.totalBudget || 0) + marketReal;
}


function getTripDays(paseo) {
  if (paseo?.isSameDay) return 1;
  const dates = paseo?.tentativeDates?.[0];
  if (dates?.startDate && dates?.endDate) {
    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  }
  return 1;
}

function calcParticipantBaseCuota(paseo, participantId) {
  if (!paseo) return 0;
  
  const activeParticipants = paseo.participants?.filter(p => p.status !== "cancelled") || [];
  if (activeParticipants.length === 0) return 0;

  const maxDays = getTripDays(paseo);
  const ingredients = paseo.logistics?.ingredients || [];
  
  const liquorCost = ingredients
    .filter(i => i.category === "Bebidas")
    .reduce((sum, item) => sum + (item.actualCost || item.estimatedCost || 0), 0);
    
  const generalMarket = ingredients
    .filter(i => i.category !== "Bebidas")
    .reduce((sum, item) => sum + (item.actualCost || item.estimatedCost || 0), 0);
    
  const baseBudget = paseo.finance?.totalBudget || 0;
  const totalGeneral = baseBudget + generalMarket;
  const marketReal = liquorCost + generalMarket;
  const { lblAlojamiento, lblMercado } = getLabels(paseo);

  let totalDaysAll = 0;
  let totalDrinkers = 0;

  activeParticipants.forEach(p => {
    const days = p.daysStayed ?? maxDays;
    const drinks = p.drinksAlcohol ?? true;
    totalDaysAll += days;
    if (drinks) totalDrinkers += 1;
  });

  const costPerDay = totalDaysAll > 0 ? totalGeneral / totalDaysAll : 0;
  const costPerDrinker = totalDrinkers > 0 ? liquorCost / totalDrinkers : 0;

  let myDays = maxDays;
  let myDrinks = true;

  if (participantId) {
    const me = activeParticipants.find(p => p.id === participantId);
    if (me) {
      myDays = me.daysStayed ?? maxDays;
      myDrinks = me.drinksAlcohol ?? true;
    }
  }

  const myBase = myDays * costPerDay;
  const myLiquor = myDrinks ? costPerDrinker : 0;
  
  return myBase + myLiquor;
}

function calcBaseCuota(paseo) {
  return calcParticipantBaseCuota(paseo, null); // Legacy wrapper / default max cuota
}


function calcBusAddonForPerson(paseo, participantId) {
  const { bus } = paseo.logistics?.transport || { bus: {} };
  if (
    !bus.enabled ||
    bus.totalCost <= 0 ||
    !bus.assignedParticipants
  )
    return 0;
  return bus.assignedParticipants.includes(participantId)
    ? bus.totalCost / bus.assignedParticipants.length
    : 0;
}

function calcRecaudo(paseo) {
  const paid =
    paseo.participants?.filter((p) => p.hasPaid && p.status !== "cancelled")
      .length || 0;
  const total =
    paseo.participants?.filter((p) => p.status !== "cancelled").length || 0;
  return total === 0 ? 0 : Math.round((paid / total) * 100);
}

// ─────────────────────────────────────────────
// CONSTANTES UI
// ─────────────────────────────────────────────
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
const getAvatarBg = (name) => AVATAR_COLORS[(name || "").charCodeAt(0) % 8];
const getInitials = (name) =>
  (name || "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// ─────────────────────────────────────────────
// UI: TARJETA DE DEUDA CRUZADA (PENDIENTE)
// ─────────────────────────────────────────────
function GroupedDebtCard({ debt, onSettle, isLocked }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-indigo-50/30 border border-indigo-100 rounded-2xl overflow-hidden transition-all duration-200 shadow-sm">
      <div
        className="p-3 cursor-pointer hover:bg-indigo-50/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-700"
              style={{ background: getAvatarBg(debt.creditor) }}
            >
              {getInitials(debt.creditor)}
            </div>
          </div>

          <ArrowRight size={12} className="text-indigo-400 flex-shrink-0" />

          <div className="flex items-center gap-1.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-700"
              style={{ background: getAvatarBg(debt.debtor) }}
            >
              {getInitials(debt.debtor)}
            </div>
          </div>

          <div className="flex-1 text-right">
            <span className="text-sm font-extrabold text-indigo-600">
              {formatCOP(debt.amount)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-1">
          <p className="text-[11px] font-semibold text-slate-600">
            <strong className="text-slate-800">
              {debt.debtor.split(" ")[0]}
            </strong>{" "}
            debe a{" "}
            <strong className="text-slate-800">
              {debt.creditor.split(" ")[0]}
            </strong>
          </p>
          <div className="flex items-center gap-1 text-[10px] text-indigo-500 font-bold bg-indigo-100 px-2 py-0.5 rounded-full">
            Ver detalle
            <ChevronDown
              size={10}
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 border-t border-indigo-100/50 pt-2 bg-white">
          <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
            Cruce de cuentas:
          </p>
          <ul className="space-y-1.5 mb-2">
            {debt.debtorItems.map((item, idx) => (
              <li
                key={`d_${idx}`}
                className="flex justify-between items-center text-xs text-slate-600"
              >
                <span className="truncate mr-2">🔴 {item.description}</span>
                <span className="font-semibold text-red-500 flex-shrink-0">
                  +{formatCOP(item.amount)}
                </span>
              </li>
            ))}
            {debt.creditorItems.map((item, idx) => (
              <li
                key={`c_${idx}`}
                className="flex justify-between items-center text-xs text-slate-600"
              >
                <span className="truncate mr-2">
                  🟢 A favor ({item.description})
                </span>
                <span className="font-semibold text-teal-500 flex-shrink-0">
                  -{formatCOP(item.amount)}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center border-t border-slate-100 pt-2 mb-3">
            <span className="text-xs font-bold text-slate-700">
              Total Neto a pagar:
            </span>
            <span className="text-sm font-black text-indigo-600">
              {formatCOP(debt.amount)}
            </span>
          </div>

          {!isLocked && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSettle(debt.debtorNorm, debt.creditorNorm);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold bg-green-500 text-white hover:bg-green-600 transition-all active:scale-95 shadow-sm"
            >
              <CheckCircle2 size={14} /> Saldar cuenta cruzada
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// UI: TARJETA DE DEUDA SALDADA (GRIS)
// ─────────────────────────────────────────────
function SettledGroupedDebtCard({ debt }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 opacity-75">
      <div
        className="p-3 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500 grayscale"
              style={{ background: getAvatarBg(debt.creditor) }}
            >
              {getInitials(debt.creditor)}
            </div>
          </div>

          <ArrowRight size={12} className="text-slate-300 flex-shrink-0" />

          <div className="flex items-center gap-1.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500 grayscale"
              style={{ background: getAvatarBg(debt.debtor) }}
            >
              {getInitials(debt.debtor)}
            </div>
          </div>

          <div className="flex-1 text-right">
            <span className="text-sm font-extrabold text-slate-400 line-through">
              {formatCOP(debt.amount)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-1">
          <p className="text-[11px] font-semibold text-slate-500">
            <strong className="text-slate-600">
              {debt.debtor.split(" ")[0]}
            </strong>{" "}
            pagó a{" "}
            <strong className="text-slate-600">
              {debt.creditor.split(" ")[0]}
            </strong>
          </p>
          <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
            <Check size={10} /> Saldada
            <ChevronDown
              size={10}
              className={`transition-transform ml-1 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 border-t border-slate-200 pt-2 bg-slate-50/50">
          <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
            Historial del cruce:
          </p>
          <ul className="space-y-1.5">
            {debt.debtorItems.map((item, idx) => (
              <li
                key={`d_${idx}`}
                className="flex justify-between items-center text-xs text-slate-400"
              >
                <span className="truncate mr-2">• {item.description}</span>
                <span className="font-semibold">{formatCOP(item.amount)}</span>
              </li>
            ))}
            {debt.creditorItems.map((item, idx) => (
              <li
                key={`c_${idx}`}
                className="flex justify-between items-center text-xs text-slate-400"
              >
                <span className="truncate mr-2">
                  • A favor ({item.description})
                </span>
                <span className="font-semibold">-{formatCOP(item.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

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

function DebtCard({ debt, onSettle, onRemove, isSimplified, isLocked }) {
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
        ) : isLocked ? (
          <div className="flex items-center gap-2 mt-2">
            <div
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-extrabold ${
                debt.settled
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {debt.settled ? (
                <>
                  <Check size={12} /> Saldada
                </>
              ) : (
                <>
                  <Circle size={12} /> Pendiente
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-2">
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

function ParticipantPayRow({
  participant,
  paseo,
  onToggle,
  currentUser,
  isLocked,
  onOpenSettings,
}) {
  const [expanded, setExpanded] = useState(false);
  const isActive = participant.status !== "cancelled";
  const baseCuota = calcParticipantBaseCuota(paseo, participant?.id || currentUser?.id);
  const busAddon = calcBusAddonForPerson(paseo, participant.id);
  const totalCuota = baseCuota + busAddon;
  const hasBusAddon = busAddon > 0;
  const activeCount =
    paseo.participants?.filter((p) => p.status !== "cancelled").length || 0;
  const { bus } = paseo.logistics?.transport || { bus: {} };

  const baseBudget = paseo.finance?.totalBudget || 0;
  const ingredients = paseo.logistics?.ingredients || [];
  
  const liquorCost = ingredients.filter(i => i.category === "Bebidas").reduce((sum, item) => sum + (item.actualCost || item.estimatedCost || 0), 0);
  const generalMarket = ingredients.filter(i => i.category !== "Bebidas").reduce((sum, item) => sum + (item.actualCost || item.estimatedCost || 0), 0);
  const totalGeneral = baseBudget + generalMarket;
  const marketReal = liquorCost + generalMarket;
  const { lblAlojamiento, lblMercado } = getLabels(paseo);

  const maxDays = getTripDays(paseo);
  const activeParticipants = paseo.participants?.filter(p => p.status !== "cancelled") || [];
  
  let totalDaysAll = 0;
  let totalDrinkers = 0;
  activeParticipants.forEach(p => {
    totalDaysAll += (p.daysStayed ?? maxDays);
    if (p.drinksAlcohol !== false) totalDrinkers += 1;
  });

  const costPerDay = totalDaysAll > 0 ? totalGeneral / totalDaysAll : 0;
  const costPerDrinker = totalDrinkers > 0 ? liquorCost / totalDrinkers : 0;

  const myDays = participant.daysStayed ?? maxDays;
  const myDrinks = participant.drinksAlcohol ?? true;

  const myBaseBudget = (myDays * costPerDay) * (baseBudget / (totalGeneral || 1));
  const myMarket = (myDays * costPerDay) * (generalMarket / (totalGeneral || 1)) + (myDrinks ? costPerDrinker : 0);


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

            {!isLocked && (
              <button 
                onClick={(e) => { e.stopPropagation(); onOpenSettings(participant); }}
                className="p-1 text-slate-400 hover:text-indigo-500 transition-colors rounded-full hover:bg-indigo-50"
              >
                <Settings size={12} />
              </button>
            )}
            <div className="w-full mt-0.5 flex gap-2 text-[10px] text-slate-400">
              <span>{participant.daysStayed ?? getTripDays(paseo)} das</span>
              <span>&middot;</span>
              <span>{participant.drinksAlcohol !== false ? "🍸 Toma licor" : "🚫 Sin licor"}</span>
            </div>

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

          {currentUser?.role === "host" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isLocked && isActive) onToggle(participant.id);
              }}
              disabled={!isActive || isLocked}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                participant.hasPaid
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              } ${
                !isActive || isLocked
                  ? "opacity-50 cursor-not-allowed"
                  : "active:scale-95"
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
            className="rounded-xl overflow-hidden border border-slate-200 shadow-sm"
            style={{
              background: "#ffffff",
              backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }}
          >
            {/* Cabecera de la factura */}
            <div className="px-4 py-3 border-b-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Receipt size={14} className="text-slate-500" />
                <p className="text-[11px] font-extrabold text-slate-700 uppercase tracking-widest">
                  Factura Desglose
                </p>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                {new Date().toLocaleDateString("es-CO")}
              </p>
            </div>

            <div className="p-4 space-y-3 font-mono text-sm">
              
              {/* Item: Alojamiento / Base */}
              <div className="flex items-start justify-between gap-2 text-slate-600">
                <div>
                    <p className="font-bold text-slate-700">{lblAlojamiento}</p>
                  <p className="text-[10px] text-slate-400">
                    {formatCOP(baseBudget)} / {activeCount} pers.
                  </p>
                </div>
                <span className="font-bold flex-shrink-0 text-slate-700">
                  {formatCOP(myBaseBudget)}
                </span>
              </div>

              {/* Item: Mercado (si hay) */}
              {marketReal > 0 && (
                <div className="flex items-start justify-between gap-2 text-slate-600">
                  <div>
                      <p className="font-bold text-slate-700">{lblMercado}</p>
                    <p className="text-[10px] text-slate-400">
                      {formatCOP(marketReal)} / {activeCount} pers.
                    </p>
                  </div>
                  <span className="font-bold flex-shrink-0 text-slate-700">
                    {formatCOP(myMarket)}
                  </span>
                </div>
              )}

              {/* Item: Transporte Individual (si hay) */}
              {hasBusAddon && (
                <div className="flex items-start justify-between gap-2 text-teal-700">
                  <div>
                    <p className="font-bold">🚌 Transporte (Cupo)</p>
                    <p className="text-[10px] text-teal-600/70">
                      {bus.vendor ? `${bus.vendor} • ` : ""}
                      {formatCOP(bus.totalCost)} / {bus.assignedParticipants.length} asign.
                    </p>
                  </div>
                  <span className="font-bold flex-shrink-0">
                    +{formatCOP(busAddon)}
                  </span>
                </div>
              )}

              {/* Divider Total */}
              <div className="pt-3 border-t-2 border-dashed border-slate-300 mt-2 flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-slate-800 uppercase tracking-widest text-xs">
                    Total a Pagar
                  </p>
                </div>
                <span className="text-xl font-extrabold" style={{ color: "#F97316" }}>
                  {formatCOP(totalCuota)}
                </span>
              </div>
            </div>
            
            {/* Pie de factura de adorno */}
            <div className="h-2 w-full" style={{
              backgroundImage: "radial-gradient(circle, transparent, transparent 4px, #ffffff 4px, #ffffff 10px, transparent 10px)",
              backgroundSize: "20px 10px",
              backgroundPosition: "bottom",
              backgroundRepeat: "repeat-x",
              marginBottom: "-2px"
            }} />
          </div>

          <div
            className={`mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold ${
              participant.hasPaid
                ? "bg-green-100 text-green-700"
                : "bg-amber-50 text-amber-600 border border-amber-200"
            }`}
          >
            {participant.hasPaid ? (
              <>
                <CheckCircle2 size={13} /> ¡Cuota pagada! Gracias {participant.name.split(" ")[0]} 🎉
              </>
            ) : (
              <>
                <Circle size={13} /> Pago pendiente de {formatCOP(totalCuota)}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentLinkCard({
  label,
  icon,
  placeholder,
  value,
  onChange,
  color,
  isLocked,
}) {
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
          {!isLocked &&
            (editing ? (
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
            ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────

const getLabels = (paseo) => {
  const isShortEvent =
    paseo?.category === "rumba" ||
    paseo?.category === "restaurante" ||
    paseo?.category === "asado" ||
    paseo?.category === "regalo" ||
    paseo?.category === "futbol";

  let lblAlojamiento = "🏠 Alojamiento & Base";
  let lblMercado = "🛒 Comida y Mercado";
  let lblMercadoMini = "🛒 Mercado (Menú)";
  let lblPdfHospedaje = "Hospedaje Base:";
  let lblPdfMercado = "Mercado / Menu:";

  if (paseo?.category === "futbol") {
    lblAlojamiento = "⚽ Alquiler Cancha";
    lblMercado = "⏱️ Árbitro e Hidratación";
    lblMercadoMini = "⏱️ Árbitro e Hidratación";
    lblPdfHospedaje = "Alquiler Cancha:";
    lblPdfMercado = "Árbitro e Hidratación:";
  } else if (paseo?.category === "regalo") {
    lblAlojamiento = "🎁 Meta del Regalo";
    lblMercado = "🎀 Gastos Adicionales";
    lblMercadoMini = "🎀 Gastos Extras";
    lblPdfHospedaje = "Meta del Regalo:";
    lblPdfMercado = "Gastos Adicionales:";
  } else if (paseo?.category === "asado") {
    lblAlojamiento = "🔥 Presupuesto Asado";
    lblMercado = "🍻 Bebidas y Extras";
    lblMercadoMini = "🍻 Bebidas/Extras";
    lblPdfHospedaje = "Presupuesto Asado:";
    lblPdfMercado = "Extras (Bebidas, etc):";
  } else if (isShortEvent) {
    lblAlojamiento = "💸 Consumo Base";
    lblMercado = "💰 Extras / Propinas";
    lblMercadoMini = "💰 Extras / Propinas";
    lblPdfHospedaje = "Consumo Base:";
    lblPdfMercado = "Extras / Propinas:";
  }
  
  return { lblAlojamiento, lblMercado, lblMercadoMini, lblPdfHospedaje, lblPdfMercado, isShortEvent };
};


function ParticipantSettingsModal({ participant, paseo, onClose }) {
  const [days, setDays] = useState(participant?.daysStayed ?? getTripDays(paseo));
  const [drinks, setDrinks] = useState(participant?.drinksAlcohol ?? true);

  const handleSave = () => {
    const updatedParticipants = paseo.participants.map(p => 
      p.id === participant.id 
        ? { ...p, daysStayed: days, drinksAlcohol: drinks } 
        : p
    );
    usePaseo.getState().updatePaseo(paseo.id, { participants: updatedParticipants });
    onClose();
  };

  if (!participant) return null;

  const maxDays = getTripDays(paseo);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-extrabold text-slate-800 text-lg">Ajustar Cuota</h3>
          <button onClick={onClose} className="p-2 text-slate-400 bg-slate-100 rounded-full">
            <X size={16} />
          </button>
        </div>
        
        <p className="text-sm font-bold text-slate-600 mb-4">{participant.name}</p>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Días de Asistencia</label>
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl">
              <button 
                onClick={() => setDays(d => Math.max(1, d - 1))}
                className="w-10 h-10 bg-white rounded-xl shadow-sm text-slate-600 font-bold text-lg disabled:opacity-50"
                disabled={days <= 1}
              >-</button>
              <span className="font-extrabold text-slate-700">{days} {days === 1 ? 'día' : 'días'}</span>
              <button 
                onClick={() => setDays(d => Math.min(maxDays, d + 1))}
                className="w-10 h-10 bg-white rounded-xl shadow-sm text-slate-600 font-bold text-lg disabled:opacity-50"
                disabled={days >= maxDays}
              >+</button>
            </div>
            <p className="text-[10px] text-slate-400 text-center">Máximo {maxDays} días (duración del paseo)</p>
          </div>

          <div className="flex items-center justify-between bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
            <div>
              <p className="text-sm font-bold text-slate-700">Toma Licor / Bebidas</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Participa en la vaca de bebidas</p>
            </div>
            <button 
              onClick={() => setDrinks(!drinks)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${drinks ? "bg-indigo-500" : "bg-slate-300"}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${drinks ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl active:scale-[0.98] transition-transform"
          >
            Guardar Ajustes
          </button>
        </div>
      </div>
    </div>
  );
}

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

  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [budgetInput, setBudgetInput] = useState("");
  const [editBudget, setEditBudget] = useState(false);
  const [showExpForm, setShowExpForm] = useState(false);
  const [showDebtModal, setShowDebtModal] = useState(false);

  const [showSimplifyDebts, setShowSimplifyDebts] = useState(false);
  const [showSimplifyExpenses, setShowSimplifyExpenses] = useState(false);

  const [expDesc, setExpDesc] = useState("");
  const [expAmt, setExpAmt] = useState("");
  const [expCat, setExpCat] = useState("otro");
  const [expPaidBy, setExpPaidBy] = useState("");
  const [expSharedBy, setExpSharedBy] = useState([]);

  const [showBillModal, setShowBillModal] = useState(false);
  const [billDesc, setBillDesc] = useState("");
  const [billAmt, setBillAmt] = useState("");
  const [tipPercentage, setTipPercentage] = useState(10);
  const [expandedBill, setExpandedBill] = useState(null);

  const paseo = state.activePaseo;
  const activePartic =
    paseo?.participants?.filter((p) => p.status !== "cancelled") || [];
  const validIds = new Set(activePartic.map((p) => p.id));
  const currentUser = state.currentUser;
  const [settingsParticipant, setSettingsParticipant] = useState(null);

  const isLocked = paseo?.estado === "finalizado";

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

  useEffect(() => {
    if (activePartic.length > 0 && !expPaidBy && currentUser) {
      setExpPaidBy(currentUser.name);
      setExpSharedBy(activePartic.map((p) => p.id));
    }
  }, [activePartic, expPaidBy, currentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-bold animate-pulse">
          Cargando cuentas...
        </p>
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
          El evento que buscas no existe o el enlace es incorrecto.
        </p>
      </div>
    );
  }

  const { lblAlojamiento, lblMercado, lblMercadoMini, lblPdfHospedaje, lblPdfMercado, isShortEvent } = getLabels(paseo);


  const adjustedTotalBudget = calcAdjustedTotalBudget(paseo);
  const ingredients = paseo.logistics?.ingredients || [];
  const marketReal = ingredients.reduce(
    (sum, item) => sum + (item.actualCost || item.estimatedCost || 0),
    0
  );
  const recaudoPct = calcRecaudo(paseo);
  const baseCuota = calcParticipantBaseCuota(paseo, currentUser?.id);
  const myTransport = calcBusAddonForPerson(paseo, currentUser?.id);
  const myTotal = baseCuota + myTransport;
  const paidCount = activePartic.filter((p) => p.hasPaid).length;
  const pendingCount = activePartic.length - paidCount;
  const collected = paidCount * baseCuota;
  const balance = collected - adjustedTotalBudget;

  const debts = paseo.finance?.debts || [];
  const expenses = paseo.finance?.expenses || [];
  const unsettled = debts.filter((d) => !d.settled);
  const settled = debts.filter((d) => d.settled);

  const simplifiedDebts = calculateSimplifiedDebts(unsettled);
  const groupedPendingExpenses = groupDetailedExpenses(
    expenses,
    activePartic,
    "pending"
  );
  const groupedSettledExpenses = groupDetailedExpenses(
    expenses,
    activePartic,
    "paid"
  );

  const handleBudgetSave = () => {
    if (isLocked) return;
    const val = parseInt(budgetInput.replace(/\D/g, "")) || 0;
    if (val > 0) updateBudget(val);
    setBudgetInput("");
    setEditBudget(false);
  };

  const handleAddExpense = () => {
    if (isLocked || !expDesc || !expAmt || !expPaidBy) return;

    const sharedWithArray = activePartic
      .filter((p) =>
        (expSharedBy.length > 0
          ? expSharedBy
          : activePartic.map((ap) => ap.id)
        ).includes(p.id)
      )
      .map((p) => ({
        id: p.id,
        name: p.name,
        status: p.name === expPaidBy ? "paid" : "pending",
      }));

    addExpense({
      description: expDesc,
      amount: parseInt(expAmt),
      paidBy: expPaidBy,
      category: expCat,
      sharedWith: sharedWithArray,
    });

    setExpDesc("");
    setExpAmt("");
    setShowExpForm(false);
    setExpSharedBy(activePartic.map((p) => p.id));
  };

  const handleToggleExpenseParticipant = async (expenseId, participantId) => {
    if (isLocked || !updatePaseo || !paseo?.id) return;
    const newExpenses = expenses.map((e) => {
      if (e.id === expenseId) {
        const currentSharedWith =
          e.sharedWith && e.sharedWith.length > 0
            ? e.sharedWith
            : (e.sharedBy || []).map((id) => {
                const p = activePartic.find((ap) => ap.id === id);
                return {
                  id,
                  name: p?.name || "Usuario",
                  status: p && p.name === e.paidBy ? "paid" : "pending",
                };
              });

        const newSharedWith = currentSharedWith.map((sw) => {
          if (sw.id === participantId)
            return {
              ...sw,
              status: sw.status === "pending" ? "paid" : "pending",
            };
          return sw;
        });
        return { ...e, sharedWith: newSharedWith };
      }
      return e;
    });
    await updatePaseo(paseo.id, {
      finance: { ...paseo.finance, expenses: newExpenses },
    });
  };

  const handleSettleGroupedExpense = async (debtorNorm, creditorNorm) => {
    if (isLocked || !updatePaseo || !paseo?.id) return;

    const newExpenses = expenses.map((e) => {
      let wasModified = false;
      const safePaidBy = (e.paidBy || "").trim().toLowerCase();

      if (safePaidBy === creditorNorm) {
        const currentSharedWith =
          e.sharedWith && e.sharedWith.length > 0
            ? e.sharedWith
            : (e.sharedBy || []).map((id) => ({
                id,
                name:
                  activePartic.find((ap) => ap.id === id)?.name || "Usuario",
                status: "pending",
              }));

        const newSharedWith = currentSharedWith.map((sw) => {
          if (
            sw.name &&
            sw.name.trim().toLowerCase() === debtorNorm &&
            (sw.status === "pending" || !sw.status)
          ) {
            wasModified = true;
            return { ...sw, status: "paid" };
          }
          return sw;
        });

        if (wasModified) return { ...e, sharedWith: newSharedWith };
      }

      if (safePaidBy === debtorNorm) {
        const currentSharedWith =
          e.sharedWith && e.sharedWith.length > 0
            ? e.sharedWith
            : (e.sharedBy || []).map((id) => ({
                id,
                name:
                  activePartic.find((ap) => ap.id === id)?.name || "Usuario",
                status: "pending",
              }));

        const newSharedWith = currentSharedWith.map((sw) => {
          if (
            sw.name &&
            sw.name.trim().toLowerCase() === creditorNorm &&
            (sw.status === "pending" || !sw.status)
          ) {
            wasModified = true;
            return { ...sw, status: "paid" };
          }
          return sw;
        });

        if (wasModified) return { ...e, sharedWith: newSharedWith };
      }

      return e;
    });

    await updatePaseo(paseo.id, {
      finance: { ...paseo.finance, expenses: newExpenses },
    });
  };

  // Lógica Parte-Cuentas
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

  // ─────────────────────────────────────────────
  // 📥 DESCARGAR REPORTE PDF
  // ─────────────────────────────────────────────
  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const orange = [249, 115, 22];
    const slate800 = [30, 41, 59];
    const slate400 = [148, 163, 184];
    const greenColor = [22, 163, 74];
    const amberColor = [217, 119, 6];
    const pageW = 210;
    const margin = 18;
    let y = 0;

    doc.setFillColor(...orange);
    doc.rect(0, 0, pageW, 36, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("PaseoYa", margin, 16);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Reporte de Finanzas del Paseo", margin, 24);
    doc.setFontSize(8);
    doc.text(new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" }), margin, 31);

    y = 48;
    doc.setTextColor(...slate800);
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text(`${paseo.emoji || ""} ${paseo.name}`, margin, y);
    y += 11;

    doc.setFillColor(254, 243, 199);
    doc.roundedRect(margin, y, pageW - margin * 2, 38, 3, 3, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...slate400);
    doc.text("RESUMEN FINANCIERO", margin + 4, y + 7);
    doc.setFontSize(10);
    doc.setTextColor(...slate800);
    doc.text(lblPdfHospedaje, margin + 4, y + 16);
    doc.text(formatCOP(paseo.finance?.totalBudget || 0), pageW - margin - 4, y + 16, { align: "right" });
    doc.text(lblPdfMercado, margin + 4, y + 24);
    doc.text(formatCOP(marketReal), pageW - margin - 4, y + 24, { align: "right" });
    doc.setDrawColor(...orange);
    doc.setLineWidth(0.4);
    doc.line(margin + 4, y + 28, pageW - margin - 4, y + 28);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...orange);
    doc.text("TOTAL COMPARTIDO:", margin + 4, y + 36);
    doc.text(formatCOP(adjustedTotalBudget), pageW - margin - 4, y + 36, { align: "right" });
    y += 44;

    doc.setFontSize(9);
    doc.setTextColor(...slate400);
    doc.setFont("helvetica", "normal");
    doc.text(`Cuota base por persona (${activePartic.length} asistentes): ${formatCOP(baseCuota)}`, margin, y);
    y += 13;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...slate800);
    doc.text("Estado de Pagos por Persona", margin, y);
    y += 7;

    activePartic.forEach((p, i) => {
      const bg = i % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
      doc.setFillColor(...bg);
      doc.rect(margin, y - 4, pageW - margin * 2, 10, "F");
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...slate800);
      doc.text(p.name, margin + 3, y + 2);
      const cuota = calcParticipantBaseCuota(paseo, p.id) + calcBusAddonForPerson(paseo, p.id);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...slate400);
      doc.text(formatCOP(cuota), margin + 80, y + 2);
      if (p.hasPaid) {
        doc.setTextColor(...greenColor);
        doc.setFont("helvetica", "bold");
        doc.text("PAGO", pageW - margin - 4, y + 2, { align: "right" });
      } else {
        doc.setTextColor(...amberColor);
        doc.setFont("helvetica", "bold");
        doc.text("PENDIENTE", pageW - margin - 4, y + 2, { align: "right" });
      }
      y += 11;
      if (y > 260) { doc.addPage(); y = 20; }
    });

    y += 6;

    if (expenses.length > 0) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...slate800);
      doc.text("Gastos Extras Compartidos", margin, y);
      y += 7;
      expenses.forEach((e) => {
        const cat = EXPENSE_CATEGORIES.find((c) => c.id === e.category);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...slate800);
        doc.text(`${cat?.label || "Otro"}: ${e.description}`, margin + 3, y);
        doc.setTextColor(...orange);
        doc.setFont("helvetica", "bold");
        doc.text(formatCOP(e.amount), pageW - margin - 4, y, { align: "right" });
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...slate400);
        doc.setFontSize(8);
        doc.text(`Pago: ${e.paidBy}`, margin + 3, y + 5);
        y += 13;
        if (y > 260) { doc.addPage(); y = 20; }
      });
    }

    doc.setFontSize(7);
    doc.setTextColor(...slate400);
    doc.text("Generado con PaseoYa - paseoya.vercel.app", pageW / 2, 287, { align: "center" });
    doc.save(`PaseoYa_Reporte_${(paseo.name || "paseo").replace(/\s+/g, "_")}.pdf`);
  };

  // ─────────────────────────────────────────────
  // 💬 COBRAR SIN PENA (WhatsApp)
  // ─────────────────────────────────────────────
  const handleWhatsAppReminder = (participant) => {
    const cuota = calcParticipantBaseCuota(paseo, participant.id) + calcBusAddonForPerson(paseo, participant.id);
    const nombre = participant.name.split(" ")[0];
    const msg = encodeURIComponent(
      `Hola ${nombre}! Te recuerdo con carino (y sin pena!) que tu cuota para *${paseo.name}* es de *${formatCOP(cuota)}*.\n\nCuando puedas mandame la platica para cerrar la vaca!\n\n_Enviado desde PaseoYa - paseoya.vercel.app_`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  return (

    <div className="min-h-screen bg-slate-50 pb-24 relative">
      {showDebtModal && !isLocked && (
        <DebtModal
          participants={activePartic}
          onSubmit={(d) => {
            addDebt(d);
            setShowDebtModal(false);
          }}
          onClose={() => setShowDebtModal(false)}
        />
      )}

      {showBillModal && !isLocked && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">Agregar Consumo</h3>
              <button
                onClick={() => setShowBillModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  value={billDesc}
                  onChange={(e) => setBillDesc(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-orange-400"
                  placeholder="Ej: Pizza familiar, Picada..."
                  autoFocus
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Precio Total
                </label>
                <input
                  type="number"
                  value={billAmt}
                  onChange={(e) => setBillAmt(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-orange-400"
                  placeholder="Ej: 45000"
                  min="0"
                />
              </div>
              <Button
                variant="primary"
                fullWidth
                disabled={!billDesc || !billAmt || Number(billAmt) <= 0}
                onClick={() => {
                  addBillItem({
                    description: billDesc,
                    amount: parseInt(billAmt) || 0,
                  });
                  setShowBillModal(false);
                  setBillDesc("");
                  setBillAmt("");
                }}
              >
                Guardar Consumo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Barra Superior Fija */}
      <div
        className="bg-white px-4 pt-12 pb-3 sticky top-0 z-40 border-b border-slate-100 flex items-center gap-3"
        style={{ boxShadow: "0 2px 8px -2px rgba(15,23,42,0.04)" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <ChevronLeft size={18} className="text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-extrabold text-slate-900 leading-tight">
            {!isShortEvent ? "Finanzas y Pagos" : "Cuentas Claras"}
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

        <div
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 shadow-sm flex items-center justify-center ml-1"
          title="PaseoYa"
        >
          <span className="text-orange-500 font-black text-[11px] tracking-tighter drop-shadow-sm">
            PY
          </span>
        </div>
      </div>

      {isLocked && (
        <div className="bg-slate-800 px-4 py-2.5 flex items-center justify-center gap-2 shadow-sm relative z-30">
          <Lock size={14} className="text-orange-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Plan Finalizado · Solo Lectura
          </span>
        </div>
      )}

      {/* 🐄 VACA PRINCIPAL */}
      {!isShortEvent && (
        <div className="px-4 pt-5 space-y-5 animate-in fade-in duration-300">
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
            <div className="mx-4 mb-3 bg-white/10 border border-white/20 rounded-xl p-3 shadow-sm">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-white/90 text-sm">
                  <span className="flex items-center gap-1.5">
                    🏠 Hospedaje y Base
                    {!isLocked && currentUser?.role === "host" && (
                      <button
                        onClick={() => {
                          setBudgetInput(
                            String(paseo.finance?.totalBudget || "")
                          );
                          setEditBudget(true);
                        }}
                        className="text-white/50 hover:text-white transition-colors text-xs"
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
                        className="w-20 bg-white/20 text-white text-sm font-bold rounded px-1.5 py-0.5 outline-none text-right border border-white/30"
                        autoFocus
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleBudgetSave()
                        }
                      />
                      <button
                        onClick={handleBudgetSave}
                        className="text-white text-[10px] bg-orange-500 rounded px-2 py-1 font-bold shadow-sm"
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
                  <span>{lblMercadoMini}</span>
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

          {/* Barra de Recaudo */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
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
              />
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
                className={`rounded-xl p-2 flex flex-col justify-center ${
                  balance >= 0 ? "bg-teal-50" : "bg-red-50"
                }`}
              >
                <p
                  className={`text-sm font-extrabold truncate ${
                    balance >= 0 ? "text-teal-600" : "text-red-500"
                  }`}
                >
                  {formatCOP(balance)}
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

          {/* Panel del Tesorero */}
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
                    isLocked={isLocked}
                      onOpenSettings={setSettingsParticipant}
                  />
                ))}
            </div>
          </section>

          {/* ─── ACCIONES RÁPIDAS: PDF + COBRAR SIN PENA ─── */}
          <section>
            <div className="mb-3 mt-2">
              <h2 className="text-base font-extrabold text-slate-800">Acciones del Anfitrión ⚡</h2>
              <p className="text-xs text-slate-400 font-medium">Descarga el reporte o cobra la cuota por WhatsApp</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* Botón PDF */}
              <button
                onClick={handleDownloadPDF}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-orange-50 hover:border-orange-200 active:scale-95 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <FileDown size={20} className="text-orange-500" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-extrabold text-slate-800">Descargar PDF</p>
                  <p className="text-[10px] text-slate-400 font-medium">Reporte de gastos</p>
                </div>
              </button>

              {/* Botón Cobrar Sin Pena – abre selector */}
              <button
                onClick={() => {
                  const pending = activePartic.filter((p) => !p.hasPaid);
                  if (pending.length === 0) {
                    alert("¡Todos han pagado! 🎉 No hay nadie pendiente.");
                    return;
                  }
                  if (pending.length === 1) {
                    handleWhatsAppReminder(pending[0]);
                    return;
                  }
                  const names = pending.map((p, i) => `${i + 1}. ${p.name}`).join("\n");
                  const idx = prompt(`¿A quién quieres cobrarle?\n\n${names}\n\nEscribe el número:`);
                  const chosen = pending[parseInt(idx) - 1];
                  if (chosen) handleWhatsAppReminder(chosen);
                }}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-green-50 hover:border-green-200 active:scale-95 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <MessageCircle size={20} className="text-green-600" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-extrabold text-slate-800">Cobrar sin Pena</p>
                  <p className="text-[10px] text-slate-400 font-medium">Recordatorio WhatsApp</p>
                </div>
              </button>
            </div>

            {/* Sub-lista de pendientes con botón directo */}
            {activePartic.filter((p) => !p.hasPaid).length > 0 && (
              <div className="mt-3 bg-amber-50 border border-amber-100 rounded-2xl p-3 space-y-2">
                <p className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider">Pendientes de pago</p>
                {activePartic
                  .filter((p) => !p.hasPaid)
                  .map((p) => {
                    const cuota = calcParticipantBaseCuota(paseo, p.id) + calcBusAddonForPerson(paseo, p.id);
                    return (
                      <div key={p.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-700"
                            style={{ background: getAvatarBg(p.name) }}
                          >
                            {getInitials(p.name)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{p.name.split(" ")[0]}</p>
                            <p className="text-[10px] text-amber-600 font-semibold">{formatCOP(cuota)} pendiente</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleWhatsAppReminder(p)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-green-500 text-white text-[10px] font-extrabold rounded-full hover:bg-green-600 active:scale-95 transition-all"
                        >
                          <MessageCircle size={10} /> Cobrar
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}
          </section>

          {/* Gastos Extras */}
          <section>
            <div className="flex items-center justify-between mb-3 mt-8">
              <div>
                <h2 className="text-base font-extrabold text-slate-800">
                  Gastos Extras 💸
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Cuentas compartidas independientes a la vaca
                </p>
              </div>
              <div className="flex items-center gap-2">
                {expenses.length > 0 && (
                  <button
                    onClick={() =>
                      setShowSimplifyExpenses(!showSimplifyExpenses)
                    }
                    className={`text-[10px] font-bold px-2 py-1.5 rounded-lg flex items-center gap-1 active:scale-95 transition-all ${
                      showSimplifyExpenses
                        ? "bg-orange-100 text-orange-600 border border-orange-200"
                        : "bg-indigo-50 text-indigo-600 border border-indigo-50"
                    }`}
                  >
                    <TrendingUp size={12} />{" "}
                    {showSimplifyExpenses ? "Ver Originales" : "Simplificar"}
                  </button>
                )}
                {!isLocked && (
                  <button
                    onClick={() => setShowExpForm(!showExpForm)}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-transform"
                  >
                    <Plus
                      size={16}
                      className={showExpForm ? "rotate-45" : ""}
                    />
                  </button>
                )}
              </div>
            </div>

            {showExpForm && !isLocked && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
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
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
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
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
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
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
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
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">
                    ¿Quiénes comparten este gasto?
                  </label>
                  <div className="flex overflow-x-auto gap-3 pb-2 snap-x -mx-2 px-2 scrollbar-hide">
                    {activePartic.map((p) => {
                      const isSelected = expSharedBy.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            isSelected
                              ? setExpSharedBy(
                                  expSharedBy.filter((id) => id !== p.id)
                                )
                              : setExpSharedBy([...expSharedBy, p.id]);
                          }}
                          className={`snap-center flex flex-col items-center gap-1.5 min-w-[3.5rem] transition-all duration-200 active:scale-95 ${
                            isSelected ? "opacity-100" : "opacity-40 grayscale"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-slate-700 transition-all ${
                              isSelected
                                ? "ring-2 ring-orange-500 ring-offset-2 scale-105"
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

            {expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200 mt-2">
                <span className="text-4xl mb-3">💸</span>
                <p className="text-sm font-semibold">
                  ¡Cuentas al día! Cuando haya un gasto extra compartido,
                  regístralo aquí.
                </p>
              </div>
            ) : showSimplifyExpenses ? (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl">
                  <p className="text-xs text-indigo-700 font-semibold text-center">
                    ✨ <strong>Cruce Matemático:</strong> Se restó lo que te
                    deben con lo que tú debes. Cuentas claras para todos.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {groupedPendingExpenses.length === 0 ? (
                    <p className="text-xs text-center text-slate-400 font-semibold py-2">
                      Todo balanceado. Nadie debe nada extra.
                    </p>
                  ) : (
                    groupedPendingExpenses.map((groupDebt) => (
                      <GroupedDebtCard
                        key={groupDebt.id}
                        debt={groupDebt}
                        onSettle={handleSettleGroupedExpense}
                        isLocked={isLocked}
                      onOpenSettings={setSettingsParticipant}
                      />
                    ))
                  )}
                </div>

                {groupedSettledExpenses.length > 0 && (
                  <div className="pt-2">
                    <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5 border-b border-slate-200 pb-1">
                      Cuentas Saldadas (Historial)
                    </h3>
                    <div className="space-y-2.5">
                      {groupedSettledExpenses.map((settledDebt) => (
                        <SettledGroupedDebtCard
                          key={settledDebt.id}
                          debt={settledDebt}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in duration-300">
                {expenses.map((e) => {
                  const rawShared =
                    e.sharedWith && e.sharedWith.length > 0
                      ? e.sharedWith
                      : (e.sharedBy || []).map((id) => ({
                          id,
                          name: activePartic.find((ap) => ap.id === id)?.name,
                          status: "pending",
                        }));
                  const validSharedWith = rawShared.filter((sw) =>
                    validIds.has(sw.id)
                  );
                  const sharedCount = validSharedWith.length;
                  const splitAmount =
                    sharedCount > 0 ? e.amount / sharedCount : 0;
                  if (sharedCount === 0) return null;

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
                        {!isLocked && (
                          <button
                            onClick={() => removeExpense(e.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors p-1 bg-slate-50 rounded-full"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      <div className="mb-3">
                        <p className="text-[10px] text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border font-medium leading-relaxed">
                          Dividido entre {sharedCount}. Cada uno aporta{" "}
                          <strong className="text-orange-600 font-extrabold">
                            {formatCOP(splitAmount)}
                          </strong>{" "}
                          a <strong>{e.paidBy}</strong>.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {validSharedWith.map((debtor) => {
                          const isPaidByMe = debtor.name === e.paidBy;
                          const isPaid = debtor.status === "paid";
                          return (
                            <button
                              key={debtor.id}
                              onClick={() => {
                                if (!isPaidByMe && !isLocked)
                                  handleToggleExpenseParticipant(
                                    e.id,
                                    debtor.id
                                  );
                              }}
                              disabled={isPaidByMe || isLocked}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-all duration-200 ${
                                isPaidByMe
                                  ? "bg-slate-50 opacity-60"
                                  : isPaid
                                  ? "bg-green-50 border-green-200"
                                  : "bg-white active:scale-95"
                              } ${
                                isLocked && !isPaidByMe
                                  ? "opacity-75 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-slate-700"
                                style={{ background: getAvatarBg(debtor.name) }}
                              >
                                {getInitials(debtor.name)}
                              </div>
                              <span
                                className={`text-xs font-bold truncate ${
                                  isPaid ? "text-green-700" : "text-slate-600"
                                }`}
                              >
                                {debtor.name
                                  ? debtor.name.split(" ")[0]
                                  : "Usuario"}
                              </span>
                              {!isPaidByMe && (
                                <span
                                  className={`text-[10px] ml-1 font-bold ${
                                    isPaid ? "text-green-600" : "text-amber-500"
                                  }`}
                                >
                                  {isPaid ? "✅ Pagado" : "⏳ Pendiente"}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {/* 🧾 DIVISIÓN DE CUENTAS (EVENTOS CORTOS) */}
      {isShortEvent && (
        <div className="px-4 pt-5 space-y-5 animate-in fade-in duration-300">
          <div className="bg-slate-800 rounded-3xl p-6 text-center relative overflow-hidden shadow-lg shadow-slate-900/20">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Utensils size={100} className="text-white" />
            </div>
            <div className="relative z-10">
              <span className="text-3xl mb-3 block">🍽️✨</span>
              <h2 className="text-xl font-black text-white mb-2">
                Cuentas Claras y Transparentes
              </h2>
              <p className="text-slate-300 text-xs mb-1">
                La forma más simple y justa de dividir consumos individuales o
                compartidos entre todos.
              </p>
            </div>
          </div>

          {billItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
              <Receipt size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-bold text-sm mb-1">
                Aún no hay consumos registrados
              </p>
              <p className="text-slate-400 text-xs">
                Agrega los platos o consumos para empezar a dividirlos.
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
                    {!isLocked && (
                      <button
                        onClick={() => removeBillItem(item.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                        title="Eliminar consumo"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <div className="flex overflow-x-auto gap-3 pb-2 snap-x -mx-2 px-2 scrollbar-hide">
                    {activePartic.map((p) => {
                      const isSelected = item.sharedBy?.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={() =>
                            !isLocked &&
                            toggleBillItemParticipant(item.id, p.id)
                          }
                          disabled={isLocked}
                          className={`snap-center flex flex-col items-center gap-1.5 min-w-[3.5rem] transition-all duration-200 ${
                            isSelected ? "opacity-100" : "opacity-40 grayscale"
                          } ${
                            !isLocked ? "active:scale-95" : "cursor-not-allowed"
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

          {!isLocked && (
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
          )}

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
                disabled={isLocked}
                className={`bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg px-2 py-1 outline-none ${
                  isLocked ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <option value={10}>10% (Propina)</option>
                <option value={18}>18% (Propina + Impuesto)</option>
                <option value={0}>0% (Sin extras)</option>
              </select>
            </div>

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

      <div className="px-4 mt-8 space-y-8">
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
              isLocked={isLocked}
                      onOpenSettings={setSettingsParticipant}
            />
            <PaymentLinkCard
              label="Daviplata"
              icon="🔴"
              placeholder="Número de celular"
              color="#EF4444"
              value={paseo.finance?.paymentLinks?.daviplata}
              onChange={(v) => updatePaymentLinks({ daviplata: v })}
              isLocked={isLocked}
                      onOpenSettings={setSettingsParticipant}
            />
            <PaymentLinkCard
              label="Tus llave Bre-B"
              icon="🟡"
              placeholder="CBU o número de cuenta"
              color="#F59E0B"
              value={paseo.finance?.paymentLinks?.breb}
              onChange={(v) => updatePaymentLinks({ breb: v })}
              isLocked={isLocked}
                      onOpenSettings={setSettingsParticipant}
            />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-extrabold text-slate-800">
              Cuentas internas 🤝
            </h2>
            {unsettled.length > 0 && (
              <button
                onClick={() => setShowSimplifyDebts(!showSimplifyDebts)}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 active:scale-95 transition-all ${
                  showSimplifyDebts
                    ? "bg-orange-100 text-orange-600 border border-orange-200"
                    : "bg-indigo-50 text-indigo-600 border border-indigo-50"
                }`}
              >
                <TrendingUp size={12} />
                {showSimplifyDebts ? "Ver Originales" : "Simplificar"}
              </button>
            )}
          </div>

          {!isLocked && (
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
          )}

          {unsettled.length === 0 && settled.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200 mt-2">
              <span className="text-4xl mb-3">🤝</span>
              <p className="text-sm font-semibold">
                Sin deudas personales registradas.
              </p>
            </div>
          ) : showSimplifyDebts ? (
            <div className="space-y-2.5 animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl mb-3">
                <p className="text-xs text-indigo-700 font-semibold text-center">
                  ✨ <strong>Magia activada:</strong> Se cruzaron las deudas
                  personales para menos transferencias.
                </p>
              </div>

              {simplifiedDebts.length === 0 ? (
                <p className="text-xs text-center text-slate-400 font-semibold py-2">
                  Todo está balanceado.
                </p>
              ) : (
                simplifiedDebts.map((d) => (
                  <DebtCard
                    key={d.id}
                    debt={d}
                    isSimplified={true}
                    onSettle={() => {}}
                    onRemove={() => {}}
                    isLocked={isLocked}
                      onOpenSettings={setSettingsParticipant}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="space-y-2.5 animate-in fade-in duration-300">
              {unsettled.map((d) => (
                <DebtCard
                  key={d.id}
                  debt={d}
                  onSettle={toggleDebtSettled}
                  onRemove={removeDebt}
                  isLocked={isLocked}
                      onOpenSettings={setSettingsParticipant}
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
                        isLocked={isLocked}
                      onOpenSettings={setSettingsParticipant}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {settingsParticipant && (
        <ParticipantSettingsModal 
          participant={settingsParticipant} 
          paseo={paseo}
          onClose={() => setSettingsParticipant(null)}
        />
      )}
      <BottomNav />
    </div>
  );
}
