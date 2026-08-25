import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Palmtree,
  Home,
  Mountain,
  Building2,
  GlassWater,
  Utensils,
  MapPin,
  Link2,
  DollarSign,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  User,
  Flame,
  Gift,
  Trophy,
} from "lucide-react";
import { usePaseo, createPaseoTemplate } from "../store/usePaseoStore";

// ─────────────────────────────────────────────
// CONFIGURACIÓN DE CATEGORÍAS
// ─────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "playa",
    label: "Playa",
    emoji: "🌊",
    icon: Palmtree,
    grad: "from-cyan-400 to-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    id: "finca",
    label: "Finca",
    emoji: "🏡",
    icon: Home,
    grad: "from-green-400 to-emerald-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    id: "montana",
    label: "Montaña",
    emoji: "⛰️",
    icon: Mountain,
    grad: "from-slate-400 to-stone-600",
    bg: "bg-stone-50",
    text: "text-stone-600",
  },
  {
    id: "ciudad",
    label: "Otra Ciudad",
    emoji: "🏙️",
    icon: Building2,
    grad: "from-violet-400 to-purple-600",
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
  {
    id: "rumba",
    label: "Rumba / Bar",
    emoji: "🍸",
    icon: GlassWater,
    grad: "from-pink-400 to-rose-600",
    bg: "bg-rose-50",
    text: "text-rose-600",
  },
  {
    id: "restaurante",
    label: "Restaurante",
    emoji: "🥩",
    icon: Utensils,
    grad: "from-orange-400 to-red-500",
    bg: "bg-orange-50",
    text: "text-orange-600",
  },
  {
    id: "asado",
    label: "Asado",
    emoji: "🔥",
    icon: Flame,
    grad: "from-red-400 to-red-600",
    bg: "bg-red-50",
    text: "text-red-600",
  },
  {
    id: "regalo",
    label: "Regalo",
    emoji: "🎁",
    icon: Gift,
    grad: "from-purple-400 to-purple-600",
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
  {
    id: "futbol",
    label: "Fútbol 5",
    emoji: "⚽",
    icon: Trophy,
    grad: "from-emerald-400 to-green-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
];

export default function CreatePaseo() {
  const navigate = useNavigate();

  // 🛠️ Extracción segura de la función desde Zustand
  const savePaseoToCloud = usePaseo((state) => state.savePaseoToCloud);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── ESTADO DEL FORMULARIO ──
  const [formData, setFormData] = useState({
    categoria: null,
    nombrePaseo: "",
    anfitrion: "",
    ubicacion: "",
    linkLugar: "",
    costoBase: "",
    esPasadia: false,
    fechaUnica: "",
    fechaIda: "",
    fechaRegreso: "",
  });

  const updateForm = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // ── HANDLERS ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const rawData = {
      // Datos originales en Español
      categoria: formData.categoria.id,
      emoji: formData.categoria.emoji,
      nombrePaseo: formData.nombrePaseo,
      anfitrion: formData.anfitrion,
      ubicacion: formData.ubicacion,
      linkLugar: formData.linkLugar,
      costoBase: formData.costoBase,
      esPasadia: formData.esPasadia,
      fechaUnica: formData.fechaUnica,
      fechaIda: formData.fechaIda,
      fechaRegreso: formData.fechaRegreso,

      // Datos estandarizados (Inglés) para Dashboard
      name: formData.nombrePaseo,
      createdBy: formData.anfitrion,
      location: formData.ubicacion,
      isSameDay: formData.esPasadia,
    };

    // Generamos el objeto completo del paseo, que incluye id y slug únicos
    const nuevoPaseo = createPaseoTemplate(rawData);

    try {
      // 🛡️ Validación por si Antigravity omitió la función en el Store
      if (typeof savePaseoToCloud !== "function") {
        alert(
          "¡Alerta de Arquitecto! 🛑 La función savePaseoToCloud no está definida en tu usePaseoStore.jsx. Por favor, verifica ese archivo."
        );
        setIsSubmitting(false);
        return;
      }

      // 1. Guardamos en la nube ANTES de redirigir
      await savePaseoToCloud(nuevoPaseo);

      // 2. Guardamos en el estado local de Zustand manualmente
      usePaseo.setState((store) => ({
        state: {
          ...store.state,
          activePaseo: nuevoPaseo,
          paseos: [nuevoPaseo, ...(store.state?.paseos || [])],
          currentUser: {
            id: "host_1",
            name: nuevoPaseo.createdBy,
            role: "host",
          },
        },
      }));

      // Opcional: Copiar al portapapeles el enlace de invitación generado con el slug
      const inviteLink = `${window.location.origin}/paseo/${nuevoPaseo.slug}/invite`;
      try {
        await navigator.clipboard.writeText(inviteLink);
      } catch (err) {
        console.warn("No se pudo copiar el enlace al portapapeles:", err);
      }

      // 3. Redirigimos SIEMPRE al Dashboard principal (con el slug correcto)
      navigate(`/paseo/${nuevoPaseo.slug}`);
    } catch (error) {
      console.error("Error al guardar el paseo:", error);
      alert(
        "Hubo un error al conectar con el servidor de Supabase. Inténtalo de nuevo."
      );
      setIsSubmitting(false);
    }
  };

  // 🦎 Lógica de Formulario Camaleón
  const isShortEvent =
    formData.categoria?.id === "rumba" ||
    formData.categoria?.id === "restaurante" ||
    formData.categoria?.id === "asado" ||
    formData.categoria?.id === "regalo" ||
    formData.categoria?.id === "futbol";

  let labelName = "Nombre del Plan";
  let placeholderName = "Ej: Paseo a Melgar";
  if (formData.categoria?.id === "futbol") {
    labelName = "Nombre del Partido";
    placeholderName = "Ej: Los Malos vs Los Peores";
  } else if (formData.categoria?.id === "futbol") {
    labelLocation = "Cancha / Sede";
    placeholderLocation = "Ej: Canchas Campín 5";
  } else if (formData.categoria?.id === "futbol") {
    labelBudget = "Costo Cancha + Árbitro";
  } else if (formData.categoria?.id === "regalo") {
    labelName = "Para quién es el regalo";
    placeholderName = "Ej: Cumpleaños de Valentina";
  } else if (formData.categoria?.id === "asado") {
    labelName = "Motivo del Asado";
    placeholderName = "Ej: Domingo familiar";
  } else if (isShortEvent) {
    labelName = "Motivo de la salida";
    placeholderName = "Ej: Cumpleaños de Carlos";
  }

  let labelLocation = "Destino / Lugar";
  let placeholderLocation = "Ej: Melgar, Airbnb Casa Blanca";
  if (formData.categoria?.id === "futbol") {
    labelName = "Nombre del Partido";
    placeholderName = "Ej: Los Malos vs Los Peores";
  } else if (formData.categoria?.id === "futbol") {
    labelLocation = "Cancha / Sede";
    placeholderLocation = "Ej: Canchas Campín 5";
  } else if (formData.categoria?.id === "futbol") {
    labelBudget = "Costo Cancha + Árbitro";
  } else if (formData.categoria?.id === "regalo") {
    labelLocation = "Lugar de entrega";
    placeholderLocation = "Ej: Oficina 302";
  } else if (isShortEvent) {
    labelLocation = "Lugar o ubicación";
    placeholderLocation = "Ej: Andrés Carne de Res";
  }

  let labelBudget = "Presupuesto / Cuota Base";
  if (formData.categoria?.id === "futbol") {
    labelName = "Nombre del Partido";
    placeholderName = "Ej: Los Malos vs Los Peores";
  } else if (formData.categoria?.id === "futbol") {
    labelLocation = "Cancha / Sede";
    placeholderLocation = "Ej: Canchas Campín 5";
  } else if (formData.categoria?.id === "futbol") {
    labelBudget = "Costo Cancha + Árbitro";
  } else if (formData.categoria?.id === "regalo") {
    labelBudget = "Meta del Regalo (Total)";
  } else if (formData.categoria?.id === "asado") {
    labelBudget = "Presupuesto de Carnes y Bebidas";
  } else if (isShortEvent) {
    labelBudget = "Cover o Consumo estimado";
  }

  const labelDate = isShortEvent ? "Fecha del evento" : "Día del parche";

  const isStep2Valid =
    formData.nombrePaseo.length >= 3 &&
    formData.anfitrion.length >= 2 &&
    (formData.esPasadia
      ? formData.fechaUnica
      : formData.fechaIda && formData.fechaRegreso);

  return (
    <div className="min-h-dvh bg-slate-50 pb-24">
      {/* ── HEADER ── */}
      <div className="bg-white px-6 pt-10 pb-4 rounded-b-[2.5rem] shadow-sm mb-6 sticky top-0 z-50">
        <div className="text-center mb-1">
          <span className="text-orange-500/90 text-xl font-black tracking-wide drop-shadow-md">
            PaseoYa
          </span>
        </div>
        <div className="flex items-center justify-between mb-4">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 active:scale-95 transition-transform"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="w-10 h-10" />
          )}
          <div className="flex gap-1.5">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                step >= 1 ? "w-8 bg-orange-500" : "w-2 bg-slate-200"
              }`}
            />
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                step >= 2 ? "w-8 bg-orange-500" : "w-2 bg-slate-200"
              }`}
            />
          </div>
          <div className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800 text-center">
          {step === 1 ? "¿Qué plan armamos?" : "Detalles del plan"}
        </h1>
        <p className="text-slate-500 text-sm text-center font-medium mt-1">
          {step === 1
            ? "Elige la vibra de tu próximo parche"
            : "Configura la logística en segundos"}
        </p>
      </div>

      {/* ── PASO 1: CATEGORÍAS ── */}
      {step === 1 && (
        <div className="px-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => {
              const isSelected = formData.categoria?.id === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    const isShort =
                      cat.id === "rumba" ||
                      cat.id === "restaurante" ||
                      cat.id === "asado" ||
                      cat.id === "regalo" ||
                      cat.id === "futbol";
                    setFormData((prev) => ({
                      ...prev,
                      categoria: cat,
                      // Si es bar o restaurante, forzamos pasadía a true automáticamente
                      esPasadia: isShort ? true : prev.esPasadia,
                    }));
                    setTimeout(() => setStep(2), 300);
                  }}
                  className={`relative flex flex-col items-center justify-center p-5 rounded-3xl border-2 transition-all duration-300 active:scale-95 ${
                    isSelected
                      ? "border-orange-500 bg-orange-50 shadow-lg shadow-orange-500/20"
                      : "border-slate-100 bg-white hover:border-orange-200 shadow-sm"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`w-14 h-14 rounded-2xl mb-3 flex items-center justify-center bg-gradient-to-br ${cat.grad} shadow-inner`}
                  >
                    <Icon size={28} className="text-white" />
                  </div>
                  <span className="text-2xl mb-1">{cat.emoji}</span>
                  <span
                    className={`text-sm font-extrabold ${
                      isSelected ? "text-orange-600" : "text-slate-700"
                    }`}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PASO 2: SÚPER FORMULARIO ── */}
      {step === 2 && (
        <form
          onSubmit={handleSubmit}
          className="px-5 space-y-5 animate-in fade-in slide-in-from-right-8 duration-500"
        >
          {/* Info básica */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4 relative overflow-hidden">
            <div
              className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 pointer-events-none bg-gradient-to-br ${formData.categoria?.grad}`}
            />

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5 block">
                {labelName}
              </label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200 transition-all">
                <Sparkles size={18} className="text-orange-400" />
                <input
                  type="text"
                  value={formData.nombrePaseo}
                  onChange={(e) => updateForm("nombrePaseo", e.target.value)}
                  placeholder={placeholderName}
                  className="flex-1 bg-transparent border-none outline-none text-slate-800 font-bold placeholder:text-slate-400 placeholder:font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5 block">
                ¿Quién organiza?
              </label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200 transition-all">
                <User size={18} className="text-slate-400" />
                <input
                  type="text"
                  value={formData.anfitrion}
                  onChange={(e) => updateForm("anfitrion", e.target.value)}
                  placeholder="Tu nombre"
                  className="flex-1 bg-transparent border-none outline-none text-slate-800 font-bold placeholder:text-slate-400 placeholder:font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
                  <Calendar size={18} className="text-indigo-500" /> Fechas
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {isShortEvent
                    ? "¿Para cuándo es la salida?"
                    : "¿Cuándo nos vamos?"}
                </p>
              </div>

              {/* Solo mostramos el switch de pasadía si NO es un evento corto de Rumba/Restaurante */}
              {!isShortEvent && (
                <label className="flex items-center gap-3 cursor-pointer bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shrink-0">
                  <span className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">
                    ¿Pasadía?
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.esPasadia}
                    onChange={(e) => updateForm("esPasadia", e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${
                      formData.esPasadia ? "bg-orange-500" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                        formData.esPasadia ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                </label>
              )}
            </div>

            {formData.esPasadia ? (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5 block">
                  {labelDate}
                </label>
                <input
                  type="date"
                  value={formData.fechaUnica}
                  onChange={(e) => updateForm("fechaUnica", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 font-bold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  required={formData.esPasadia}
                />
              </div>
            ) : (
              <div className="flex gap-3 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5 block">
                    Ida
                  </label>
                  <input
                    type="date"
                    value={formData.fechaIda}
                    onChange={(e) => updateForm("fechaIda", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 text-slate-800 font-bold text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                    required={!formData.esPasadia}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5 block">
                    Regreso
                  </label>
                  <input
                    type="date"
                    value={formData.fechaRegreso}
                    onChange={(e) => updateForm("fechaRegreso", e.target.value)}
                    min={formData.fechaIda}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 text-slate-800 font-bold text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                    required={!formData.esPasadia}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Logística y Costos */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5 block">
                {labelLocation}
              </label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-emerald-500 transition-all">
                <MapPin size={18} className="text-emerald-500" />
                <input
                  type="text"
                  value={formData.ubicacion}
                  onChange={(e) => updateForm("ubicacion", e.target.value)}
                  placeholder={placeholderLocation}
                  className="flex-1 bg-transparent border-none outline-none text-slate-800 font-bold placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5 block">
                Link del Lugar (Opcional)
              </label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-emerald-500 transition-all">
                <Link2 size={18} className="text-slate-400" />
                <input
                  type="url"
                  value={formData.linkLugar}
                  onChange={(e) => updateForm("linkLugar", e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-transparent border-none outline-none text-slate-800 font-bold placeholder:text-slate-400 placeholder:font-medium text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5 block">
                {labelBudget}
              </label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign size={16} className="text-green-600" />
                </div>
                <input
                  type="number"
                  value={formData.costoBase}
                  onChange={(e) => updateForm("costoBase", e.target.value)}
                  placeholder="0"
                  min="0"
                  className="flex-1 bg-transparent border-none outline-none text-slate-800 font-extrabold text-lg placeholder:text-slate-300"
                />
                <span className="text-xs font-bold text-slate-400">COP</span>
              </div>
            </div>
          </div>

          {/* Floating Submit Button */}
          <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-50">
            <button
              type="submit"
              disabled={!isStep2Valid || isSubmitting}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-extrabold text-lg transition-all duration-300 shadow-xl
                ${
                  isStep2Valid && !isSubmitting
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 shadow-orange-500/30 active:scale-95"
                    : "bg-slate-300 text-slate-400 shadow-none cursor-not-allowed"
                }`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creando plan...</span>
                </div>
              ) : (
                <>
                  <span>Crear Plan</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
          <div className="h-10" />
        </form>
      )}
    </div>
  );
}
