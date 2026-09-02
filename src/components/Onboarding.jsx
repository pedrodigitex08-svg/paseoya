import React, { useState } from 'react';
import { ChevronRight, Link2, MapPin, CheckSquare, Coins } from 'lucide-react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: "¡Bienvenido a PaseoYa!",
      desc: "Organiza paseos épicos con tus amigos en 3 simples pasos.",
      visual: <div className="text-[100px] animate-bounce" style={{animationDuration: '2s'}}>👋</div>
    },
    {
      title: "Comparte el Link",
      desc: "Envía el link por WhatsApp y tus amigos confirman al instante. Sin descargas.",
      visual: (
        <div className="bg-[#DCF8C6] p-6 rounded-3xl relative shadow-lg transform -rotate-3 border-2 border-[#128C7E]/20">
          <Link2 size={64} className="text-[#128C7E] mb-4 mx-auto" />
          <div className="bg-white p-3 rounded-2xl shadow-sm text-sm font-bold text-slate-700">
            paseoya.com/mi-paseo
          </div>
          {/* WhatsApp tail */}
          <div className="absolute -bottom-3 -right-2 w-6 h-6 bg-[#DCF8C6] transform rotate-45 rounded-sm border-r-2 border-b-2 border-[#128C7E]/20"></div>
        </div>
      )
    },
    {
      title: "Voten juntos",
      desc: "Tus amigos votan por el mejor destino, las fechas ideales y el mercado.",
      visual: (
        <div className="space-y-4 w-full max-w-[240px] mx-auto">
          <div className="bg-slate-800 h-14 rounded-2xl relative overflow-hidden flex items-center px-4 border border-slate-700 shadow-lg">
            <div className="absolute left-0 top-0 bottom-0 bg-blue-500 w-[75%] opacity-40"></div>
            <MapPin size={20} className="text-blue-400 mr-3 z-10" />
            <span className="text-base font-bold text-white z-10">Finca (75%)</span>
          </div>
          <div className="bg-slate-800 h-14 rounded-2xl relative overflow-hidden flex items-center px-4 border border-slate-700 shadow-lg">
            <div className="absolute left-0 top-0 bottom-0 bg-orange-500 w-[25%] opacity-40"></div>
            <MapPin size={20} className="text-orange-400 mr-3 z-10" />
            <span className="text-base font-bold text-white z-10">Playa (25%)</span>
          </div>
        </div>
      )
    },
    {
      title: "¡Todo listo, Anfitrión!",
      desc: "Controla La Vaca, la cuenta regresiva y el checklist desde tu panel.",
      visual: (
        <div className="grid grid-cols-2 gap-5 w-full max-w-[260px] mx-auto">
          <div className="bg-amber-500/20 aspect-square rounded-3xl flex flex-col items-center justify-center text-amber-400 border-2 border-amber-500/30 shadow-[0_0_30px_rgba(251,191,36,0.15)]">
            <Coins size={40} />
            <span className="text-sm font-black mt-3 uppercase tracking-wider">La Vaca</span>
          </div>
          <div className="bg-indigo-500/20 aspect-square rounded-3xl flex flex-col items-center justify-center text-indigo-400 border-2 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
            <CheckSquare size={40} />
            <span className="text-sm font-black mt-3 uppercase tracking-wider">Maletas</span>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('hasSeenOnboarding', 'true');
      onComplete();
    }
  };

  const slide = slides[step];

  return (
    <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col text-white animate-in fade-in duration-500">
      <button 
        onClick={() => {
          localStorage.setItem('hasSeenOnboarding', 'true');
          onComplete();
        }}
        className="absolute top-8 right-6 text-slate-400 text-sm font-bold hover:text-white transition-colors"
      >
        Saltar
      </button>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center pt-20">
        <div className="mb-12 h-48 flex items-center justify-center w-full animate-in slide-in-from-bottom-4 fade-in duration-500" key={`visual-${step}`}>
          {slide.visual}
        </div>
        
        <div className="animate-in slide-in-from-bottom-2 fade-in duration-500 delay-150 fill-mode-both" key={`text-${step}`}>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">{slide.title}</h2>
          <p className="text-slate-400 text-lg max-w-xs mx-auto leading-relaxed font-medium">
            {slide.desc}
          </p>
        </div>
      </div>

      <div className="p-8 pb-12 flex flex-col items-center">
        <div className="flex gap-2.5 mb-10">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2.5 rounded-full transition-all duration-500 ${idx === step ? 'w-10 bg-orange-500' : 'w-2.5 bg-slate-800'}`}
            />
          ))}
        </div>
        
        <button 
          onClick={handleNext}
          className="w-full max-w-md bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xl py-5 rounded-full shadow-[0_0_40px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          {step === slides.length - 1 ? '¡Crear mi primer paseo!' : 'Siguiente'}
          {step < slides.length - 1 && <ChevronRight size={24} />}
        </button>
      </div>
    </div>
  );
}
