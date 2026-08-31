import React, { useRef, useState, useEffect } from 'react';
import { Download, X, MessageCircle, Share2 } from 'lucide-react';

export default function CountdownShareModal({ paseo, winnerDate, onClose }) {
  const canvasRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isDrawing, setIsDrawing] = useState(true);
  const [shareMsg, setShareMsg] = useState('');

  const calculateDaysLeft = () => {
    if (!winnerDate?.startDate) return null;
    const diff = new Date(winnerDate.startDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysLeft = calculateDaysLeft();
  const pName   = paseo?.name || 'Nuestro Paseo';
  const pLoc    = paseo?.location || paseo?.ubicacion || 'Destino sorpresa';

  // ─── Helper: rounded rectangle path ─────────────────────────────────────────
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y,     x + w, y + r,     r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x,     y + h, x,       y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x,     y,     x + r,   y,         r);
    ctx.closePath();
  }

  // ─── Helper: multi-line text wrap ────────────────────────────────────────────
  function wrapText(ctx, text, maxW) {
    const words = text.split(' ');
    const lines = [];
    let cur = '';
    for (const w of words) {
      const test = cur ? cur + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; }
      else cur = test;
    }
    if (cur) lines.push(cur);
    return lines;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* ── Canvas 1080×1080 (formato cuadrado Instagram) ── */
    const W = 1080, H = 1080;
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    /* ── 1. FONDO degradado multicolor ── */
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0.00, '#00c6fb');
    bg.addColorStop(0.35, '#005bea');
    bg.addColorStop(0.65, '#f953c6');
    bg.addColorStop(1.00, '#ff6034');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* Bokeh (manchas de luz suaves) */
    const blob = (x, y, r, c) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, c); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    };
    blob(60,   60,  300, 'rgba(255,220,50,0.50)');
    blob(W-60, 80,  260, 'rgba(255,120,20,0.45)');
    blob(80,   H-80,220, 'rgba(200,0,220,0.45)');
    blob(W,    H,   320, 'rgba(0,200,255,0.40)');
    blob(W/2,  H/2, 200, 'rgba(255,255,255,0.10)');

    /* ── 2. TÍTULO SUPERIOR ── */
    ctx.textAlign   = 'center';
    ctx.fillStyle   = 'white';
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur  = 14;
    ctx.font        = 'bold 66px Arial';
    ctx.fillText('NOS VAMOS DE PASEO!', W / 2, 108);

    /* ── 3. TARJETA DE CRISTAL ── */
    const cX = 80, cY = 148, cW = W - 160, cH = 790, cR = 54;

    // sombra
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.28)';
    ctx.shadowBlur  = 50;
    ctx.shadowOffsetY = 14;
    ctx.fillStyle   = 'rgba(255,255,255,0.20)';
    roundRect(ctx, cX, cY, cW, cH, cR);
    ctx.fill();
    ctx.restore();

    // fondo cristal
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.20)';
    roundRect(ctx, cX, cY, cW, cH, cR);
    ctx.fill();
    ctx.restore();

    // borde blanco
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.65)';
    ctx.lineWidth   = 3;
    roundRect(ctx, cX, cY, cW, cH, cR);
    ctx.stroke();
    ctx.restore();

    // brillo superior (reflejo del cristal)
    ctx.save();
    const shine = ctx.createLinearGradient(0, cY, 0, cY + cH * 0.42);
    shine.addColorStop(0, 'rgba(255,255,255,0.38)');
    shine.addColorStop(1, 'rgba(255,255,255,0.00)');
    ctx.fillStyle = shine;
    roundRect(ctx, cX, cY, cW, cH, cR);
    ctx.fill();
    ctx.restore();

    /* ── 4. NÚMERO DE DÍAS ──
       Layout vertical dentro de la tarjeta (cY=148, cH=790, bottom=938)
       ─ número baseline   : 148 + 340 = 488   (font 240px → ascender ~200px → top ≈ 288 ✓)
       ─ "DÍAS" baseline   : 488 + 100 = 588   (font 90px  → bien separado)
       ─ nombre baseline   : 148+790-240 = 698 (font 52px)
       ─ ubicación baseline: 148+790-160 = 778 (font 40px)
       ─ logo baseline     : 148+790- 60 = 878 ... pero logo va fuera de tarjeta
    */
    ctx.textAlign   = 'center';
    ctx.fillStyle   = 'white';
    ctx.shadowColor = 'rgba(0,0,0,0.30)';
    ctx.shadowBlur  = 24;

    if (daysLeft !== null && daysLeft > 0) {
      // Número principal
      ctx.font = 'bold 240px Arial';
      ctx.fillText(String(daysLeft), W / 2, cY + 340);

      // "DÍAS"  — posicionado 110px debajo del baseline anterior
      ctx.shadowBlur = 14;
      ctx.font = 'bold 90px Arial';
      ctx.fillText('DIAS', W / 2, cY + 450);

    } else if (daysLeft === 0) {
      ctx.font = 'bold 110px Arial';
      ctx.fillText('iES HOY!', W / 2, cY + 390);
    } else {
      ctx.font = 'bold 65px Arial';
      ctx.fillText('Fecha por definir', W / 2, cY + 390);
    }

    /* ── 5. NOMBRE DEL PASEO ── */
    ctx.shadowBlur = 10;
    ctx.font       = 'bold 52px Arial';
    ctx.fillStyle  = 'white';
    const nameLines = wrapText(ctx, pName.toUpperCase(), cW - 80);
    const nameBaseY = cY + cH - 220;
    nameLines.forEach((line, i) => ctx.fillText(line, W / 2, nameBaseY + i * 62));

    /* ── 6. UBICACIÓN ── */
    ctx.shadowBlur = 6;
    ctx.font       = '38px Arial';
    ctx.fillStyle  = 'rgba(255,255,255,0.94)';
    ctx.fillText('\uD83D\uDCCD ' + pLoc, W / 2, cY + cH - 140);

    /* ── 7. LOGO FUERA DE TARJETA ── */
    ctx.shadowBlur = 0;
    ctx.font       = 'bold 36px Arial';
    ctx.fillStyle  = 'white';
    ctx.fillText('\uD83C\uDF34 PaseoYa App', W / 2, cY + cH + 60);

    /* ── Exportar ── */
    setImageUrl(canvas.toDataURL('image/png'));
    setIsDrawing(false);
  }, []);

  /* ── Descargar imagen ── */
  const handleDownload = async () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href     = imageUrl;
    a.download = `paseoya-${pName.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  };

  /* ── Compartir nativo (abre menú del SO: WhatsApp, IG, etc.) ── */
  const handleNativeShare = async () => {
    if (!imageUrl) return;
    try {
      const res  = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], 'paseoya-countdown.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] });
        return;
      }
    } catch (e) {
      if (e.name === 'AbortError') return; // usuario canceló
    }
    // Fallback: descargar
    await handleDownload();
    setShareMsg('Imagen guardada en tu galería. Ábrela desde WhatsApp o Instagram para compartirla. 📲');
  };

  /* ── WhatsApp: descarga primero, luego abre WhatsApp ── */
  const handleWhatsApp = async () => {
    await handleDownload();
    const txt = encodeURIComponent(
      `\uD83C\uDF34 \u00a1Nos vamos de paseo${pLoc !== 'Destino sorpresa' ? ' a ' + pLoc : ''}! Faltan ${daysLeft ?? '?'} d\u00edas para: ${pName} \uD83C\uDF89\n\nDescarga la imagen que te acaban de guardar y \u00e1djuntala aqu\u00ed.`
    );
    window.open(`https://wa.me/?text=${txt}`, '_blank');
    setShareMsg('La imagen se guard\u00f3 en tu galería. Adjúntala en el chat de WhatsApp que se acaba de abrir. 📎');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-3">
      <div className="bg-white rounded-[28px] overflow-hidden shadow-2xl w-full max-w-sm flex flex-col animate-in fade-in zoom-in duration-300">

        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <h3 className="font-extrabold text-slate-800">\u00a1Comparte tu Paseo!</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Canvas oculto */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Preview */}
        <div className="p-5 bg-slate-50 relative flex justify-center items-center min-h-[240px]">
          {isDrawing ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-sm font-bold text-slate-500 animate-pulse">Generando imagen...</p>
            </div>
          ) : (
            <img src={imageUrl} alt="Cuenta regresiva" className="w-full rounded-2xl shadow-lg" />
          )}
        </div>

        {/* Botones */}
        {!isDrawing && (
          <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-2.5">

            {/* Compartir menú nativo del SO (WhatsApp, IG, Facebook, etc.) */}
            <button
              onClick={handleNativeShare}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md shadow-orange-400/30"
            >
              <Share2 size={19} />
              Compartir imagen (WhatsApp / IG)
            </button>

            {/* WhatsApp + descarga */}
            <button
              onClick={handleWhatsApp}
              className="w-full py-3.5 bg-[#25D366] text-white rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={19} />
              Descargar + Abrir WhatsApp
            </button>

            {/* Solo descargar */}
            <button
              onClick={handleDownload}
              className="w-full py-3 bg-slate-100 text-slate-700 rounded-2xl font-semibold text-[14px] flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
            >
              <Download size={18} />
              Guardar imagen en galería
            </button>

            {shareMsg ? (
              <p className="text-center text-[12px] text-emerald-700 font-semibold bg-emerald-50 rounded-xl px-3 py-2">
                {shareMsg}
              </p>
            ) : (
              <p className="text-center text-[11px] text-slate-400 px-2">
                Guarda la imagen y súbela como historia en Instagram \uD83D\uDCF8
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
