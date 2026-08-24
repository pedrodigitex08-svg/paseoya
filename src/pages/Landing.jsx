import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Map,
  Calculator,
  Vote,
  Car,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Heart,
  Coffee,
  PlusCircle,
  Link2,
  Ticket,
  Receipt,
  ListChecks,
  ChevronRight,
  ThumbsUp,
  MessageCircle,
  Share2,
  Users
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-teal-200 selection:text-teal-900 overflow-x-hidden">
      <CustomAnimations />

      {/* 🌟 NAVBAR ULTRA PREMIUM */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl z-50 border-b border-slate-200/50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Map size={18} className="text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              PaseoYa
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="text-sm font-semibold text-slate-500 hover:text-slate-900 hidden md:block transition-colors">
              Cómo Funciona
            </a>
            <Link
              to="/crear"
              className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all hover:shadow-xl hover:shadow-slate-900/20 active:scale-95 flex items-center gap-2"
            >
              Empezar Gratis <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* 🚀 HERO SECTION (APPLE STYLE) */}
      <section className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-b from-teal-100/50 to-transparent blur-3xl -z-10 rounded-full" />
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
              <Sparkles size={14} className="text-amber-500" /> La revolución de organizar parches
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold text-slate-900 tracking-tighter leading-[1.1]">
              El fin de los <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-500 animate-gradient-x">
                paseos caóticos.
              </span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-100 font-medium">
            Reúne a tus amigos, decide la fecha, cuadra la logística y divide los gastos exactos. Todo en un solo enlace mágico. Sin descargar nada.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-fade-in-up animation-delay-200">
            <Link
              to="/crear"
              className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-extrabold text-lg transition-all shadow-2xl shadow-slate-900/20 active:scale-95"
            >
              Crear mi primer paseo
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* HERO APP PREVIEW */}
        <div className="mt-20 max-w-5xl mx-auto relative animate-fade-in-up animation-delay-300">
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-transparent z-10 top-1/2" />
          <div className="rounded-[2.5rem] p-4 bg-white/40 backdrop-blur-2xl border border-white shadow-2xl shadow-slate-200/50">
            <div className="rounded-[2rem] overflow-hidden border border-slate-200 bg-slate-100 aspect-video relative flex items-center justify-center">
              {/* Fake UI Dashboard */}
              <div className="absolute inset-0 bg-white">
                {/* Header */}
                <div className="h-20 bg-gradient-to-r from-teal-500 to-indigo-600 px-8 flex items-end pb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 mr-4" />
                  <div className="space-y-2 pb-1">
                    <div className="h-4 w-48 bg-white/30 rounded-full" />
                    <div className="h-3 w-32 bg-white/20 rounded-full" />
                  </div>
                </div>
                {/* Content */}
                <div className="p-8 grid grid-cols-3 gap-8">
                  <div className="col-span-2 space-y-6">
                    <div className="h-32 rounded-2xl bg-slate-50 border border-slate-100 flex items-center p-6 gap-6">
                       <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                         <Calculator className="text-orange-500" size={28} />
                       </div>
                       <div className="space-y-3 flex-1">
                         <div className="h-4 w-1/3 bg-slate-200 rounded-full" />
                         <div className="h-3 w-2/3 bg-slate-100 rounded-full" />
                         <div className="h-3 w-1/2 bg-slate-100 rounded-full" />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="h-40 rounded-2xl bg-slate-50 border border-slate-100 p-6 flex flex-col justify-between">
                        <Vote className="text-indigo-400" size={24} />
                        <div className="space-y-2">
                          <div className="h-2 w-full bg-indigo-100 rounded-full overflow-hidden">
                            <div className="h-full w-[70%] bg-indigo-500 rounded-full" />
                          </div>
                          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full w-[30%] bg-slate-400 rounded-full" />
                          </div>
                        </div>
                      </div>
                      <div className="h-40 rounded-2xl bg-slate-50 border border-slate-100 p-6 flex flex-col justify-between">
                         <Car className="text-teal-400" size={24} />
                         <div className="flex -space-x-2">
                           <div className="w-8 h-8 rounded-full border-2 border-white bg-teal-200" />
                           <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-200" />
                           <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-200" />
                         </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 border-l border-slate-100 pl-8 space-y-4">
                     <div className="h-4 w-24 bg-slate-200 rounded-full mb-6" />
                     {[1,2,3,4,5].map(i => (
                       <div key={i} className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-100" />
                         <div className="h-3 w-20 bg-slate-100 rounded-full" />
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🗺️ THE JOURNEY (HOW IT WORKS WITH MOCKUPS) */}
      <section id="how-it-works" className="py-32 bg-white relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Diseñada para que organizar <br className="hidden md:block" /> sea tan bueno como el viaje.
            </h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto">
              Seis pasos visuales. Sin descargar nada. Todo ocurre en la web y en WhatsApp.
            </p>
          </div>

          <div className="space-y-32">
            
            {/* FEATURE 1: Link Magico */}
            <FeatureBlock 
              align="right"
              badge="Compartir"
              badgeColor="text-emerald-600 bg-emerald-100"
              title="El Link Mágico"
              desc="Nada de pedir correos o forzar a tus amigos a descargar una app. PaseoYa te genera un enlace único. Lo copias, lo pegas en el grupo de WhatsApp y listo."
              visual={<WhatsAppMockup />}
            />

            {/* FEATURE 2: RSVP */}
            <FeatureBlock 
              align="left"
              badge="Invitación"
              badgeColor="text-purple-600 bg-purple-100"
              title="Invitaciones Premium"
              desc="Tus amigos abren el link y ven una tarjeta elegante. Confirman su asistencia con un toque y aparecen instantáneamente en tu panel de control."
              visual={<RSVPMockup />}
            />

            {/* FEATURE 3: Votación */}
            <FeatureBlock 
              align="right"
              badge="Democracia"
              badgeColor="text-orange-600 bg-orange-100"
              title="Cero peleas en el chat"
              desc="¿Finca o playa? ¿Este fin de semana o el otro? Todos pueden proponer opciones y votar. El sistema elige al ganador automáticamente y te muestra quién votó por qué."
              visual={<VoteMockup />}
            />

            {/* FEATURE 4: La Vaca */}
            <FeatureBlock 
              align="left"
              badge="Finanzas"
              badgeColor="text-rose-600 bg-rose-100"
              title="La Vaca Perfecta"
              desc="El terror de todo organizador solucionado. La app suma el alquiler, el transporte y el mercado, lo divide exactamente por los confirmados y te bota un 'recibo' claro y sin errores."
              visual={<VacaMockup />}
            />

          </div>
        </div>
      </section>

      {/* 🏁 CTA FOOTER (STRIPE STYLE) */}
      <section className="relative py-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-bl from-teal-500/30 to-indigo-500/0 blur-3xl rounded-full" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tighter">
            Lleva tu parche a <br className="hidden md:block" /> las grandes ligas.
          </h2>
          <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto font-medium">
            PaseoYa es 100% gratuita. Atrévete a organizar el próximo viaje familiar o de amigos en un minuto y deja a todos con la boca abierta.
          </p>
          <Link
            to="/crear"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-full font-extrabold text-xl transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            Crear Paseo Ahora <Sparkles size={24} className="text-amber-500" />
          </Link>
        </div>
      </section>
      
      {/* FOOTER */}
      <footer className="bg-slate-950 py-12 border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-semibold text-slate-500">
          <div className="flex items-center gap-2 text-slate-300">
            <Map size={18} /> PaseoYa © {new Date().getFullYear()}
          </div>
          <div className="flex items-center gap-2">
            Hecho con <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" /> en Colombia para el mundo
          </div>
        </div>
      </footer>
    </div>
  );
}

// ----------------------------------------------------------------------
// COMPONENTS
// ----------------------------------------------------------------------

function FeatureBlock({ align, badge, badgeColor, title, desc, visual }) {
  const isRight = align === "right";
  
  return (
    <div className={`flex flex-col ${isRight ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24`}>
      <div className="flex-1 space-y-6">
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${badgeColor}`}>
          {badge}
        </div>
        <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {title}
        </h3>
        <p className="text-lg text-slate-500 leading-relaxed font-medium">
          {desc}
        </p>
      </div>
      <div className="flex-1 w-full max-w-md perspective-1000">
        {visual}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// ANIMATED MOCKUPS (PURE CSS & REACT)
// ----------------------------------------------------------------------

function WhatsAppMockup() {
  return (
    <div className="rounded-[2.5rem] bg-slate-50 p-3 shadow-2xl border-4 border-slate-200 transform rotate-2 hover:rotate-0 transition-transform duration-500">
      <div className="bg-[#EFEAE2] rounded-[2rem] h-[400px] overflow-hidden flex flex-col relative">
        <div className="bg-[#075E54] text-white p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
             <Users size={16} />
          </div>
          <p className="font-bold">El Mejor Parche 🌴</p>
        </div>
        <div className="p-4 flex-1 flex flex-col gap-4 justify-end relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20" />
          
          <div className="self-end bg-[#DCF8C6] p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] relative animate-pop-in">
            <p className="text-sm text-slate-800 mb-1">
              ¡Muchachos! Ya armé el paseo a la finca. Entren aquí, confirmen asistencia y voten la fecha 👇
            </p>
            <div className="bg-[#128C7E]/10 rounded-xl p-2 border-l-4 border-[#128C7E] mt-2 flex items-center gap-2">
              <Map size={16} className="text-[#128C7E]" />
              <p className="text-xs font-bold text-[#128C7E] truncate">paseoya.com/el-mejor-parche</p>
            </div>
            <p className="text-[10px] text-slate-400 text-right mt-1">10:42 AM ✓✓</p>
          </div>
          
          <div className="self-start bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] relative animate-pop-in animation-delay-500">
            <p className="text-sm text-slate-800">
              Ufff tremendo, ya mismo entro y confirmo 🔥
            </p>
            <p className="text-[10px] text-slate-400 text-right mt-1">10:43 AM</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RSVPMockup() {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 p-8 shadow-2xl shadow-purple-500/20 transform -rotate-2 hover:rotate-0 transition-transform duration-500 text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
      <div className="relative z-10 bg-white p-6 rounded-2xl shadow-xl">
        <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <Ticket className="text-purple-600" size={32} />
        </div>
        <h4 className="text-xl font-extrabold text-slate-800">Paseo de Fin de Semestre</h4>
        <p className="text-slate-500 text-sm mt-2 mb-6">Estás invitado por Carlos.</p>
        
        <div className="space-y-3">
          <div className="h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 text-slate-400 text-sm">
            Escribe tu nombre...
          </div>
          <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg relative overflow-hidden group">
            <span className="relative z-10">¡Sí, confirmo asistencia! 🎉</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}

function VoteMockup() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 transform rotate-1 hover:rotate-0 transition-transform duration-500">
      <h4 className="font-extrabold text-slate-800 flex items-center gap-2 mb-4">
        <Vote className="text-orange-500" size={20} /> Votación de Fechas
      </h4>
      <div className="space-y-4">
        <div className="p-4 rounded-2xl border-2 border-amber-400 bg-amber-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-400 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl">
            Ganando
          </div>
          <p className="font-bold text-slate-800 text-sm mb-3">15 Oct - 18 Oct</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1 text-green-600"><CheckCircle2 size={12}/> Sí (80%)</span>
              <span>8 votos</span>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full animate-grow-width w-[80%]" />
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
          <p className="font-bold text-slate-800 text-sm mb-3">22 Oct - 25 Oct</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1 text-green-600"><CheckCircle2 size={12}/> Sí (20%)</span>
              <span>2 votos</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 rounded-full animate-grow-width w-[20%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VacaMockup() {
  return (
    <div className="rounded-3xl bg-white shadow-2xl border border-slate-100 transform -rotate-1 hover:rotate-0 transition-transform duration-500 flex flex-col overflow-hidden relative">
      <div className="h-2 w-full bg-rose-500" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-dashed border-slate-200">
          <div className="flex items-center gap-2">
            <Receipt size={20} className="text-slate-400" />
            <p className="text-xs font-extrabold text-slate-700 uppercase tracking-widest">Factura Desglose</p>
          </div>
          <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-mono text-slate-500">HOY</span>
        </div>
        
        <div className="space-y-4 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">🏡 Finca & Base</span>
            <span className="font-bold text-slate-800">$ 65.000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">🍖 Mercado (12 pers)</span>
            <span className="font-bold text-slate-800">$ 25.000</span>
          </div>
          <div className="flex justify-between text-teal-600">
            <span className="font-bold">🚌 Transporte (Van)</span>
            <span className="font-bold">+$ 15.000</span>
          </div>
          
          <div className="pt-4 mt-2 border-t-2 border-dashed border-slate-200 flex justify-between items-center">
            <span className="font-extrabold text-xs uppercase tracking-widest text-slate-400">Total a Pagar</span>
            <span className="text-2xl font-extrabold text-orange-500 animate-pulse-slow">$ 105.000</span>
          </div>
        </div>
        
        <div className="mt-6 bg-green-100 text-green-700 p-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold">
          <CheckCircle2 size={16} /> Cuota pagada. ¡Gracias!
        </div>
      </div>
      
      {/* Decorative receipt bottom */}
      <div className="h-3 w-full" style={{
        backgroundImage: "radial-gradient(circle, transparent, transparent 4px, #ffffff 4px, #ffffff 10px, transparent 10px)",
        backgroundSize: "20px 10px",
        backgroundPosition: "bottom",
        backgroundRepeat: "repeat-x",
        marginTop: "-1px"
      }} />
    </div>
  );
}

// ----------------------------------------------------------------------
// CSS ANIMATIONS INJECTOR
// ----------------------------------------------------------------------

function CustomAnimations() {
  return (
    <style dangerouslySetInnerHTML={{__html: `
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pop-in {
        0% { opacity: 0; transform: scale(0.9) translateY(10px); }
        70% { transform: scale(1.02); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes grow-width {
        from { width: 0; }
      }
      @keyframes pulse-slow {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      .animate-fade-in-up {
        animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
      }
      .animate-pop-in {
        animation: pop-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
      }
      .animate-grow-width {
        animation: grow-width 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      .animate-pulse-slow {
        animation: pulse-slow 3s ease-in-out infinite;
      }
      .animation-delay-100 { animation-delay: 100ms; }
      .animation-delay-200 { animation-delay: 200ms; }
      .animation-delay-300 { animation-delay: 300ms; }
      .animation-delay-500 { animation-delay: 500ms; }
      
      html {
        scroll-behavior: smooth;
      }
      
      .perspective-1000 {
        perspective: 1000px;
      }
    `}} />
  );
}
