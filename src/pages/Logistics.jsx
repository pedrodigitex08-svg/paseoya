// pages/Logistics.jsx — PANTALLA 4 v8 (Acordeones, Plato Externo Auto-ocultable y Comparativa)
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Car,
  Bus,
  Plus,
  X,
  Trash2,
  ShoppingBasket,
  CheckSquare,
  Square,
  UserPlus,
  Check,
  MapPin,
  Pencil,
  Lock,
  ChevronDown,
} from "lucide-react";
import { usePaseo } from "../store/usePaseoStore";
import BottomNav from "../components/layout/BottomNav";
import Button from "../components/ui/Button";

// ─────────────────────────────────────────────
// DEMO PASEO (testing sin wizard)
// ─────────────────────────────────────────────
const DEMO_PASEO = {
  id: "demo_001",
  slug: "finca-la-esperanza-2026",
  name: "Finca La Esperanza",
  category: "finca",
  emoji: "🌿",
  createdBy: "Carlos",
  estado: "activo",
  tentativeDates: [
    { id: "d1", startDate: "2026-08-22", endDate: "2026-08-24" },
  ],
  participants: [
    {
      id: "host_1",
      name: "Carlos",
      role: "host",
      status: "confirmed",
      hasPaid: true,
      joinedAt: new Date().toISOString(),
    },
  ],
  votes: { dates: {}, places: {} },
  places: [],
  logistics: {
    ingredients: [],
    transport: {
      cars: [],
      bus: {
        enabled: false,
        vendor: "",
        totalCost: 0,
        assignedParticipants: [],
        includeInVaca: false,
      },
    },
    destination: "Melgar, Tolima",
  },
  finance: {
    totalBudget: 2500000,
    contributions: [],
    expenses: [],
    debts: [],
    paymentLinks: { nequi: "", daviplata: "", bancolombia: "" },
  },
  createdAt: new Date().toISOString(),
};

// ─────────────────────────────────────────────
// HELPERS Y CONSTANTES
// ─────────────────────────────────────────────
const formatCOP = (n) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n || 0);

const CAR_COLORS = [
  "#F97316",
  "#0D9488",
  "#8B5CF6",
  "#EC4899",
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
];

const UNITS = [
  "und",
  "kg",
  "Libra",
  "lt",
  "ml",
  "g",
  "bolsa",
  "paq",
  "pkg",
  "doc",
  "botella",
];

const MEAL_CATEGORIES = [
  {
    id: "Desayuno",
    label: "Desayuno",
    emoji: "🍳",
    color: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-50/50",
    border: "border-amber-100",
    text: "text-amber-700",
  },
  {
    id: "Almuerzo",
    label: "Almuerzo",
    emoji: "🍛",
    color: "from-orange-500 to-rose-500",
    bgLight: "bg-orange-50/50",
    border: "border-orange-100",
    text: "text-orange-700",
  },
  {
    id: "Cena",
    label: "Cena",
    emoji: "🌮",
    color: "from-rose-500 to-purple-500",
    bgLight: "bg-rose-50/50",
    border: "border-rose-100",
    text: "text-rose-700",
  },
  {
    id: "Bebidas",
    label: "Bebidas",
    emoji: "🥤",
    color: "from-teal-500 to-emerald-500",
    bgLight: "bg-teal-50/50",
    border: "border-teal-100",
    text: "text-teal-700",
  },
  {
    id: "Snacks",
    label: "Snacks / Otros",
    emoji: "🥨",
    color: "from-indigo-500 to-blue-500",
    bgLight: "bg-indigo-50/50",
    border: "border-indigo-100",
    text: "text-indigo-700",
  },
];

// ─────────────────────────────────────────────
// TOAST COMPONENT
// ─────────────────────────────────────────────
function Toast({ message, visible }) {
  return (
    <div
      className={`fixed top-5 left-4 right-4 z-[99] transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white font-bold text-sm"
        style={{
          background: "linear-gradient(90deg, #059669, #10B981)",
          boxShadow: "0 8px 24px -4px rgba(16,185,129,0.5)",
        }}
      >
        <span className="text-lg">✅</span>
        <span>{message}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CAR CARD
// ─────────────────────────────────────────────
function CarCard({
  car,
  participants,
  onRemove,
  onAssign,
  onUnassign,
  isLocked,
}) {
  const maxPassengers = car.capacity - 1;
  const isFull = car.passengers.length >= maxPassengers;
  const available = participants.filter(
    (p) => p.status !== "cancelled" && !car.passengers.includes(p.id)
  );
  const getParticipant = (id) => participants.find((p) => p.id === id);
  const vehicleEmoji = car.vehicleType === "moto" ? "🏍️" : "🚗";

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden ${
        isLocked ? "border-slate-200 opacity-80" : "border-slate-100"
      }`}
      style={{ boxShadow: "0 2px 12px -2px rgba(15,23,42,0.07)" }}
    >
      <div className="h-1.5" style={{ background: car.color }} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl font-bold"
              style={{ background: car.color }}
            >
              {vehicleEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-extrabold text-slate-800 text-sm">
                  {car.driverName}
                </p>
                <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full uppercase">
                  {car.vehicleType === "moto" ? "Moto" : "Conductor"}
                </span>
                {isFull && (
                  <span className="text-[10px] font-extrabold text-white bg-red-500 px-2 py-0.5 rounded-full animate-pulse">
                    🔴 Lleno
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">
                {car.passengers.length}/{maxPassengers} cupos ocupados
              </p>
            </div>
          </div>
          {!isLocked && (
            <button
              onClick={() => onRemove(car.id)}
              className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
            >
              <Trash2 size={13} className="text-red-400" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-white text-xs font-bold"
            style={{ background: car.color }}
          >
            👑 {car.driverName.split(" ")[0]}
          </div>
          {Array.from({ length: maxPassengers }).map((_, i) => {
            const pid = car.passengers[i];
            const person = pid ? getParticipant(pid) : null;
            return person ? (
              <button
                key={i}
                onClick={() => !isLocked && onUnassign(car.id, pid)}
                disabled={isLocked}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition-colors group ${
                  isLocked
                    ? "bg-slate-100 text-slate-600"
                    : "bg-green-100 text-green-800 hover:bg-red-100 hover:text-red-700"
                }`}
              >
                <span>{person.name.split(" ")[0]}</span>
                {!isLocked && (
                  <X
                    size={10}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                )}
              </button>
            ) : (
              <div
                key={i}
                className="px-2.5 py-1.5 rounded-full bg-slate-100 text-slate-400 text-xs font-semibold border-2 border-dashed border-slate-200"
              >
                🪑 Libre
              </div>
            );
          })}
        </div>

        {!isFull && available.length > 0 && !isLocked && (
          <div className="relative">
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  onAssign(car.id, e.target.value);
                  e.target.value = "";
                }
              }}
              className="w-full appearance-none border-2 border-dashed border-orange-200 rounded-xl px-4 py-2.5 text-sm font-bold text-orange-500 bg-orange-50 outline-none focus:border-orange-400 transition-colors cursor-pointer hover:bg-orange-100"
            >
              <option value="" disabled>
                + Asignar pasajero
              </option>
              {available.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <UserPlus
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ADD VEHICLE FORM
// ─────────────────────────────────────────────
function AddVehicleForm({ onSubmit, onCancel, colorIndex }) {
  const [driverName, setDriver] = useState("");
  const [vehicleType, setType] = useState("carro");
  const [capacity, setCapacity] = useState(4);
  const color = CAR_COLORS[colorIndex % CAR_COLORS.length];
  const capacityOptions = vehicleType === "moto" ? [2] : [2, 3, 4, 5, 6, 7];

  return (
    <div className="bg-white border-2 border-orange-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
          <Car size={14} className="text-orange-500" />
          Agregar vehículo
        </h4>
        <button
          onClick={onCancel}
          className="text-slate-300 hover:text-slate-500"
        >
          <X size={18} />
        </button>
      </div>

      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-2">
          Tipo de vehículo
        </label>
        <div className="flex gap-2">
          {[
            { id: "carro", label: "🚗 Carro", defaultCap: 4 },
            { id: "moto", label: "🏍️ Moto", defaultCap: 2 },
          ].map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => {
                setType(v.id);
                setCapacity(v.defaultCap);
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                vehicleType === v.id
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
          Nombre del conductor <span className="text-orange-500">*</span>
        </label>
        <input
          type="text"
          value={driverName}
          onChange={(e) => setDriver(e.target.value)}
          placeholder="Ej: Carlos"
          maxLength={30}
          className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-orange-400"
        />
      </div>

      {vehicleType === "carro" && (
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-2">
            Capacidad total (incluido conductor)
          </label>
          <div className="flex gap-2">
            {capacityOptions.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCapacity(n)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                  capacity === n
                    ? "text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
                style={capacity === n ? { background: color } : {}}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {vehicleType === "moto" && (
        <p className="text-[11px] text-slate-400 bg-slate-50 rounded-xl px-3 py-2 font-semibold">
          🏍️ La moto tiene capacidad para 2 personas (conductor + 1 pasajero).
        </p>
      )}

      <Button
        variant="primary"
        fullWidth
        disabled={!driverName.trim()}
        icon={Plus}
        onClick={() => {
          if (!driverName.trim()) return;
          onSubmit({
            driverName: driverName.trim(),
            vehicleType,
            capacity,
            color,
          });
        }}
      >
        Agregar vehículo
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────
// PLAYER CARD (For Futbol Alineacion)
// ─────────────────────────────────────────────
function PlayerCard({ item, onRemove, isLocked }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border bg-white border-slate-100 shadow-sm">
      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
        {item.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
        {item.assignedTo && (
          <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">{item.assignedTo}</p>
        )}
      </div>
      {!isLocked && (
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-400 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ADD PLAYER MODAL
// ─────────────────────────────────────────────
function AddPlayerModal({ category, onSubmit, onClose }) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              {category.emoji} Agregar a Alineación
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">
              Equipos y Posiciones
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"
          >
            <X size={16} className="text-slate-600" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
              Nombre del jugador / Ítem <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Pedro, Balón, Petos..."
              maxLength={50}
              className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-400"
              autoFocus
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
              Posición o Nota
            </label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Ej: Arquero, Defensa, Lleva el balón..."
              maxLength={50}
              className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <button
          onClick={() => {
            if (!name.trim()) return;
            onSubmit({
              id: Date.now().toString(),
              name: name.trim(),
              category: category.id,
              plato: "Alineación",
              qty: 1,
              unit: "",
              estimatedCost: 0,
              actualCost: null,
              assignedTo: position.trim() || null,
              bought: false,
            });
          }}
          disabled={!name.trim()}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// INGREDIENT CARD
// ─────────────────────────────────────────────
function IngredientCard({
  item,
  onToggle,
  onRemove,
  onSetActualCost,
  isLocked,
}) {
  const [isEditingCost, setIsEditingCost] = useState(false);
  const [actualInput, setActualInput] = useState(item.actualCost || "");

  const handleSaveActualCost = () => {
    const val = parseInt(actualInput);
    onSetActualCost(item.id, isNaN(val) ? null : val);
    setIsEditingCost(false);
  };

  const hasActualCost =
    item.actualCost !== null && item.actualCost !== undefined;
  const isSavedMoney = hasActualCost && item.actualCost < item.estimatedCost;
  const isOverBudget = hasActualCost && item.actualCost > item.estimatedCost;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
        item.bought
          ? "bg-green-50/80 border-green-200"
          : isLocked
          ? "bg-slate-50 border-slate-200 opacity-80"
          : "bg-white border-slate-100 shadow-sm"
      }`}
    >
      <button
        onClick={() => !isLocked && onToggle(item.id)}
        disabled={isLocked}
        className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
          item.bought
            ? "bg-green-500 text-white"
            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
        } ${isLocked ? "cursor-not-allowed" : ""}`}
      >
        {item.bought ? <CheckSquare size={14} /> : <Square size={14} />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-bold ${
              item.bought ? "text-slate-400 line-through" : "text-slate-800"
            }`}
          >
            {item.name}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
            {item.qty} {item.unit}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {item.assignedTo && (
            <span className="text-[10px] text-slate-500 font-semibold bg-white border border-slate-200 px-1.5 py-0.5 rounded">
              👤 {item.assignedTo}
            </span>
          )}

          {isEditingCost ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={actualInput}
                onChange={(e) => setActualInput(e.target.value)}
                placeholder="Precio Real"
                className="w-20 text-[10px] border border-slate-300 rounded px-1.5 py-0.5 outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveActualCost}
                className="text-green-600 bg-green-100 p-0.5 rounded"
              >
                <Check size={12} />
              </button>
              <button
                onClick={() => setIsEditingCost(false)}
                className="text-slate-400 bg-slate-100 p-0.5 rounded"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              {hasActualCost ? (
                <>
                  <span className="text-[10px] text-slate-400 line-through font-medium">
                    {formatCOP(item.estimatedCost)}
                  </span>
                  <span
                    className={`text-[11px] font-extrabold ${
                      isSavedMoney
                        ? "text-green-600"
                        : isOverBudget
                        ? "text-red-600"
                        : "text-teal-600"
                    }`}
                  >
                    {formatCOP(item.actualCost)}
                  </span>
                </>
              ) : (
                item.estimatedCost > 0 && (
                  <span className="text-[11px] font-bold text-teal-600">
                    {formatCOP(item.estimatedCost)}
                  </span>
                )
              )}

              {!isLocked && (
                <button
                  onClick={() => {
                    setActualInput(item.actualCost || item.estimatedCost || "");
                    setIsEditingCost(true);
                  }}
                  className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400"
                  title="Editar precio real"
                >
                  <Pencil size={10} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {!isLocked && (
        <button
          onClick={() => onRemove(item.id)}
          className="flex-shrink-0 w-7 h-7 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
        >
          <X size={12} className="text-red-400" />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ADD INGREDIENT FORM (Modal Express)
// ─────────────────────────────────────────────
function AddItemModal({
  category,
  currentPlato,
  participants,
  onSubmit,
  onClose,
}) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("1");
  const [unit, setUnit] = useState("und");
  const [cost, setCost] = useState("");
  const [assigned, setAssigned] = useState("");

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              {category.emoji} Agregar a {category.label}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">
              {currentPlato !== "General"
                ? `Plato: ${currentPlato}`
                : "Ítem general"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"
          >
            <X size={16} className="text-slate-600" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
              Nombre del ingrediente / ítem{" "}
              <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Papa criolla, Gaseosa..."
              maxLength={50}
              className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-teal-400"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                Cantidad
              </label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                min="0.1"
                step="0.5"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                Unidad
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-teal-400 bg-white"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                Costo est. $
              </label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                min="0"
                placeholder="0"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                Responsable
              </label>
              <select
                value={assigned}
                onChange={(e) => setAssigned(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-teal-400 bg-white"
              >
                <option value="">Sin asignar</option>
                {participants.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          fullWidth
          disabled={!name.trim()}
          onClick={() => {
            if (!name.trim()) return;
            onSubmit({
              name: name.trim(),
              category: category.id,
              plato: currentPlato,
              qty: parseFloat(qty) || 1,
              unit,
              estimatedCost: parseInt(cost) || 0,
              actualCost: null,
              assignedTo: assigned,
            });
          }}
        >
          Agregar ítem
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DESTINATION INPUT
// ─────────────────────────────────────────────
function DestinationInput({ value, onChange, onSave, isLocked }) {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden ${
        isLocked ? "border-slate-200 opacity-80" : "border-slate-100"
      }`}
      style={{ boxShadow: "0 2px 12px -2px rgba(15,23,42,0.07)" }}
    >
      <div className="p-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #FFF7ED, #FED7AA)" }}
          >
            <MapPin size={16} className="text-orange-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-extrabold text-slate-800">
              Destino del paseo
            </p>
            <p className="text-[10px] text-slate-400">
              Conectado a Google Places
            </p>
          </div>
        </div>
        <div
          className={`flex items-center gap-2.5 border-2 rounded-xl px-3 py-2.5 ${
            focused ? "border-orange-400" : "border-slate-200"
          }`}
        >
          <MapPin size={14} className="text-slate-400" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => !isLocked && setFocused(true)}
            onBlur={() => {
              setFocused(false);
              if (value.trim()) onSave(value.trim());
            }}
            placeholder="Ej: Melgar, Tolima"
            disabled={isLocked}
            className="flex-1 text-sm font-semibold text-slate-800 outline-none bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// BUS CONFIG CARD
// ─────────────────────────────────────────────
function BusConfigCard({ bus, participants, onUpdate, onSave, isLocked }) {
  const [vendor, setVendor] = useState(bus.vendor || "");
  const [cost, setCost] = useState(bus.totalCost || "");

  return (
    <div className="bg-white rounded-2xl border-2 border-teal-200 p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
          <Bus size={18} className="text-teal-600" />
        </div>
        <div>
          <p className="font-extrabold text-slate-800 text-sm">
            Configurar transporte
          </p>
          <p className="text-[10px] text-slate-400">
            El costo se divide entre los asignados
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
          placeholder="Empresa / Conductor"
          disabled={isLocked}
          className="border-2 rounded-xl px-3 py-2 text-sm font-semibold outline-none"
        />
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="Costo total $"
          disabled={isLocked}
          className="border-2 rounded-xl px-3 py-2 text-sm font-semibold outline-none"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {participants.map((p) => {
          const isIn = bus.assignedParticipants.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              disabled={isLocked}
              onClick={() => {
                const next = isIn
                  ? bus.assignedParticipants.filter((x) => x !== p.id)
                  : [...bus.assignedParticipants, p.id];
                onUpdate({ assignedParticipants: next });
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                isIn ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {p.name.split(" ")[0]}
            </button>
          );
        })}
      </div>
      {!isLocked && (
        <Button
          variant="secondary"
          fullWidth
          size="sm"
          onClick={() => {
            onUpdate({ vendor: vendor.trim(), totalCost: parseInt(cost) || 0 });
            onSave();
          }}
        >
          Guardar transporte
        </Button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL (Logistics)
// ─────────────────────────────────────────────
export default function Logistics() {
  const navigate = useNavigate();
  const {
    state,
    setActivePaseo,
    addCar,
    removeCar,
    assignPassengerToCar,
    removePassengerFromCar,
    updateBus,
    updateDestination,
    addIngredient,
    removeIngredient,
    toggleIngredientBought,
  } = usePaseo();

  const [activeTab, setActiveTab] = useState("menu");
  const [showCarForm, setShowCarForm] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [localDest, setLocalDest] = useState("");
  const toastTimer = useRef(null);

  const [expandedCategory, setExpandedCategory] = useState(null);
  const [platoInputs, setPlatoInputs] = useState({});
  const [platoLocked, setPlatoLocked] = useState({});
  const [activeCategoryForModal, setActiveCategoryForModal] = useState(null);

  useEffect(() => {
    if (!state.activePaseo) setActivePaseo(DEMO_PASEO);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (state.activePaseo?.logistics?.destination !== undefined) {
      setLocalDest(state.activePaseo.logistics.destination);
    }
  }, [state.activePaseo?.id]); // eslint-disable-line

  // 🔄 Adjusts active tab when category loads (futbol gets "alineacion")
  useEffect(() => {
    if (state.activePaseo?.category === "futbol") {
      setActiveTab("alineacion");
    } else {
      setActiveTab("menu");
    }
  }, [state.activePaseo?.category]);

  const showToast = () => {
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
  };

  const setActualCost = (id, actualCost) => {
    const updatedPaseo = { ...state.activePaseo };
    const idx = updatedPaseo.logistics.ingredients.findIndex(
      (i) => i.id === id
    );
    if (idx !== -1) {
      updatedPaseo.logistics.ingredients[idx].actualCost = actualCost;
      setActivePaseo(updatedPaseo);
      showToast();
    }
  };

  const toggleCategory = (catId) => {
    setExpandedCategory(expandedCategory === catId ? null : catId);
  };

  const handlePlatoChange = (catId, value) => {
    setPlatoInputs((prev) => ({ ...prev, [catId]: value }));
  };

  const lockPlato = (catId) => {
    if (platoInputs[catId]?.trim()) {
      setPlatoLocked((prev) => ({ ...prev, [catId]: true }));
    }
  };

  const unlockPlato = (catId) => {
    setPlatoLocked((prev) => ({ ...prev, [catId]: false }));
  };

  const paseo = state.activePaseo;
  if (!paseo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8">
          <span className="text-5xl">🎒</span>
          <p className="text-slate-400 mt-4">Cargando...</p>
        </div>
      </div>
    );
  }

  const isLocked = paseo?.estado === "finalizado";
  const isFutbol = paseo?.category === "futbol";
  const isAsado = paseo?.category === "asado";
  const { cars, bus } = paseo.logistics.transport;
  const ingredients = paseo.logistics.ingredients || [];

  const totalIngCost = ingredients.reduce((s, i) => {
    const cost =
      i.bought && i.actualCost !== null ? i.actualCost : i.estimatedCost || 0;
    return s + cost;
  }, 0);

  const boughtCost = ingredients
    .filter((i) => i.bought)
    .reduce(
      (s, i) =>
        s + (i.actualCost !== null ? i.actualCost : i.estimatedCost || 0),
      0
    );

  const totalSeats = cars.reduce((s, c) => s + (c.capacity - 1), 0);
  const totalPartic = paseo.participants.filter(
    (p) => p.status !== "cancelled"
  ).length;
  const assignedAcrossAll = cars.flatMap((c) => c.passengers);
  const unassigned = paseo.participants.filter(
    (p) => p.status !== "cancelled" && !assignedAcrossAll.includes(p.id)
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-24 relative">
      <Toast message="✅ Guardado correctamente" visible={toastVisible} />

      {activeCategoryForModal && !isLocked && (
        isFutbol && activeTab === "alineacion" ? (
          <AddPlayerModal
            category={activeCategoryForModal}
            onSubmit={(d) => {
              addIngredient(d);
              setActiveCategoryForModal(null);
              showToast();
            }}
            onClose={() => setActiveCategoryForModal(null)}
          />
        ) : (
          <AddItemModal
            category={activeCategoryForModal}
            currentPlato={
              platoInputs[activeCategoryForModal.id]?.trim() || "Para compartir"
            }
            participants={paseo.participants.filter(
              (p) => p.status !== "cancelled"
            )}
            onSubmit={(d) => {
              addIngredient(d);
              setActiveCategoryForModal(null);
              showToast();
            }}
            onClose={() => setActiveCategoryForModal(null)}
          />
        )
      )}

      {/* TOP BAR */}
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
              {isFutbol ? "Cancha y Alineación ⚽" : isAsado ? "Mercado del Asado 🔥" : paseo?.category === "regalo" ? "Coordinar Regalo 🎁" : "Logística 🎒"}
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
            isFutbol 
              ? { id: "alineacion", label: "⚽ Alineación" } 
              : { id: "menu", label: "🥘 " + (isAsado ? "Carnes y Bebidas" : "Menú y Bebidas") },
            (!isFutbol) && { id: "transporte", label: "🚗 Transporte" },
          ].filter(Boolean).map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
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

      <div className="px-4 pt-4 space-y-4">
        {activeTab === "alineacion" && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-4 mb-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">👕</span>
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-emerald-800">
                    Alineación y Posiciones
                  </h2>
                  <p className="text-xs text-emerald-600/80 leading-relaxed">
                    Anota aquí los equipos, quién tapa, o usa esta lista para el alquiler de la cancha.
                  </p>
                </div>
              </div>
            </div>
            
            
            <div className="space-y-2 mt-4">
              {paseo.logistics?.ingredients?.filter(i => i.category === "Snacks").map(item => (
                <PlayerCard
                  key={item.id}
                  item={item}
                  onRemove={() => removeIngredient(item.id)}
                  isLocked={isLocked}
                />
              ))}
              {!isLocked && (
                <button
                  onClick={() => setActiveCategoryForModal({ id: "Snacks", label: "Equipos y Posiciones", emoji: "👕", color: "from-emerald-500 to-green-500" })}
                  className="w-full flex items-center justify-center gap-1.5 py-3 mt-4 rounded-xl text-white font-bold text-xs transition-all active:scale-[0.98] shadow-sm bg-gradient-to-r from-emerald-500 to-green-500"
                >
                  <Plus size={16} />
                  Agregar Jugador / Ítem
                </button>
              )}
            </div>

          </div>
        )}

        {activeTab === "menu" && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-gradient-to-r from-orange-50 to-rose-50 border border-orange-100 rounded-2xl p-4 mb-5 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🛒</span>
                <div>
                  <strong className="text-slate-800 block mb-0.5 text-sm">
                    ¡El menú del viaje no se arma solo! 🤤
                  </strong>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isAsado ? "Anota las carnes, picadas, y quién lleva el carbón." : "Añade los ingredientes, bebidas o antojos en su respectiva"}
                    categoría.{" "}
                    <span className="text-orange-600 font-bold">
                      ¡Si no anotas tu favorito, te quedas sin él!
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {ingredients.length > 0 && (
              <div
                className="p-4 rounded-2xl text-white mb-5"
                style={{
                  background:
                    "linear-gradient(135deg, #0D9488 0%, #059669 100%)",
                  boxShadow: "0 4px 20px -4px rgba(13,148,136,0.3)",
                }}
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">
                    Costo Total del Mercado
                  </p>
                  <p className="text-white/80 text-[10px] font-bold uppercase">
                    {ingredients.filter((i) => i.bought).length}/
                    {ingredients.length} Ítems
                  </p>
                </div>
                <p className="text-3xl font-black leading-none mb-3">
                  {formatCOP(totalIngCost)}
                </p>
                <div className="bg-black/10 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-[10px] font-bold">
                      Comprado
                    </p>
                    <p className="text-white font-extrabold text-sm">
                      {formatCOP(boughtCost)}
                    </p>
                  </div>
                  <div className="w-px h-6 bg-white/20" />
                  <div className="text-right">
                    <p className="text-white/70 text-[10px] font-bold">
                      Pendiente
                    </p>
                    <p className="text-white font-extrabold text-sm">
                      {formatCOP(Math.max(0, totalIngCost - boughtCost))}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {MEAL_CATEGORIES.map((cat) => {
                const isExpanded = expandedCategory === cat.id;
                const itemsInCat = ingredients.filter(
                  (i) => i.category === cat.id
                );

                const byPlato = itemsInCat.reduce((acc, item) => {
                  const p =
                    item.plato && item.plato.trim() !== ""
                      ? item.plato
                      : "Para compartir";
                  if (!acc[p]) acc[p] = [];
                  acc[p].push(item);
                  return acc;
                }, {});

                return (
                  <div
                    key={cat.id}
                    className={`rounded-2xl border transition-all duration-300 ${
                      isExpanded
                        ? `${cat.border} shadow-md bg-white`
                        : "border-slate-200 bg-white shadow-sm"
                    }`}
                  >
                    <button
                      onClick={() => toggleCategory(cat.id)}
                      className={`w-full px-4 py-3.5 flex justify-between items-center rounded-2xl transition-colors ${
                        isExpanded ? cat.bgLight : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl drop-shadow-sm">
                          {cat.emoji}
                        </span>
                        <h3
                          className={`font-black uppercase tracking-wide text-sm ${
                            isExpanded ? cat.text : "text-slate-700"
                          }`}
                        >
                          {cat.label}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        {itemsInCat.length > 0 && (
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              isExpanded
                                ? "bg-white text-slate-600 shadow-sm"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {itemsInCat.length} ítems
                          </span>
                        )}
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-300 ${
                            isExpanded
                              ? "rotate-180 " + cat.text
                              : "text-slate-400"
                          }`}
                        />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                        {itemsInCat.length > 0 && (
                          <div className="space-y-5 mb-5">
                            {Object.entries(byPlato).map(
                              ([platoName, platoItems]) => (
                                <div key={platoName} className="space-y-2.5">
                                  <div className="flex items-center gap-2">
                                    <div className="h-px bg-slate-100 flex-1" />
                                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                      🍽️ {platoName}
                                    </span>
                                    <div className="h-px bg-slate-100 flex-1" />
                                  </div>
                                  <div className="space-y-2">
                                    {platoItems.map((item) => (
                                      <IngredientCard
                                        key={item.id}
                                        item={item}
                                        isLocked={isLocked}
                                        onToggle={(id) => {
                                          toggleIngredientBought(id);
                                          showToast();
                                        }}
                                        onRemove={(id) => {
                                          removeIngredient(id);
                                          showToast();
                                        }}
                                        onSetActualCost={setActualCost}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}

                        {itemsInCat.length === 0 && !isLocked && (
                          <div className="text-center py-4 px-2 mb-2">
                            <p className="text-xs text-slate-400 font-medium">
                              Aún no hay nada en {cat.label}. ¡Agrega lo que
                              falte!
                            </p>
                          </div>
                        )}

                        {!isLocked && (
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-3">
                            {platoLocked[cat.id] &&
                            platoInputs[cat.id]?.trim() ? (
                              <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                                <div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    Plato a preparar:
                                  </p>
                                  <p
                                    className={`text-sm font-extrabold ${cat.text}`}
                                  >
                                    🍽️ {platoInputs[cat.id]}
                                  </p>
                                </div>
                                <button
                                  onClick={() => unlockPlato(cat.id)}
                                  className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                                  title="Editar nombre del plato"
                                >
                                  <Pencil size={12} />
                                </button>
                              </div>
                            ) : (
                              <div className="animate-in fade-in duration-200">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5 ml-1">
                                  Nombre del plato que van a preparar?{" "}
                                  <span className="font-normal lowercase text-slate-400">
                                    (opcional)
                                  </span>
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={platoInputs[cat.id] || ""}
                                    onChange={(e) =>
                                      handlePlatoChange(cat.id, e.target.value)
                                    }
                                    placeholder="Ej: Asado, Sancocho, Rumba..."
                                    maxLength={40}
                                    className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-teal-400 transition-colors bg-white shadow-sm"
                                  />
                                  {platoInputs[cat.id]?.trim() && (
                                    <button
                                      onClick={() => lockPlato(cat.id)}
                                      className="w-11 flex-shrink-0 bg-teal-500 text-white rounded-xl flex items-center justify-center shadow-sm hover:bg-teal-600 transition-all active:scale-95"
                                      title="Confirmar plato"
                                    >
                                      <Check size={16} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}

                            <button
                              onClick={() => {
                                if (platoInputs[cat.id]?.trim())
                                  lockPlato(cat.id);
                                setActiveCategoryForModal(cat);
                              }}
                              className={`w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-white font-bold text-xs transition-all active:scale-[0.98] shadow-sm bg-gradient-to-r ${cat.color}`}
                            >
                              <Plus size={16} />
                              Agregar Ingrediente / Ítem
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "transporte" && (
          <div className="animate-in fade-in duration-300">
            <DestinationInput
              value={localDest}
              onChange={setLocalDest}
              isLocked={isLocked}
              onSave={(v) => {
                updateDestination(v);
                showToast();
              }}
            />

            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                {
                  label: "Vehículos",
                  value: cars.length,
                  color: "text-slate-800",
                },
                {
                  label: "Cupos",
                  value: `${assignedAcrossAll.length}/${totalSeats}`,
                  color:
                    assignedAcrossAll.length >= totalPartic
                      ? "text-green-500"
                      : "text-orange-500",
                },
                {
                  label: "Sin asignar",
                  value: unassigned.length,
                  color:
                    unassigned.length > 0 ? "text-amber-500" : "text-green-500",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white rounded-2xl p-3 border border-slate-100 text-center"
                  style={{ boxShadow: "0 2px 8px -2px rgba(15,23,42,0.07)" }}
                >
                  <p className={`text-xl font-extrabold ${s.color}`}>
                    {s.value}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {unassigned.length > 0 && cars.length > 0 && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200 mt-4">
                <span className="text-lg">⚠️</span>
                <div>
                  <p className="text-xs font-bold text-amber-700">
                    Sin vehículo asignado:
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    {unassigned.map((p) => p.name.split(" ")[0]).join(", ")}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              {cars.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200 mb-4">
                  <span className="text-4xl mb-3">🚗</span>
                  <p className="text-sm font-semibold">
                    ¡Nadie quiere ir a pie! Registra tu vehículo para ofrecer
                    cupos o arma la ruta del bus.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 mb-4">
                  {cars.map((car) => (
                    <CarCard
                      key={car.id}
                      car={car}
                      isLocked={isLocked}
                      participants={paseo.participants.filter(
                        (p) => p.status !== "cancelled"
                      )}
                      onRemove={(id) => {
                        removeCar(id);
                        showToast();
                      }}
                      onAssign={(carId, pid) => {
                        assignPassengerToCar(carId, pid);
                        showToast();
                      }}
                      onUnassign={(carId, pid) => {
                        removePassengerFromCar(carId, pid);
                        showToast();
                      }}
                    />
                  ))}
                </div>
              )}

              {!isLocked &&
                (showCarForm ? (
                  <AddVehicleForm
                    colorIndex={cars.length}
                    onSubmit={(d) => {
                      addCar(d);
                      setShowCarForm(false);
                      showToast();
                    }}
                    onCancel={() => setShowCarForm(false)}
                  />
                ) : (
                  <button
                    onClick={() => setShowCarForm(true)}
                    className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-dashed border-orange-300 rounded-2xl text-sm font-bold text-orange-500 hover:bg-orange-50 transition-colors active:scale-95"
                  >
                    <Plus size={16} /> Agregar Carro / Motocicleta
                  </button>
                ))}
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">
                    ¿Van en transporte con costo?
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Buseta, taxi, Uber grupal… divide el gasto
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!isLocked) {
                      updateBus({ enabled: !bus.enabled });
                      showToast();
                    }
                  }}
                  disabled={isLocked}
                  className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-all duration-300 ${
                    bus.enabled
                      ? isLocked
                        ? "bg-teal-600 opacity-60"
                        : "bg-teal-500"
                      : "bg-slate-200"
                  } ${isLocked ? "cursor-not-allowed" : ""}`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${
                      bus.enabled ? "left-6" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
              {bus.enabled && (
                <BusConfigCard
                  bus={bus}
                  isLocked={isLocked}
                  participants={paseo.participants.filter(
                    (p) => p.status !== "cancelled"
                  )}
                  onUpdate={updateBus}
                  onSave={showToast}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
