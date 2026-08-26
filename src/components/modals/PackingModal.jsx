import { useState, useEffect } from "react";

export function PackingModal({ paseo, onClose }) {
  const [checkedItems, setCheckedItems] = useState(() => {
    const saved = localStorage.getItem(`packing_${paseo.id}`);
    return saved ? JSON.parse(saved) : {};
  });

  const getSuggestedItems = () => {
    const cat = paseo.category;
    if (cat === "playa") return ["Bloqueador solar", "Traje de baño", "Toalla de playa", "Gafas de sol", "Sandalias", "Gorra/Sombrero"];
    if (cat === "finca") return ["Repelente de mosquitos", "Ropa cómoda", "Traje de baño", "Zapatos cerrados", "Gorra", "Chaqueta ligera"];
    if (cat === "montana") return ["Botas/Tenis de senderismo", "Chaqueta impermeable", "Ropa abrigada", "Linterna", "Snacks", "Botella de agua"];
    if (cat === "ciudad") return ["Zapatos súper cómodos", "Batería portátil", "Chaqueta casual", "Paraguas pequeño", "Cámara/Celular con espacio"];
    if (cat === "futbol") return ["Camiseta del equipo", "Guayos/Zapatillas", "Medias largas", "Espinilleras", "Toalla de mano", "Ropa de cambio"];
    if (cat === "rumba") return ["Ropa de salir", "Cédula/ID", "Efectivo para taxis", "Perfume", "Llaves de la casa"];
    return ["Ropa cómoda", "Cargador del celular", "Artículos de aseo", "Documentos", "Medicamentos personales"];
  };

  const items = getSuggestedItems();
  const checkedCount = items.filter(i => checkedItems[i]).length;
  const progress = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;

  useEffect(() => {
    localStorage.setItem(`packing_${paseo.id}`, JSON.stringify(checkedItems));
  }, [checkedItems, paseo.id]);

  const toggleItem = (item) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl h-[80vh] sm:h-auto sm:max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-full duration-300">
        <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md rounded-t-3xl">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              🎒 Mi Maleta
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Sugerencias para {paseo.category || "viaje"}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200">
            <span className="text-slate-600 font-bold">X</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Progreso</span>
              <span className="text-xs font-extrabold text-emerald-600">{checkedCount} / {items.length}</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="space-y-2 mt-6">
            {items.map((item, idx) => (
              <label key={idx} className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all cursor-pointer ${checkedItems[item] ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                <input type="checkbox" className="hidden" checked={!!checkedItems[item]} onChange={() => toggleItem(item)} />
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${checkedItems[item] ? 'bg-emerald-500 text-white' : 'bg-slate-100'}`}>
                  {checkedItems[item] && <span className="text-sm">✓</span>}
                </div>
                <span className={`text-sm font-bold flex-1 transition-all ${checkedItems[item] ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
