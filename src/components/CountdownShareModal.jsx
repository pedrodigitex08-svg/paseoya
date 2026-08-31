import React, { useRef, useState, useEffect } from 'react';
import { Download, X, MessageCircle, ImageDown } from 'lucide-react';

export default function CountdownShareModal({ paseo, winnerDate, onClose }) {
  const canvasRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isDrawing, setIsDrawing] = useState(true);

  const calculateDaysLeft = () => {
    if (!winnerDate?.startDate) return null;
    const diff = new Date(winnerDate.startDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysLeft = calculateDaysLeft();
  const pName = paseo?.name || 'Nuestro Paseo';
  const pLocation = paseo?.location || paseo?.ubicacion || 'Destino sorpresa';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Dimensiones del canvas (proporción cuadrada estilo Instagram)
    const W = 1080;
    const H = 1080;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // ─── 1. FONDO MULTICOLOR (como el boceto) ───────────────────────────────
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0.0,  '#00c6fb'); // cyan arriba-izquierda
    bg.addColorStop(0.35, '#005bea'); // azul
    bg.addColorStop(0.65, '#f953c6'); // rosa
    bg.addColorStop(1.0,  '#ff6034'); // naranja abajo-derecha
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Manchas de luz bokeh
    const drawBlob = (x, y, r, color) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };
    drawBlob(100,  80,  280, 'rgba(255,200,50,0.45)');
    drawBlob(W - 80, 60, 240, 'rgba(255,120,20,0.40)');
    drawBlob(80,  H - 80, 200, 'rgba(200,0,220,0.45)');
    drawBlob(W,  H,        300, 'rgba(0,200,255,0.40)');
    drawBlob(W/2, H/2,    180, 'rgba(255,255,255,0.12)');

    // ─── 2. TEXTO SUPERIOR ─────────────────────────────────────────────────
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.font = 'bold 64px Arial, sans-serif';
    ctx.fillText('NOS VAMOS DE PASEO!', W / 2, 110);

    // ─── 3. TARJETA GLASSMORPHISM ──────────────────────────────────────────
    const cardX = 80;
    const cardY = 155;
    const cardW = W - 160;
    const cardH = 700;
    const radius = 54;

    // Sombra de la tarjeta
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    roundRect(ctx, cardX, cardY, cardW, cardH, radius);
    ctx.fill();
    ctx.restore();

    // Borde blanco glassmorphism
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 3;
    roundRect(ctx, cardX, cardY, cardW, cardH, radius);
    ctx.stroke();
    ctx.restore();

    // Brillo superior de la tarjeta (reflejo del cristal)
    ctx.save();
    const shineGrad = ctx.createLinearGradient(0, cardY, 0, cardY + cardH * 0.45);
    shineGrad.addColorStop(0, 'rgba(255,255,255,0.35)');
    shineGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = shineGrad;
    roundRect(ctx, cardX, cardY, cardW, cardH * 0.45, radius, true);
    ctx.fill();
    ctx.restore();

    // ─── 4. DÍAS (número grande) ───────────────────────────────────────────
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 20;

    if (daysLeft !== null && daysLeft > 0) {
      // Número
      ctx.font = 'bold 340px Arial, sans-serif';
      ctx.fillText(String(daysLeft), W / 2, cardY + 410);
      // DÍAS
      ctx.shadowBlur = 12;
      ctx.font = 'bold 100px Arial, sans-serif';
      ctx.letterSpacing = '12px';
      ctx.fillText('DÍAS', W / 2, cardY + 530);
    } else if (daysLeft === 0) {
      ctx.font = 'bold 120px Arial, sans-serif';
      ctx.fillText('¡ES HOY!', W / 2, cardY + 440);
    } else {
      ctx.font = 'bold 70px Arial, sans-serif';
      ctx.fillText('Fecha por definir', W / 2, cardY + 440);
    }

    // ─── 5. NOMBRE DEL PASEO ───────────────────────────────────────────────
    ctx.shadowBlur = 8;
    ctx.font = 'bold 54px Arial, sans-serif';
    ctx.fillStyle = 'white';
    const nameY = cardY + cardH - 180;
    // Ajuste si el nombre es largo
    const lines = wrapText(ctx, pName.toUpperCase(), cardW - 60);
    lines.forEach((line, i) => ctx.fillText(line, W / 2, nameY + i * 65));

    // ─── 6. UBICACIÓN ──────────────────────────────────────────────────────
    ctx.font = '40px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.shadowBlur = 4;
    ctx.fillText('📍 ' + pLocation, W / 2, cardY + cardH - 85);

    // ─── 7. LOGO INFERIOR ──────────────────────────────────────────────────
    ctx.shadowBlur = 0;
    ctx.font = 'bold 38px Arial, sans-serif';
    ctx.fillStyle = 'white';
    ctx.fillText('🌴 PaseoYa App', W / 2, H - 42);

    // ─── Exportar ──────────────────────────────────────────────────────────
    const url = canvas.toDataURL('image/png');
    setImageUrl(url);
    setIsDrawing(false);
  }, []);

  // ─── HELPERS ────────────────────────────────────────────────────────────────
  function roundRect(ctx, x, y, w, h, r, topOnly = false) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    if (topOnly) {
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
    } else {
      ctx.lineTo(x + w, y + h - r);
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h);
      ctx.arcTo(x, y + h, x, y + h - r, r);
    }
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function wrapText(ctx, text, maxW) {
    const words = text.split(' ');
    const lines = [];
    let current = '';
    for (const word of words) {
      const test = current ? current + ' ' + word : word;
      if (ctx.measureText(test).width > maxW && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  // ─── ACCIONES ────────────────────────────────────────────────────────────────
  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `paseoya-${pName.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareNative = async () => {
    if (!imageUrl) return;
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    const file = new File([blob], 'paseoya-countdown.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
      } catch (e) {
        if (e.name !== 'AbortError') handleDownload();
      }
    } else {
      handleDownload();
    }
  };

  const handleWhatsApp = () => {
    const msg = `🌴 ¡Nos vamos de paseo a ${pLocation}! Faltan ${daysLeft ?? '?'} días para ${pName}. ¡Descarga PaseoYa y únete! 🎉`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl w-full max-w-sm flex flex-col animate-in fade-in zoom-in duration-300">

        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <h3 className="font-extrabold text-slate-800">¡Comparte tu Paseo!</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Canvas oculto (para dibujar) */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Preview */}
        <div className="p-6 bg-slate-50 relative flex justify-center items-center min-h-[260px]">
          {isDrawing ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-sm font-bold text-slate-500 animate-pulse">Generando imagen...</p>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt="Cuenta regresiva"
              className="w-full rounded-3xl shadow-xl"
            />
          )}
        </div>

        {/* Botones de acción */}
        {!isDrawing && (
          <div className="p-5 bg-white border-t border-slate-100 flex flex-col gap-3">

            {/* Botón principal: Compartir nativo (abre WhatsApp/IG/etc en móvil) */}
            <button
              onClick={handleShareNative}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-orange-400/30"
            >
              <ImageDown size={20} />
              Guardar y Compartir Imagen
            </button>

            {/* WhatsApp directo */}
            <button
              onClick={handleWhatsApp}
              className="w-full py-3.5 bg-[#25D366] text-white rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={20} />
              Compartir por WhatsApp
            </button>

            {/* Descargar para compartir en IG/Facebook */}
            <button
              onClick={handleDownload}
              className="w-full py-3.5 bg-slate-100 text-slate-700 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
            >
              <Download size={20} />
              Descargar para IG / Facebook
            </button>

            <p className="text-center text-[11px] text-slate-400 px-2">
              Descarga la imagen y súbela como historia en Instagram o Facebook 📸
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
