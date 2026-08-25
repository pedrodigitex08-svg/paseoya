import re
file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

modal_code = '''
function ParticipantSettingsModal({ participant, paseo, onClose }) {
  const [days, setDays] = useState(participant?.daysStayed ?? getTripDays(paseo));
  const [drinks, setDrinks] = useState(participant?.drinksAlcohol ?? true);

  const handleSave = () => {
    const updatedParticipants = paseo.participants.map(p => 
      p.id === participant.id 
        ? { ...p, daysStayed: days, drinksAlcohol: drinks } 
        : p
    );
    usePaseoStore.getState().updatePaseo(paseo.slug, { participants: updatedParticipants });
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
              className={w-12 h-6 rounded-full transition-colors relative flex items-center p-1 }
            >
              <div className={w-4 h-4 bg-white rounded-full transition-transform } />
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
'''
content = content.replace('export default function LaVaca() {', modal_code + '\nexport default function LaVaca() {')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added Modal")
