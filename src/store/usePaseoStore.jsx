// store/usePaseoStore.jsx — Fase A y B: Súper Formulario + Votaciones + Nube (Supabase)
import { create } from "zustand";
import { persist } from "zustand/middleware"; // 🔥 EL CINTURÓN DE SEGURIDAD
// ☁️ Importamos el cliente de Supabase (Asumiendo que supabase.js está en src/supabase)
import { supabase } from "./supabase";

// ─────────────────────────────────────────────
// PASEO FACTORY (Adaptado para la nueva data)
// ─────────────────────────────────────────────
export const createPaseoTemplate = (data) => {
  const isSameDay = data.esPasadia ?? data.isSameDay ?? false;

  // Soporte dual: Data nueva (Súper Formulario) y Data Legacy
  const name = data.nombrePaseo || data.name || "Nuevo Paseo";
  const category = data.categoria || data.category || "finca";
  const createdBy = data.anfitrion || data.createdBy || "Anfitrión";

  // 🛡️ BÚSQUEDA AGRESIVA DE CREACIÓN: Atrapa el lugar no importa cómo se llame
  const locationText =
    data.ubicacion || data.location || data.destination || data.city || "";

  const costoBase = Number(data.costoBase) || Number(data.totalBudget) || 0;

  return {
    id: `paseo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    slug: `${name.toLowerCase().replace(/\s+/g, "-")}-${Math.random()
      .toString(36)
      .slice(2, 5)}`,
    name,
    category,
    emoji: data.emoji || "🎒",
    isSameDay,
    tentativeDates: data.tentativeDates || [
      {
        id: "d1",
        startDate: isSameDay ? data.fechaUnica : data.fechaIda || "",
        endDate: isSameDay ? data.fechaUnica : data.fechaRegreso || "",
      },
    ],
    description: data.description || "",
    createdAt: new Date().toISOString(),
    createdBy,

    // 🛡️ GUARDADO DUAL: Nos aseguramos de que el Dashboard lo lea sí o sí
    location: locationText,
    ubicacion: locationText,

    linkLugar: data.linkLugar || "",

    // Estado Inmortal del Temporizador Independiente
    votingState: {
      location: { isActive: false, endTime: null },
      date: { isActive: false, endTime: null },
    },

    // FASE B: Fecha Límite de Votación
    fechaLimiteVotacion: data.fechaLimiteVotacion || null,

    // FASE B: Gestión de Invitados
    participants: [
      {
        id: "host_1",
        name: createdBy,
        role: "host",
        status: "confirmed",
        hasPaid: true,
        joinedAt: new Date().toISOString(),
      },
    ],

    // FASE B: Sistema de Votación de Lugares (El núcleo)
    lugaresSugeridos: [],

    votes: { dates: {}, places: {} }, // Legacy votes compatibilidad
    places: [], // Legacy places compatibilidad

    logistics: {
      ingredients: [],
      destination: locationText, // Sincronizado por retrocompatibilidad
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
    },
    finance: {
      totalBudget: costoBase,
      contributions: [],
      expenses: [],
      debts: [],
      billItems: [],
      paymentLinks: { nequi: "", daviplata: "", breb: "" },
    },
    orgPercentage: 0,
  };
};

// ─────────────────────────────────────────────
// ZUSTAND STORE
// ─────────────────────────────────────────────
const initialDataState = {
  activePaseo: null,
  paseos: [],
  currentUser: {
    id: `user_${Math.random().toString(36).slice(2, 8)}`,
    name: "Invitado",
    role: "guest",
  },
  ui: { loading: false, error: null },
};

export const usePaseo = create(
  persist(
    (set, get) => {
      // Helper para mantener sincronizado activePaseo y la Nube
      const sync = async (updatedPaseo) => {
        // 1. Actualiza la memoria local (Zustand) para que la pantalla cambie de inmediato
        set((store) => {
          const exists = store.state.paseos.some(
            (p) => p.id === updatedPaseo.id
          );
          return {
            state: {
              ...store.state,
              activePaseo: updatedPaseo,
              paseos: exists
                ? store.state.paseos.map((p) =>
                    p.id === updatedPaseo.id ? updatedPaseo : p
                  )
                : [...store.state.paseos, updatedPaseo],
            },
          };
        });

        // 2. Dispara el guardado en la nube en segundo plano silenciosamente
        try {
          await get().savePaseoToCloud(updatedPaseo);
        } catch (error) {
          console.error("Error al sincronizar acción con la nube:", error);
        }
      };

      return {
        state: initialDataState,

        // ── ☁️ FUNCIONES DE LA NUBE (SUPABASE) ──────────────────────────────
        savePaseoToCloud: async (paseoData) => {
          try {
            const { error } = await supabase
              .from("paseos")
              .upsert(
                { short_id: paseoData.slug, data: paseoData },
                { onConflict: "short_id" }
              );

            if (error) throw error;
            return true;
          } catch (error) {
            console.error("🔥 Error de Arquitecto - Falló Supabase:", error);
            throw error;
          }
        },

        loadPaseoFromCloud: async (slug) => {
          try {
            if (!slug) return null;

            const { data, error } = await supabase
              .from("paseos")
              .select("data")
              .eq("short_id", slug)
              .single(); // .single() asegura devolver 1 solo objeto, y lanza error (ej. PGRST116) si no encuentra nada

            if (error) {
              console.warn(
                "⚠️ Paseo no encontrado o error en Supabase:",
                error.message
              );

              set((store) => ({
                state: {
                  ...store.state,
                  activePaseo: null,
                },
              }));
              return null;
            }

            if (data && data.data) {
              const paseoCloud = data.data;

              set((store) => {
                const exists = store.state.paseos.some(
                  (p) => p.id === paseoCloud.id
                );
                return {
                  state: {
                    ...store.state,
                    activePaseo: paseoCloud,
                    paseos: exists
                      ? store.state.paseos.map((p) =>
                          p.id === paseoCloud.id ? paseoCloud : p
                        )
                      : [paseoCloud, ...store.state.paseos],
                  },
                };
              });

              return paseoCloud;
            }

            return null;
          } catch (error) {
            console.error(
              "🔥 Error inesperado al descargar de Supabase:",
              error
            );
            return null;
          }
        },
        // ──────────────────────────────────────────────────────────────────

        // ── Paseo ──────────────────────────────────────────────────────────
        createPaseo: (data) => {
          const newPaseo = createPaseoTemplate(data);
          set((store) => ({
            state: {
              ...store.state,
              activePaseo: newPaseo,
              paseos: [newPaseo, ...store.state.paseos],
              currentUser: {
                id: "host_1",
                name: newPaseo.createdBy,
                role: "host",
              },
            },
          }));
        },
        setActivePaseo: (payload) =>
          set((store) => ({ state: { ...store.state, activePaseo: payload } })),
        updatePaseo: async (id, data) => {
          // 1. Actualizamos Zustand (Memoria RAM) de forma sincrónica para que la UI responda rápido
          set((store) => {
            const upd = store.state.paseos.map((p) =>
              p.id === id ? { ...p, ...data } : p
            );
            const active =
              store.state.activePaseo?.id === id
                ? { ...store.state.activePaseo, ...data }
                : store.state.activePaseo;
            return {
              state: { ...store.state, paseos: upd, activePaseo: active },
            };
          });

          // 2. Disparamos la actualización a Supabase (La Nube) en segundo plano
          const currentActive = get().state.activePaseo;
          if (currentActive && currentActive.id === id) {
            try {
              await get().savePaseoToCloud(currentActive);
            } catch (error) {
              console.error("Error guardando actualización en la nube:", error);
            }
          }
        },

        // ── FASE B: Votaciones de Lugares (Núcleo) ──────────────────────────
        agregarLugarSugerido: (lugar) => {
          const active = get().state.activePaseo;
          if (!active) return;
          const nuevoLugar = {
            ...lugar,
            id: `lugar_${Date.now()}`,
            votos: [], // Array de IDs de usuarios que apoyan este lugar
          };
          sync({
            ...active,
            lugaresSugeridos: [...(active.lugaresSugeridos || []), nuevoLugar],
          });
        },

        votarPorLugar: (idLugar, idUsuario) => {
          const active = get().state.activePaseo;
          if (!active) return;
          const lugares = active.lugaresSugeridos || [];

          const nuevosLugares = lugares.map((lugar) => {
            if (lugar.id === idLugar) {
              const yaVoto = lugar.votos?.includes(idUsuario);
              return {
                ...lugar,
                // Si ya votó se lo quitamos (toggle), si no, lo agregamos
                votos: yaVoto
                  ? lugar.votos.filter((id) => id !== idUsuario)
                  : [...(lugar.votos || []), idUsuario],
              };
            }
            return lugar;
          });
          sync({ ...active, lugaresSugeridos: nuevosLugares });
        },

        cerrarVotacion: () => {
          const active = get().state.activePaseo;
          if (!active) return;
          const lugares = active.lugaresSugeridos || [];
          if (lugares.length === 0) return;

          // Calcular el ganador iterando sobre los votos
          let ganador = lugares[0];
          let maxVotos = ganador.votos?.length || 0;

          for (let i = 1; i < lugares.length; i++) {
            const votos = lugares[i].votos?.length || 0;
            if (votos > maxVotos) {
              maxVotos = votos;
              ganador = lugares[i];
            }
          }

          // Reemplazar costoBase, ubicacion y linkLugar principal con el ganador
          const newActive = {
            ...active,
            location: ganador.nombre,
            ubicacion: ganador.nombre, // 🛡️ Sincronización dual
            linkLugar: ganador.link,
            logistics: {
              ...active.logistics,
              destination: ganador.nombre, // Sincroniza la retrocompatibilidad
            },
            finance: {
              ...active.finance,
              totalBudget:
                Number(ganador.costoBase) || active.finance.totalBudget,
            },
            fechaLimiteVotacion: null, // Opcional: se limpia para indicar que la votación terminó
          };

          sync(newActive);
        },

        // ── Estado Inmortal de Votación (Temporizadores Independientes) ──────
        startVoting: (category, duration) => {
          const active = get().state.activePaseo;
          if (!active) return;

          sync({
            ...active,
            votingState: {
              ...active.votingState,
              [category]: {
                isActive: true,
                endTime: Date.now() + duration,
              },
            },
          });
        },

        applyVotingWinner: (category, winnerData) => {
          const active = get().state.activePaseo;
          if (!active) return;

          let updates = {};

          if (category === "location") {
            const newBudget = Number(
              winnerData.cost || winnerData.budget || winnerData.costoBase || 0
            );
            const newName = winnerData.name || winnerData.nombre;

            updates = {
              location: newName,
              ubicacion: newName, // 🛡️ Sincronización dual
              finance: {
                ...active.finance,
                totalBudget:
                  newBudget > 0 ? newBudget : active.finance.totalBudget,
              },
              logistics: {
                ...active.logistics,
                destination: newName,
              },
            };
          } else if (category === "date") {
            updates = {
              date: winnerData.date || winnerData,
            };
          }

          sync({
            ...active,
            ...updates,
            votingState: {
              ...active.votingState,
              [category]: {
                isActive: false,
                endTime: null,
              },
            },
          });
        },

        // ── Participants ────────────────────────────────────────────────────
        addParticipant: (p) => {
          const active = get().state.activePaseo;
          if (!active) return;
          sync({ ...active, participants: [...active.participants, p] });
        },
        removeParticipant: (id) => {
          const active = get().state.activePaseo;
          if (!active) return;
          sync({
            ...active,
            participants: active.participants.filter((x) => x.id !== id),
          });
        },
        togglePayment: (id) => {
          const active = get().state.activePaseo;
          if (!active) return;
          sync({
            ...active,
            participants: active.participants.map((x) =>
              x.id === id ? { ...x, hasPaid: !x.hasPaid } : x
            ),
          });
        },

        // ── Legacy Voting (Fechas y lugares antiguos) ───────────────────────
        voteDate: (dateId, vote) => {
          const active = get().state.activePaseo;
          if (!active) return;
          const userId = get().state.currentUser.id;
          const existing = active.votes.dates[dateId]?.[userId];
          const newVote = existing === vote ? null : vote;
          const dateVotes = { ...(active.votes.dates[dateId] || {}) };
          if (newVote === null) delete dateVotes[userId];
          else dateVotes[userId] = newVote;
          sync({
            ...active,
            votes: {
              ...active.votes,
              dates: { ...active.votes.dates, [dateId]: dateVotes },
            },
          });
        },
        suggestDate: (d) => {
          const active = get().state.activePaseo;
          if (!active) return;
          sync({
            ...active,
            tentativeDates: [
              ...active.tentativeDates,
              { ...d, id: `date_${Date.now()}` },
            ],
          });
        },
        addPlace: (p) => {
          const active = get().state.activePaseo;
          if (!active) return;
          sync({
            ...active,
            places: [...active.places, { ...p, id: `place_${Date.now()}` }],
          });
        },
        removePlace: (id) => {
          const active = get().state.activePaseo;
          if (!active) return;
          sync({
            ...active,
            places: active.places.filter((pl) => pl.id !== id),
          });
        },
        votePlace: (placeId, vote) => {
          const active = get().state.activePaseo;
          if (!active) return;
          const userId = get().state.currentUser.id;
          const existing = active.votes.places[placeId]?.[userId];
          const newVote = existing === vote ? null : vote;
          const placeVotes = { ...(active.votes.places[placeId] || {}) };
          if (newVote === null) delete placeVotes[userId];
          else placeVotes[userId] = newVote;
          sync({
            ...active,
            votes: {
              ...active.votes,
              places: { ...active.votes.places, [placeId]: placeVotes },
            },
          });
        },

        // ── Logistics: Transport — Cars ─────────────────────────────────────
        addCar: (c) => {
          const active = get().state.activePaseo;
          if (!active) return;
          const car = { ...c, id: `car_${Date.now()}`, passengers: [] };
          sync({
            ...active,
            logistics: {
              ...active.logistics,
              transport: {
                ...active.logistics.transport,
                cars: [...active.logistics.transport.cars, car],
              },
            },
          });
        },
        removeCar: (id) => {
          const active = get().state.activePaseo;
          if (!active) return;
          sync({
            ...active,
            logistics: {
              ...active.logistics,
              transport: {
                ...active.logistics.transport,
                cars: active.logistics.transport.cars.filter(
                  (c) => c.id !== id
                ),
              },
            },
          });
        },
        assignPassengerToCar: (carId, participantId) => {
          const active = get().state.activePaseo;
          if (!active) return;
          const cars = active.logistics.transport.cars.map((c) => {
            if (c.id !== carId) return c;
            if (c.passengers.includes(participantId)) return c;
            if (c.passengers.length >= c.capacity - 1) return c;
            return { ...c, passengers: [...c.passengers, participantId] };
          });
          sync({
            ...active,
            logistics: {
              ...active.logistics,
              transport: { ...active.logistics.transport, cars },
            },
          });
        },
        removePassengerFromCar: (carId, participantId) => {
          const active = get().state.activePaseo;
          if (!active) return;
          const cars = active.logistics.transport.cars.map((c) =>
            c.id === carId
              ? {
                  ...c,
                  passengers: c.passengers.filter(
                    (pid) => pid !== participantId
                  ),
                }
              : c
          );
          sync({
            ...active,
            logistics: {
              ...active.logistics,
              transport: { ...active.logistics.transport, cars },
            },
          });
        },

        // ── Logistics: Transport — Bus ──────────────────────────────────────
        updateBus: (d) => {
          const active = get().state.activePaseo;
          if (!active) return;
          sync({
            ...active,
            logistics: {
              ...active.logistics,
              transport: {
                ...active.logistics.transport,
                bus: { ...active.logistics.transport.bus, ...d },
              },
            },
          });
        },
        updateDestination: (v) => {
          const active = get().state.activePaseo;
          if (!active) return;
          sync({
            ...active,
            logistics: { ...active.logistics, destination: v },
          });
        },

        // ── Logistics: Menu ─────────────────────────────────────────────────
        addIngredient: (i) => {
          const active = get().state.activePaseo;
          if (!active) return;
          sync({
            ...active,
            logistics: {
              ...active.logistics,
              ingredients: [
                ...active.logistics.ingredients,
                { ...i, id: `ing_${Date.now()}`, bought: false },
              ],
            },
          });
        },
        removeIngredient: (id) => {
          const active = get().state.activePaseo;
          if (!active) return;
          sync({
            ...active,
            logistics: {
              ...active.logistics,
              ingredients: active.logistics.ingredients.filter(
                (i) => i.id !== id
              ),
            },
          });
        },
        toggleIngredientBought: (id) => {
          const active = get().state.activePaseo;
          if (!active) return;
          sync({
            ...active,
            logistics: {
              ...active.logistics,
              ingredients: active.logistics.ingredients.map((i) =>
                i.id === id ? { ...i, bought: !i.bought } : i
              ),
            },
          });
        },

        // ── Finance ─────────────────────────────────────────────────────────
        updateBudget: (n) => {
          const active = get().state.activePaseo;
          if (!active) return;
          sync({ ...active, finance: { ...active.finance, totalBudget: n } });
        },
        updatePaymentLinks: (d) => {
          const active = get().state.activePaseo;
          if (!active) return;
          sync({
            ...active,
            finance: {
              ...active.finance,
              paymentLinks: { ...active.finance.paymentLinks, ...d },
            },
          });
        },
        addExpense: (e) => {
          const active = get().state.activePaseo;
          if (!active) return;
          sync({
            ...active,
            finance: {
              ...active.finance,
              expenses: [
                ...active.finance.expenses,
                {
                  ...e,
                  id: `exp_${Date.now()}`,
                  date: new Date().toISOString(),
                },
              ],
            },
          });
        },
        removeExpense: (id) => {
          const active = get().state.activePaseo;
          if (!active) return;
          sync({
            ...active,
            finance: {
              ...active.finance,
              expenses: active.finance.expenses.filter((e) => e.id !== id),
            },
          });
        },
        addDebt: (d) => {
          const active = get().state.activePaseo;
          if (!active) return;
          sync({
            ...active,
            finance: {
              ...active.finance,
              debts: [
                ...(active.finance.debts || []),
                {
                  ...d,
                  id: `debt_${Date.now()}`,
                  settled: false,
                  createdAt: new Date().toISOString(),
                },
              ],
            },
          });
        },
        removeDebt: (id) => {
          const active = get().state.activePaseo;
          if (!active) return;
          sync({
            ...active,
            finance: {
              ...active.finance,
              debts: (active.finance.debts || []).filter((d) => d.id !== id),
            },
          });
        },
        toggleDebtSettled: (id) => {
          const active = get().state.activePaseo;
          if (!active) return;
          sync({
            ...active,
            finance: {
              ...active.finance,
              debts: (active.finance.debts || []).map((d) =>
                d.id === id ? { ...d, settled: !d.settled } : d
              ),
            },
          });
        },

        // ── Parte-Cuentas (Bill Items) ──────────────────────────────────────
        addBillItem: (item) => {
          const active = get().state.activePaseo;
          if (!active) return;
          const newItem = {
            ...item,
            id: `bill_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            sharedBy: [],
          };
          sync({
            ...active,
            finance: {
              ...active.finance,
              billItems: [...(active.finance.billItems || []), newItem],
            },
          });
        },
        removeBillItem: (itemId) => {
          const active = get().state.activePaseo;
          if (!active) return;
          sync({
            ...active,
            finance: {
              ...active.finance,
              billItems: (active.finance.billItems || []).filter(
                (b) => b.id !== itemId
              ),
            },
          });
        },
        toggleBillItemParticipant: (itemId, participantId) => {
          const active = get().state.activePaseo;
          if (!active) return;
          const newBillItems = (active.finance.billItems || []).map((b) => {
            if (b.id !== itemId) return b;
            const shared = b.sharedBy || [];
            const hasParticipant = shared.includes(participantId);
            return {
              ...b,
              sharedBy: hasParticipant
                ? shared.filter((id) => id !== participantId)
                : [...shared, participantId],
            };
          });
          sync({
            ...active,
            finance: {
              ...active.finance,
              billItems: newBillItems,
            },
          });
        },

        // ── User / UI ───────────────────────────────────────────────────────
        setCurrentUser: (d) =>
          set((store) => ({
            state: {
              ...store.state,
              currentUser: { ...store.state.currentUser, ...d },
            },
          })),

        // ── Calculators ──────────────────────────────────────────────────────
        calcCuota: (paseo) => {
          if (!paseo) return 0;
          const active = paseo.participants.filter(
            (p) => p.status !== "cancelled"
          ).length;
          return active === 0 ? 0 : paseo.finance.totalBudget / active;
        },
        getBusAddon: (paseo, participantId) => {
          if (!paseo) return 0;
          const { bus } = paseo.logistics.transport;
          if (
            !bus.enabled ||
            bus.totalCost <= 0 ||
            bus.assignedParticipants.length === 0
          )
            return 0;
          return bus.assignedParticipants.includes(participantId)
            ? bus.totalCost / bus.assignedParticipants.length
            : 0;
        },
        calcPersonCuota: (paseo, participantId) => {
          if (!paseo) return 0;
          const activeStore = get();
          return (
            activeStore.calcCuota(paseo) +
            activeStore.getBusAddon(paseo, participantId)
          );
        },
        calcRecaudo: (paseo) => {
          if (!paseo || paseo.finance.totalBudget === 0) return 0;
          const paid = paseo.participants.filter(
            (p) => p.hasPaid && p.status !== "cancelled"
          ).length;
          const total = paseo.participants.filter(
            (p) => p.status !== "cancelled"
          ).length;
          return total === 0 ? 0 : Math.round((paid / total) * 100);
        },
        calcOrgPercentage: (paseo) => {
          if (!paseo) return 0;
          let s = 0;
          if (paseo.name) s += 20;
          if (paseo.tentativeDates?.some((d) => d.startDate)) s += 20;
          if (paseo.places?.length > 0) s += 20;
          if (paseo.participants?.length >= 2) s += 20;
          if (paseo.finance?.totalBudget > 0) s += 20;
          return s;
        },

        getDateVotes: (paseo, dateId) => {
          const v = Object.values(paseo?.votes?.dates?.[dateId] || {});
          return {
            yes: v.filter((x) => x === "yes").length,
            no: v.filter((x) => x === "no").length,
          };
        },
        getUserDateVote: (paseo, dateId, userId) =>
          paseo?.votes?.dates?.[dateId]?.[userId] ?? null,

        getPlaceVotes: (paseo, placeId) => {
          const v = Object.values(paseo?.votes?.places?.[placeId] || {});
          return {
            likes: v.filter((x) => x === "like").length,
            dislikes: v.filter((x) => x === "dislike").length,
          };
        },
        getUserPlaceVote: (paseo, placeId, userId) =>
          paseo?.votes?.places?.[placeId]?.[userId] ?? null,

        generateLink: (paseo) =>
          `${window.location.origin}/paseo/${paseo?.slug}`,
      };
    },
    {
      name: "paseoyya-storage", // 🔥 Nombre con el que se guardará en el disco duro del celular
      partialize: (store) => ({ state: store.state }), // Solo guardamos el estado vital
    }
  )
);

// ─────────────────────────────────────────────
// PROVIDER (Dummy - Para Retrocompatibilidad con App.jsx)
// ─────────────────────────────────────────────
export function PaseoProvider({ children }) {
  return children;
}
