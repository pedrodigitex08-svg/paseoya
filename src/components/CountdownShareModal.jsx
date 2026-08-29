import React, { useRef, useState, useEffect } from 'react';
import { Share, X, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function CountdownShareModal({ paseo, winnerDate, onClose }) {
  const [isCapturing, setIsCapturing] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  
  const cardRef = useRef(null);

  const calculateDaysLeft = () => {
    if (!winnerDate?.startDate) return null;
    const diff = new Date(winnerDate.startDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  
  const daysLeft = calculateDaysLeft();

  // Generar la imagen automáticamente al abrir el modal para evitar bloqueos de Safari con navigator.share
  useEffect(() => {
    let isMounted = true;
    
    const generateImage = async () => {
      if (!cardRef.current) return;
      try {
        // Pequeña pausa para asegurar que las fuentes/estilos estén listos
        await new Promise(r => setTimeout(r, 800));
        
        if (!isMounted) return;
        
        const canvas = await html2canvas(cardRef.current, {
          scale: 3, // Alta resolución
          useCORS: true,
          backgroundColor: null,
          logging: false
        });

        const url = canvas.toDataURL('image/png');
        if (!isMounted) return;
        setImageUrl(url);
        
        canvas.toBlob((blob) => {
          if (!isMounted) return;
          setImageBlob(blob);
          setIsCapturing(false);
        }, 'image/png');
        
      } catch (error) {
        console.error("Error generando imagen:", error);
        if (isMounted) setIsCapturing(false);
      }
    };
    
    generateImage();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleShare = async () => {
    if (!imageBlob) return;
    
    const file = new File([imageBlob], 'paseoya-countdown.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file]
        });
      } catch (e) {
        console.log('Error sharing:', e);
      }
    } else {
      // Fallback: Descargar
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = `paseoya-${paseo.name.replace(/\s+/g, '-')}-countdown.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const getBackgroundColors = () => {
    const cat = paseo?.category || paseo?.categoria;
    if (cat === "playa") return { bg: "from-[#00c6ff] to-[#0072ff]", accent1: "bg-yellow-300/40", accent2: "bg-pink-400/30" };
    if (cat === "finca" || cat === "montana") return { bg: "from-[#11998e] to-[#38ef7d]", accent1: "bg-yellow-200/40", accent2: "bg-emerald-200/30" };
    if (cat === "rumba") return { bg: "from-[#8E2DE2] to-[#4A00E0]", accent1: "bg-pink-500/40", accent2: "bg-cyan-400/30" };
    // Default tropical (parecido al mockup)
    return { bg: "from-[#f2709c] to-[#ff9472]", accent1: "bg-yellow-300/40", accent2: "bg-cyan-300/30" };
  };

  const colors = getBackgroundColors();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl w-full max-w-sm flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <h3 className="font-extrabold text-slate-800">Tu Cuenta Regresiva</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Preview Area - Aspect Ratio 9:16 for stories */}
        <div className="p-6 flex justify-center bg-slate-50 relative">
          
          {/* Muestra un spinner mientras se genera la imagen real */}
          {isCapturing && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm rounded-t-3xl">
               <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4" />
               <p className="text-sm font-bold text-slate-600 animate-pulse">Preparando imagen...</p>
            </div>
          )}

          {/* Si la imagen ya se generó, mostramos la imagen real. Si no, mostramos el HTML oculto para que html2canvas lo lea */}
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Cuenta regresiva" 
              className="w-full aspect-[9/16] rounded-3xl shadow-xl object-cover bg-slate-100"
            />
          ) : (
            <div 
              ref={cardRef}
              className={`relative overflow-hidden w-full aspect-[9/16] rounded-3xl bg-gradient-to-br ${colors.bg} shadow-xl flex flex-col items-center justify-center p-6 text-center`}
            >
              {/* Efecto Bokeh / Luces */}
              <div className={`absolute -top-10 -left-10 w-48 h-48 ${colors.accent1} blur-3xl rounded-full`} />
              <div className={`absolute bottom-10 -right-10 w-56 h-56 ${colors.accent2} blur-3xl rounded-full`} />
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/20 blur-3xl rounded-full transform -translate-x-1/2 -translate-y-1/2" />

              <div className="relative z-10 w-full flex flex-col items-center h-full pt-8 pb-4">
                <h2 className="text-white font-bold tracking-wide text-lg drop-shadow-md mb-auto uppercase">
                  NOS VAMOS DE PASEO!
                </h2>

                {/* Glassmorphism Card (Estilo Mockup) */}
                <div className="w-full bg-white/20 backdrop-blur-md border-[1.5px] border-white/50 rounded-[32px] py-10 px-4 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] flex flex-col items-center relative overflow-hidden">
                  
                  {/* Reflejo superior del cristal */}
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent" />

                  {daysLeft !== null && daysLeft > 0 ? (
                    <>
                      <span className="block text-[110px] font-black text-white drop-shadow-xl leading-[0.85] tracking-tighter">
                        {daysLeft}
                      </span>
                      <span className="block text-4xl font-extrabold text-white mt-1 uppercase tracking-widest drop-shadow-lg">
                        DÍAS
                      </span>
                    </>
                  ) : daysLeft === 0 ? (
                     <span className="block text-5xl font-black text-white drop-shadow-xl uppercase tracking-wide">
                        ¡ES HOY!
                      </span>
                  ) : (
                    <span className="block text-2xl font-bold text-white drop-shadow-md">
                      Por definir
                    </span>
                  )}

                  <div className="mt-8 space-y-1.5 w-full relative z-10">
                    <h1 className="text-xl font-bold text-white drop-shadow-md leading-tight uppercase px-2">
                      {paseo.name}
                    </h1>
                    <p className="text-white/90 font-medium flex items-center justify-center gap-1 text-sm drop-shadow-sm">
                      📍 {paseo.location || paseo.ubicacion || "Destino sorpresa"}
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-center gap-2 opacity-90 drop-shadow-md">
                  <span className="text-lg">🌴</span>
                  <span className="text-white font-bold tracking-widest text-[11px] uppercase">PaseoYa App</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="p-6 bg-white border-t border-slate-50">
          <button
            onClick={handleShare}
            disabled={isCapturing}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-orange-500/30"
          >
            {isCapturing ? (
              <span className="animate-pulse">Cargando...</span>
            ) : (
              <>
                <Share size={20} />
                Compartir (IG / WhatsApp)
              </>
            )}
          </button>
          
          {imageUrl && (
            <p className="text-center text-[11px] text-slate-400 mt-4 px-2">
              Si el botón no funciona, mantén presionada la imagen de arriba para guardarla o compartirla.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
