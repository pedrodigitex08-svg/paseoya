import { useState } from "react";

export function RouletteModal({ paseo, onClose }) {
  const [task, setTask] = useState("¿Quién lava los platos?");
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [rotation, setRotation] = useState(0);

  const participants = paseo.participants?.filter(p => p.status !== "cancelled").map(p => p.name) || ["Jugador 1", "Jugador 2", "Jugador 3"];

  const spin = () => {
    if (isSpinning || participants.length < 2) return;
    setIsSpinning(true);
    setWinner(null);
    
    // Random spin logic: multiple full rotations + random landing
    const spins = 5;
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalRotation = rotation + (spins * 360) + extraDegrees;
    
    setRotation(totalRotation);

    // Calculate winner based on final angle
    setTimeout(() => {
      // Offset by 90deg because the arrow points right typically, but let's assume it points top
      const normalizedAngle = (360 - (totalRotation % 360)) % 360;
      const sliceAngle = 360 / participants.length;
      const winnerIndex = Math.floor(normalizedAngle / sliceAngle);
      setWinner(participants[winnerIndex]);
      setIsSpinning(false);
    }, 4000); // 4 seconds transition
  };

  const colors = ["#F43F5E", "#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#6366F1", "#14B8A6", "#EF4444", "#84CC16"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm transition-all">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center relative overflow-hidden animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 z-10">
          <span className="text-slate-600 font-bold">X</span>
        </button>

        <h3 className="font-extrabold text-slate-900 text-lg mb-1 text-center mt-2">🎲 Ruleta del Paseo</h3>
        <p className="text-xs font-semibold text-slate-500 mb-6 text-center">Decide la suerte de los invitados</p>

        <div className="w-full mb-6">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="¿Qué nos jugamos?"
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-extrabold text-slate-700 outline-none focus:border-indigo-500 text-center"
            disabled={isSpinning}
          />
        </div>

        <div className="relative w-64 h-64 mb-8">
          {/* Arrow */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-slate-800 drop-shadow-md"></div>
          
          {/* Wheel */}
          <div 
            className="w-full h-full rounded-full border-4 border-slate-100 shadow-inner overflow-hidden relative"
            style={{ 
              transform: `rotate(${rotation}deg)`, 
              transition: isSpinning ? 'transform 4s cubic-bezier(0.1, 0, 0.1, 1)' : 'none',
              background: `conic-gradient(${participants.map((_, i) => `${colors[i % colors.length]} ${i * (360/participants.length)}deg ${(i+1) * (360/participants.length)}deg`).join(', ')})`
            }}
          >
            {participants.map((name, i) => (
              <div 
                key={i} 
                className="absolute w-full h-full flex items-start justify-center pt-4 text-white font-black text-xs drop-shadow-md"
                style={{ transform: `rotate(${(i * 360/participants.length) + (360/participants.length)/2}deg)` }}
              >
                <span className="truncate max-w-[80px]" style={{ transform: 'rotate(-90deg)', transformOrigin: '0 0', marginTop: '40px' }}>{name}</span>
              </div>
            ))}
          </div>
        </div>

        {winner && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
            <span className="text-5xl mb-4">🎉</span>
            <p className="text-sm font-extrabold text-slate-500 uppercase tracking-widest text-center">{task}</p>
            <h2 className="text-3xl font-black text-indigo-600 text-center my-2 leading-tight">{winner}</h2>
            <p className="text-sm font-semibold text-slate-600 mb-8 text-center">¡No hay marcha atrás!</p>
            
            <button onClick={() => setWinner(null)} className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md">
              Volver a jugar
            </button>
          </div>
        )}

        <button 
          onClick={spin} 
          disabled={isSpinning || participants.length < 2}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-base shadow-md disabled:opacity-50"
        >
          {isSpinning ? 'Girando...' : 'GIRAR RULETA'}
        </button>
      </div>
    </div>
  );
}
