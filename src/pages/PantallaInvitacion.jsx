// pages/PantallaInvitacion.jsx - FASE B: La Invitación Premium y RSVP Dinámico
import { useState } from "react";
import {
  MapPin,
  Link2,
  DollarSign,
  Clock,
  CheckCircle2,
  Plus,
  ExternalLink,
  ThumbsUp,
  AlertCircle,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { usePaseo } from "../store/usePaseoStore";

// Helper para formatear moneda
const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);

export default function PantallaInvitacion() {
  const { state, agregarLugarSugerido, votarPorLugar, addParticipant } =
    usePaseo();
  const paseo = state.activePaseo;

  // ── ESTADOS LOCALES DE RSVP ──
  const [nombreInvitado, setNombreInvitado] = useState("");
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [hasDeclined, setHasDeclined] = useState(false);

  // ── ESTADOS DE LA URNA DEMOCRÁTICA ──
  const [showSuggestForm, setShowSuggestForm] = useState(false);
  const [newSuggest, setNewSuggest] = useState({
    nombre: "",
    link: "",
    costoBase: "",
  });

  if (!paseo) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-slate-50 text-slate-400 font-bold">
        Cargando invitación...
      </div>
    );
  }

  const handleConfirmar = () => {
    if (!nombreInvitado.trim()) return;
    // Registramos al invitado en el estado global
    addParticipant({
      id: `guest_${Date.now()}`,
      name: nombreInvitado,
      role: "guest",
      status: "confirmed",
      hasPaid: false,
      joinedAt: new Date().toISOString(),
    });
    setHasConfirmed(true);
  };

  const handleDecline = () => {
    if (!nombreInvitado.trim()) return;
    setHasDeclined(true);
  };

  const handleSuggestSubmit = (e) => {
    e.preventDefault();
    if (!newSuggest.nombre || !newSuggest.costoBase) return;

    agregarLugarSugerido({
      nombre: newSuggest.nombre,
      link: newSuggest.link,
      costoBase: Number(newSuggest.costoBase),
    });

    setNewSuggest({ nombre: "", link: "", costoBase: "" });
    setShowSuggestForm(false);
  };

  // Cálculo dinámico para la Revelación
  const numParticipantes = paseo.participants.length;
  // Si ya confirmó, el número ya lo incluye porque addParticipant mutó el store
  const cuotaDinamica =
    paseo.finance.totalBudget / (numParticipantes > 0 ? numParticipantes : 1);

  return (
    <div className="min-h-dvh bg-slate-50 pb-24 font-sans">
      {/* ── 1. HEADER DEL PLAN (HERO) ── */}
      <div className="bg-white rounded-b-[2.5rem] shadow-sm overflow-hidden mb-6 relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-10 pointer-events-none" />
        <div className="px-6 pt-12 pb-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-500 mb-4 shadow-inner">
            <span className="text-3xl">{paseo.emoji}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            {paseo.name}
          </h1>
          <p className="text-slate-500 font-medium mb-6">
            Organizado por{" "}
            <span className="font-extrabold text-slate-800">
              {paseo.createdBy}
            </span>
          </p>

          {/* Tarjeta del Plan Original (Premium Oscura) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-1 shadow-xl shadow-slate-900/20 text-left relative transition-all duration-500">
            <div className="bg-slate-900 rounded-[1.3rem] p-6 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-1 rounded-full">
                  ✨ Plan Original
                </span>
                {paseo.linkLugar && (
                  <a
                    href={paseo.linkLugar}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-6 leading-tight">
                {paseo.location || "Destino por definir"}
              </h3>

              {/* GAMIFICACIÓN: Revelación Dinámica */}
              <div className="mt-auto border-t border-slate-700 pt-4">
                {!hasConfirmed ? (
                  <div className="flex items-center gap-3 animate-in fade-in zoom-in">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                      <Sparkles size={20} className="text-yellow-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-300 leading-tight">
                      Calculando cuota... <br />
                      <span className="text-white font-bold">
                        ¡Entre más seamos, más barato sale!
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                        Tu Cuota Actual
                      </p>
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        Ya somos {numParticipantes}
                      </span>
                    </div>
                    <p className="text-3xl font-extrabold text-emerald-400 mb-2">
                      {formatCurrency(cuotaDinamica)}
                    </p>
                    <p className="text-xs text-slate-400 font-medium leading-tight">
                      ¡Excelente,{" "}
                      <span className="text-white font-bold">
                        {nombreInvitado}
                      </span>
                      ! <br />
                      Invita a más personas para que la cuota siga bajando.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-8">
        {/* ── 2 y 3. SECCIÓN RSVP (Identificación y Acción) ── */}
        {!hasConfirmed && !hasDeclined ? (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4">
            <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <UserPlus size={20} className="text-indigo-500" /> Confirma tu
              asistencia
            </h2>

            <div className="mb-6">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5 block">
                📝 ¿Cuál es tu nombre?
              </label>
              <input
                type="text"
                value={nombreInvitado}
                onChange={(e) => setNombreInvitado(e.target.value)}
                placeholder="Ej: Laura Gómez"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-800 font-bold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-lg"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDecline}
                disabled={!nombreInvitado.trim()}
                className="flex-[0.4] py-3.5 rounded-2xl font-bold text-slate-500 bg-slate-100 disabled:opacity-50 transition-all active:scale-95"
              >
                No puedo ir 😭
              </button>
              <button
                onClick={handleConfirmar}
                disabled={!nombreInvitado.trim()}
                className="flex-[0.6] py-3.5 rounded-2xl font-extrabold text-white bg-emerald-500 shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
              >
                ¡Me apunto! 😎
              </button>
            </div>
          </div>
        ) : hasDeclined ? (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">😭</span>
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg mb-1">
              ¡Qué lástima, {nombreInvitado}!
            </h3>
            <p className="text-sm text-slate-500">
              Nos harás falta en este parche. ¡Ojalá puedas a la próxima!
            </p>
          </div>
        ) : null}

        {/* ── 5. LA URNA DEMOCRÁTICA (Plan B) ── */}
        <div className="opacity-90">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-700">
                Urna Democrática
              </h2>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                ¿No te gusta el plan original?
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {paseo.lugaresSugeridos?.map((lugar) => {
              const votosTotales = lugar.votos?.length || 0;
              const userVoted = false; // Como es un invitado local temporal, simplificamos la vista

              return (
                <div
                  key={lugar.id}
                  className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-4">
                      <h3 className="font-bold text-slate-800 leading-tight mb-1">
                        {lugar.nombre}
                      </h3>
                      {lugar.link && (
                        <a
                          href={lugar.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-500 hover:text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md"
                        >
                          <Link2 size={12} /> Ver lugar
                        </a>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Cuota Base
                      </p>
                      <p className="font-extrabold text-slate-700">
                        {formatCurrency(lugar.costoBase)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-50">
                    <button
                      onClick={() =>
                        votarPorLugar(lugar.id, `guest_${Date.now()}`)
                      }
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-slate-500 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors active:scale-95"
                    >
                      <ThumbsUp size={16} />
                      <span>Votar por esta opción</span>
                      {votosTotales > 0 && (
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-slate-200">
                          {votosTotales}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sugerir Alternativa */}
          <div className="pt-4">
            {!showSuggestForm ? (
              <button
                onClick={() => setShowSuggestForm(true)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 font-bold bg-white hover:bg-slate-50 transition-colors active:scale-95"
              >
                <Plus size={18} />
                <span>Sugerir otra alternativa</span>
              </button>
            ) : (
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 animate-in slide-in-from-bottom-4">
                <h3 className="font-extrabold text-slate-700 mb-4 flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-slate-400" /> Proponer Lugar
                </h3>
                <form onSubmit={handleSuggestSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 block mb-1">
                      Nombre del Lugar
                    </label>
                    <input
                      type="text"
                      required
                      value={newSuggest.nombre}
                      onChange={(e) =>
                        setNewSuggest({ ...newSuggest, nombre: e.target.value })
                      }
                      placeholder="Ej: Finca Los Naranjos"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 block mb-1">
                      Costo Base Propuesto (COP)
                    </label>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus-within:border-indigo-500">
                      <DollarSign size={16} className="text-slate-400" />
                      <input
                        type="number"
                        required
                        min="0"
                        value={newSuggest.costoBase}
                        onChange={(e) =>
                          setNewSuggest({
                            ...newSuggest,
                            costoBase: e.target.value,
                          })
                        }
                        placeholder="Ej: 150000"
                        className="w-full bg-transparent border-none text-sm font-bold text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 block mb-1">
                      Link (Opcional)
                    </label>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus-within:border-indigo-500">
                      <Link2 size={16} className="text-slate-400" />
                      <input
                        type="url"
                        value={newSuggest.link}
                        onChange={(e) =>
                          setNewSuggest({ ...newSuggest, link: e.target.value })
                        }
                        placeholder="https://..."
                        className="w-full bg-transparent border-none text-sm font-bold text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSuggestForm(false)}
                      className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-900 shadow-md transition-all active:scale-95"
                    >
                      Publicar
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
