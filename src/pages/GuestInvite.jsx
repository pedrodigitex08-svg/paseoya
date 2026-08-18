// pages/GuestInvite.jsx - FASE 4: Experiencia del Invitado
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePaseo } from "../store/usePaseoStore";

const CAT_STYLE = {
  beach: { from: "#38BDF8", to: "#2563EB", label: "Playa" },
  finca: { from: "#4ADE80", to: "#059669", label: "Finca" },
  campo: { from: "#FACC15", to: "#EA580C", label: "Dia de campo" },
  montana: { from: "#94A3B8", to: "#44403C", label: "Montana" },
  rio: { from: "#22D3EE", to: "#0D9488", label: "Rio / Lago" },
  ciudad: { from: "#A78BFA", to: "#7C3AED", label: "City tour" },
};

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
function formatDateLabel(paseo) {
  const dates = (paseo?.tentativeDates || []).filter((d) => d.startDate);
  if (dates.length === 0) return "Fecha por confirmar";
  const d = dates[0];
  const [sy, sm, sd] = d.startDate.split("-");
  const start = parseInt(sd) + " " + MONTHS[parseInt(sm) - 1] + " " + sy;
  if (paseo.isSameDay || !d.endDate || d.endDate === d.startDate)
    return "Pasadia - " + start;
  const [, em, ed] = d.endDate.split("-");
  return start + " - " + parseInt(ed) + " " + MONTHS[parseInt(em) - 1];
}

const AVATAR_BG = [
  "#FED7AA",
  "#BBF7D0",
  "#BAE6FD",
  "#DDD6FE",
  "#FBCFE8",
  "#FEF08A",
  "#CCFBF1",
];
const getAvatarBg = (name) =>
  AVATAR_BG[(name || "").charCodeAt(0) % AVATAR_BG.length];
const getInitials = (name) =>
  (name || "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function SuccessToast({ name, visible }) {
  return (
    <div
      className="fixed top-6 left-1/2 z-[100] transition-all duration-500"
      style={{
        transform: visible
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(-120%)",
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white font-bold text-sm shadow-2xl"
        style={{
          background: "linear-gradient(135deg,#10B981,#059669)",
          boxShadow: "0 8px 32px -4px rgba(16,185,129,0.5)",
        }}
      >
        <span className="text-xl">🎒</span>
        <div>
          <p className="font-extrabold">Listo, {name.split(" ")[0]}!</p>
          <p className="text-green-100 text-xs font-normal">
            Ya estas en el paseo 🎉
          </p>
        </div>
        <span className="text-2xl">✅</span>
      </div>
    </div>
  );
}

export default function GuestInvite() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { state, loadPaseoFromCloud, savePaseoToCloud, addParticipant } =
    usePaseo();

  console.log("DEBUG: Slug recibido:", slug);

  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [guestName, setGuestName] = useState("");
  const [nameError, setNameError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const inputRef = useRef(null);

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

        const fetchedPaseo = await loadPaseoFromCloud(slug);

        // Verificamos tanto la respuesta como el estado actual para máxima seguridad
        const finalPaseo =
          fetchedPaseo || usePaseo.getState().state.activePaseo;

        if (finalPaseo) {
          setIsLoading(false);
          setTimeout(() => inputRef.current?.focus(), 400);
        } else {
          console.error(
            `[CRÍTICO] No se encontró el paseo con slug '${slug}' en Supabase, o el state.activePaseo quedó vacío.`
          );
          setNotFound(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("[CRÍTICO] Falló loadPaseoFromCloud:", error);
        setNotFound(true);
        setIsLoading(false);
      }
    };

    fetchPaseo();
  }, [slug, loadPaseoFromCloud]);

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

  // Aseguramos JSX válido incluso si no hay activePaseo después de cargar
  if (notFound || !state.activePaseo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">
          Plan no encontrado
        </h2>
        <p className="text-slate-500 font-medium">
          La invitación que buscas no existe o el enlace es incorrecto.
        </p>
      </div>
    );
  }

  const paseo = state.activePaseo;

  const catStyle = CAT_STYLE[paseo.category] || CAT_STYLE.finca;
  const dateLabel = formatDateLabel(paseo);
  const destination = paseo.logistics?.destination || "";
  const confirmedCount = paseo.participants.filter(
    (p) => p.status === "confirmed"
  ).length;
  const alreadyJoined = paseo.participants.some(
    (p) =>
      p.name.trim().toLowerCase() === guestName.trim().toLowerCase() &&
      p.status !== "cancelled"
  );

  const handleConfirm = async () => {
    const trimmed = guestName.trim();
    if (trimmed.length < 2) {
      setNameError("Escribe tu nombre (minimo 2 caracteres)");
      inputRef.current?.focus();
      return;
    }
    if (alreadyJoined) {
      setNameError("Ese nombre ya esta confirmado en el paseo!");
      return;
    }

    setNameError("");
    setConfirming(true);

    try {
      // 1. Agregamos el participante localmente en Zustand
      addParticipant({
        id:
          "guest_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
        name: trimmed,
        role: "guest",
        status: "confirmed",
        hasPaid: false,
        joinedAt: new Date().toISOString(),
      });

      // 2. Extraemos el paseo YA actualizado para enviarlo a Supabase de manera segura (evitamos stale closures)
      const updatedPaseo = usePaseo.getState().state.activePaseo;

      // 3. Guardamos el paseo en la nube con el nuevo invitado antes de avanzar
      if (updatedPaseo && typeof savePaseoToCloud === "function") {
        await savePaseoToCloud(updatedPaseo);
      }

      setConfirming(false);
      setConfirmed(true);
      setShowToast(true);

      // 4. Temporizadores para feedback visual y posterior redirección al Guest Dashboard
      // Aseguramos que 'slug' exista antes de navegar. Nunca navegamos a una ruta vacía.
      if (slug) {
        setTimeout(() => setShowToast(false), 2200);
        setTimeout(() => {
          console.log("Navegando a:", "/paseo/" + slug + "/guest-hub");
          navigate(`/paseo/${slug}/guest-hub`);
        }, 2600);
      } else {
        // En caso de un fallo bizarro donde se borró el slug de la URL, mantenemos al usuario en la vista actual.
        console.error(
          "No se pudo navegar porque el slug desapareció de la URL."
        );
        setConfirming(false);
        setConfirmed(false);
      }
    } catch (error) {
      console.error("Error al registrarse en el paseo:", error);
      setNameError(
        "Hubo un error de conexión al unirse al plan. Inténtalo de nuevo."
      );
      setConfirming(false);
    }
  };

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg,#0F172A 0%,#1E293B 60%,#0F172A 100%)",
      }}
    >
      <div
        className="absolute w-80 h-80 rounded-full opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${catStyle.from}, transparent)`,
          top: "-5rem",
          right: "-4rem",
        }}
      />
      <div
        className="absolute w-72 h-72 rounded-full opacity-15 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${catStyle.to}, transparent)`,
          bottom: "-4rem",
          left: "-4rem",
        }}
      />

      <SuccessToast name={guestName} visible={showToast} />

      <div
        className="w-full max-w-sm"
        style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.5))" }}
      >
        <div className="bg-white rounded-3xl overflow-hidden">
          {/* HEADER */}
          <div
            className="relative px-6 pt-8 pb-6 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${catStyle.from} 0%, ${catStyle.to} 100%)`,
            }}
          >
            <div className="absolute w-40 h-40 rounded-full bg-white/10 -top-10 -right-10" />
            <div className="absolute w-24 h-24 rounded-full bg-white/10 -bottom-8 -left-4" />
            <div className="relative flex items-center justify-between mb-5">
              <span className="text-[10px] font-extrabold text-white/70 uppercase tracking-widest">
                PaseoYa · Invitacion
              </span>
              <span className="text-[10px] font-bold text-white/60 bg-white/20 px-2.5 py-1 rounded-full">
                {catStyle.label}
              </span>
            </div>
            <div className="relative">
              <div className="text-5xl mb-3">{paseo.emoji}</div>
              <h1 className="text-white text-2xl font-extrabold leading-tight mb-1">
                {paseo.name}
              </h1>
              <p className="text-white/80 text-sm font-semibold">
                Organizado por{" "}
                <span className="text-white font-extrabold">
                  {paseo.createdBy}
                </span>
              </p>
            </div>
            <div className="relative flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                📅 {dateLabel}
              </span>
              {destination && (
                <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  📍 {destination}
                </span>
              )}
            </div>
          </div>

          {/* PARTICIPANTS PREVIEW */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {paseo.participants
                  .filter((p) => p.status === "confirmed")
                  .slice(0, 5)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold text-slate-700 flex-shrink-0"
                      style={{ background: getAvatarBg(p.name) }}
                      title={p.name}
                    >
                      {getInitials(p.name)}
                    </div>
                  ))}
                {confirmedCount > 5 && (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-extrabold text-slate-500 flex-shrink-0">
                    +{confirmedCount - 5}
                  </div>
                )}
              </div>
              <p className="ml-3 text-xs font-semibold text-slate-500">
                <span className="font-extrabold text-slate-800">
                  {confirmedCount}
                </span>{" "}
                ya confirmaron
              </p>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
              🟢 Abierto
            </span>
          </div>

          {/* RSVP FORM */}
          <div className="px-6 py-5 space-y-4">
            {!confirmed ? (
              <>
                <div className="mb-4 bg-orange-50 border border-orange-100 p-3 rounded-xl flex items-start gap-3">
                  <span className="text-xl mt-0.5">💸</span>
                  <div>
                    <p className="text-sm font-bold text-orange-700">
                      Calculando cuota...
                    </p>
                    <p className="text-xs text-orange-600/80">
                      ¡Entre más seamos, más barato sale!
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-base font-extrabold text-slate-900 mb-1">
                    Te apuntas? 🎒
                  </p>
                  <p className="text-xs text-slate-400 mb-3">
                    Escribe tu nombre para confirmar tu asistencia. Sin
                    registro, sin contrasenas.
                  </p>
                  <div
                    className={`flex items-center gap-3 bg-slate-50 border-2 rounded-2xl px-4 py-3 transition-all duration-200 ${
                      nameError
                        ? "border-red-400 bg-red-50"
                        : "border-slate-200 focus-within:border-orange-400 focus-within:shadow-[0_0_0_3px_rgba(249,115,22,0.15)]"
                    }`}
                  >
                    <span className="text-xl">👤</span>
                    <input
                      ref={inputRef}
                      type="text"
                      id="guest-name-input"
                      value={guestName}
                      onChange={(e) => {
                        setGuestName(e.target.value);
                        setNameError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                      placeholder="Tu nombre completo"
                      maxLength={40}
                      autoComplete="name"
                      className="flex-1 bg-transparent outline-none text-slate-900 font-semibold placeholder:text-slate-300 text-base"
                    />
                    {guestName.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setGuestName("");
                          setNameError("");
                          inputRef.current?.focus();
                        }}
                        className="text-slate-300 hover:text-slate-500 transition-colors text-sm font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {nameError && (
                    <p className="text-xs text-red-500 font-semibold mt-1.5 ml-1">
                      {nameError}
                    </p>
                  )}
                </div>

                <button
                  id="confirm-rsvp-btn"
                  type="button"
                  onClick={handleConfirm}
                  disabled={confirming || guestName.trim().length < 2}
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-white font-extrabold text-base transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg,#F97316,#EA580C)",
                    boxShadow: "0 8px 24px -4px rgba(249,115,22,0.55)",
                  }}
                >
                  {confirming ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Confirmando...
                    </>
                  ) : (
                    <>
                      <span className="text-xl">🎒</span>Confirmar Asistencia!
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 pt-1">
                  {[
                    { emoji: "🚫", text: "Sin registro" },
                    { emoji: "🔒", text: "Sin contrasena" },
                    { emoji: "⚡", text: "Al instante" },
                  ].map((item) => (
                    <div
                      key={item.text}
                      className="flex flex-col items-center gap-0.5"
                    >
                      <span className="text-base">{item.emoji}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-4 text-center space-y-3">
                <div
                  className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl shadow-lg"
                  style={{
                    background: "linear-gradient(135deg,#10B981,#059669)",
                    boxShadow: "0 8px 24px -4px rgba(16,185,129,0.5)",
                  }}
                >
                  💸
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    ¡Bajo la cuota a $
                    {Math.round(
                      (paseo.finance?.totalBudget || 0) / (confirmedCount + 1)
                    ).toLocaleString()}
                    !
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Gracias a ti, {guestName.split(" ")[0]}. Redirigiendo al
                    Hub...
                  </p>
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <div
                    className="w-2 h-2 rounded-full bg-green-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-green-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-green-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="px-6 pb-6">
            <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50">
              <span className="text-sm">🌴</span>
              <span className="text-[11px] font-bold text-slate-400">
                Organizado con <span className="text-orange-500">PaseoYa</span>{" "}
                · Cero friccion
              </span>
            </div>
          </div>
        </div>
      </div>

      {!confirmed && (
        <p className="mt-6 text-slate-500 text-xs font-medium text-center">
          Al confirmar, tu nombre aparecera en el panel del paseo
        </p>
      )}
    </div>
  );
}
