import React, { useRef, useState, useEffect } from 'react';
import { Share, X } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function CountdownShareModal({ paseo, winnerDate, onClose }) {
  const [isCapturing, setIsCapturing] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  
  const cardRef = useRef(null);

  const calculateDaysLeft = () => {
    if (!winnerDate?.startDate) return null;
    const diff = new Date(winnerDate.startDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  
  const daysLeft = calculateDaysLeft();

  useEffect(() => {
    let isMounted = true;
    
    const generateImage = async () => {
      if (!cardRef.current) return;
      try {
        await new Promise(r => setTimeout(r, 800)); // Wait for fonts
        if (!isMounted) return;
        
        const canvas = await html2canvas(cardRef.current, {
          scale: window.devicePixelRatio > 1 ? 3 : 2,
          useCORS: true,
          backgroundColor: null,
          logging: false
        });

        const url = canvas.toDataURL('image/png');
        if (!isMounted) return;
        setImageUrl(url);
        setIsCapturing(false);
      } catch (error) {
        console.error("Error generating image:", error);
        if (isMounted) setIsCapturing(false);
      }
    };
    
    generateImage();
    return () => { isMounted = false; };
  }, []);

  const fallbackDownload = (url) => {
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = `paseoya-${paseo.name.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      alert("¡Imagen descargada! Revisa tu galería para compartirla.");
    } catch (e) {
      alert("Mantén presionada la imagen para guardarla y compartirla en tus historias.");
    }
  };

  const handleShare = async () => {
    if (!imageUrl) {
      alert("La imagen aún no está lista. Espera un momento.");
      return;
    }
    
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], 'paseoya-countdown.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file] });
        } catch (e) {
          if (e.name !== "AbortError") fallbackDownload(imageUrl);
        }
      } else {
        fallbackDownload(imageUrl);
      }
    } catch (e) {
      fallbackDownload(imageUrl);
    }
  };

  const gradientBg = `
    radial-gradient(circle at 0% 0%, #00d2ff 0%, transparent 60%),
    radial-gradient(circle at 100% 0%, #ff8a00 0%, transparent 60%),
    radial-gradient(circle at 0% 100%, #e100ff 0%, transparent 60%),
    radial-gradient(circle at 100% 100%, #00d2ff 0%, transparent 60%),
    #ff9a9e
  `;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl w-full max-w-sm flex flex-col animate-in fade-in zoom-in duration-300">
        
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <h3 className="font-extrabold text-slate-800">Tu Cuenta Regresiva</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex justify-center bg-slate-50 relative">
          
          {isCapturing && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-sm">
               <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4" />
               <p className="text-sm font-bold text-slate-600 animate-pulse">Generando imagen HD...</p>
            </div>
          )}

          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Cuenta regresiva" 
              className="w-full aspect-[4/5] rounded-3xl shadow-xl object-contain bg-white"
            />
          ) : (
            <div 
              ref={cardRef}
              className="relative overflow-hidden w-full aspect-[4/5] rounded-3xl shadow-xl flex flex-col items-center justify-between p-6 text-center"
              style={{ background: gradientBg }}
            >
              {/* Overlay suave para simular la luz del mockup */}
              <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>

              {/* Título Superior */}
              <h2 className="relative z-20 text-white font-extrabold tracking-wide text-xl drop-shadow-md mt-2 uppercase" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
                NOS VAMOS DE PASEO!
              </h2>

              {/* Glassmorphism Card Exacta al Mockup */}
              <div className="relative z-20 w-[95%] bg-white/30 border-[1.5px] border-white/60 rounded-[32px] pt-12 pb-6 px-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] flex flex-col items-center mt-2 mb-4">
                
                {/* Reflejo blanco del cristal superior (brillo) */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-[32px]" />

                <div className="relative z-30 flex flex-col items-center w-full">
                  {daysLeft !== null && daysLeft > 0 ? (
                    <>
                      <span 
                        className="block text-[130px] font-black text-white leading-[0.75] tracking-tighter"
                        style={{ textShadow: "0 8px 16px rgba(0,0,0,0.25)" }}
                      >
                        {daysLeft}
                      </span>
                      <span 
                        className="block text-[42px] font-extrabold text-white uppercase tracking-wider mt-4"
                        style={{ textShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
                      >
                        DÍAS
                      </span>
                    </>
                  ) : daysLeft === 0 ? (
                     <span 
                        className="block text-5xl font-black text-white uppercase tracking-wide py-10"
                        style={{ textShadow: "0 8px 16px rgba(0,0,0,0.25)" }}
                      >
                        ¡ES HOY!
                      </span>
                  ) : (
                    <span className="block text-2xl font-bold text-white drop-shadow-md py-10">
                      Por definir
                    </span>
                  )}
                </div>

                <div className="mt-8 space-y-1.5 w-full relative z-30">
                  <h1 className="text-xl font-bold text-white uppercase tracking-wide px-2" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                    {paseo.name}
                  </h1>
                  <p className="text-white/95 font-medium flex items-center justify-center gap-1 text-sm" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>
                    📍 {paseo.location || paseo.ubicacion || "Destino sorpresa"}
                  </p>
                </div>
              </div>

              {/* Logo Inferior */}
              <div className="relative z-20 flex items-center justify-center gap-2 drop-shadow-md mb-2">
                <span className="text-lg">🌴</span>
                <span className="text-white font-bold tracking-widest text-xs uppercase" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>PaseoYa App</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 bg-white border-t border-slate-50">
          <button
            onClick={handleShare}
            disabled={isCapturing}
            className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-lg shadow-slate-900/20"
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
            <p className="text-center text-xs text-slate-500 mt-4 px-2 font-medium">
              Si el botón falla, <span className="text-slate-800 font-bold">mantén presionada la imagen</span> arriba para guardarla.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
