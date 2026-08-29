import React, { useRef, useState } from 'react';
import { Share, X } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function CountdownShareModal({ paseo, winnerDate, onClose }) {
  const [isCapturing, setIsCapturing] = useState(false);
  const cardRef = useRef(null);

  const calculateDaysLeft = () => {
    if (!winnerDate?.startDate) return null;
    const diff = new Date(winnerDate.startDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  
  const daysLeft = calculateDaysLeft();

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      setIsCapturing(true);
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High resolution for mobile
        useCORS: true,
        backgroundColor: null,
      });

      canvas.toBlob(async (blob) => {
        setIsCapturing(false);
        if (!blob) return;
        
        const file = new File([blob], 'cuenta-regresiva.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: `¡Nos vamos a ${paseo.name}!`,
              text: '¡Mira cuánto falta para nuestro viaje!',
              files: [file]
            });
          } catch (e) {
            console.log('Error sharing:', e);
          }
        } else {
          // Fallback: Descargar
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `paseoya-${paseo.name.replace(/\s+/g, '-')}-countdown.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (error) {
      console.error(error);
      setIsCapturing(false);
    }
  };

  const getBgStyle = () => {
    const cat = paseo?.category || paseo?.categoria;
    if (cat === "playa") return "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600";
    if (cat === "finca" || cat === "montana") return "bg-gradient-to-br from-emerald-400 via-green-500 to-teal-700";
    if (cat === "rumba") return "bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-800";
    return "bg-gradient-to-br from-orange-400 via-pink-500 to-rose-500";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl w-full max-w-sm flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <h3 className="font-extrabold text-slate-800">Compartir Cuenta Regresiva</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Preview Area - Aspect Ratio 9:16 for stories */}
        <div className="p-6 flex justify-center bg-slate-50">
          <div 
            ref={cardRef}
            className={`relative overflow-hidden w-full aspect-[9/16] rounded-3xl ${getBgStyle()} shadow-xl flex flex-col items-center justify-center p-6 text-center`}
          >
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/20" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
            <div className="absolute top-10 -left-10 w-32 h-32 bg-white/20 blur-2xl rounded-full" />

            <div className="relative z-10 w-full flex flex-col items-center gap-6">
              <h2 className="text-white font-black tracking-widest uppercase text-xs drop-shadow-md">
                ¡Nos vamos de paseo!
              </h2>

              {/* Glassmorphism Card */}
              <div className="w-full bg-white/20 backdrop-blur-md border border-white/40 rounded-[32px] py-8 px-4 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] flex flex-col items-center">
                {daysLeft !== null && daysLeft > 0 ? (
                  <>
                    <span className="block text-[80px] font-black text-white drop-shadow-lg leading-[0.9]">
                      {daysLeft}
                    </span>
                    <span className="block text-2xl font-bold text-white mt-1 uppercase tracking-widest drop-shadow-md">
                      Días
                    </span>
                  </>
                ) : daysLeft === 0 ? (
                   <span className="block text-4xl font-black text-white drop-shadow-lg uppercase tracking-wide">
                      ¡ES HOY!
                    </span>
                ) : (
                  <span className="block text-xl font-bold text-white drop-shadow-md">
                    Fecha por definir
                  </span>
                )}
              </div>

              <div className="mt-2 space-y-1">
                <h1 className="text-2xl font-black text-white drop-shadow-lg leading-tight uppercase px-2">
                  {paseo.name}
                </h1>
                <p className="text-white/90 font-bold flex items-center justify-center gap-1 text-sm drop-shadow-sm">
                  📍 {paseo.location || paseo.ubicacion || "Destino sorpresa"}
                </p>
              </div>
            </div>

            <div className="absolute bottom-6 flex items-center justify-center gap-1.5 opacity-90 mix-blend-overlay">
              <span className="text-sm">🌴</span>
              <span className="text-white font-bold tracking-widest text-[10px] uppercase">PaseoYa App</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 bg-white">
          <button
            onClick={handleShare}
            disabled={isCapturing}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {isCapturing ? (
              <span className="animate-pulse flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                Generando imagen...
              </span>
            ) : (
              <>
                <Share size={20} />
                Compartir en Historias
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
