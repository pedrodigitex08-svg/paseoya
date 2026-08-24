import React from "react";
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
  Users,
  ShoppingCart,
  CheckSquare
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FFFBF7] font-sans selection:bg-orange-200 selection:text-orange-900 overflow-x-hidden">
      <CustomAnimations />

      {/* 🌟 NAVBAR ULTRA PREMIUM (ORANGE THEME) */}
      <nav className="fixed top-0 w-full bg-[#FFFBF7]/80 backdrop-blur-xl z-50 border-b border-orange-100/50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Map size={18} className="text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              PaseoYa
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="text-sm font-semibold text-slate-500 hover:text-orange-600 hidden md:block transition-colors">
              Cómo Funciona
            </a>
            <Link
              to="/crear"
              className="bg-orange-500 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-orange-600 transition-all hover:shadow-xl hover:shadow-orange-500/30 active:scale-95 flex items-center gap-2"
            >
              Empezar Gratis <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* 🚀 HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-b from-orange-200/40 to-transparent blur-3xl -z-10 rounded-full" />
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-200 text-orange-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
              <Sparkles size={14} className="text-orange-500" /> La revolución de organizar parches
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold text-slate-900 tracking-tighter leading-[1.1]">
              El fin de los <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 animate-gradient-x">
                paseos caóticos.
              </span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-100 font-medium">
            Reúne a tus amigos, decide la fecha, cuadra la logística y divide los gastos exactos. Todo en un solo enlace mágico y 100% gratuito.
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFFBF7] via-transparent to-transparent z-10 top-1/2" />
          <div className="rounded-[2.5rem] p-4 bg-white/40 backdrop-blur-2xl border border-white shadow-2xl shadow-orange-900/10">
            <div className="rounded-[2rem] overflow-hidden border border-slate-200 bg-slate-50 aspect-video relative flex items-center justify-center">
              {/* Fake UI Dashboard */}
              <div className="absolute inset-0 bg-white">
                {/* Header */}
                <div className="h-20 bg-gradient-to-r from-orange-500 to-amber-500 px-8 flex items-end pb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 mr-4" />
                  <div className="space-y-2 pb-1">
                    <div className="h-4 w-48 bg-white/30 rounded-full" />
                    <div className="h-3 w-32 bg-white/20 rounded-full" />
                  </div>
                </div>
                {/* Content */}
                <div className="p-8 grid grid-cols-3 gap-8">
                  <div className="col-span-2 space-y-6">
                    <div className="h-32 rounded-2xl bg-orange-50/50 border border-orange-100 flex items-center p-6 gap-6">
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
                      <div className="h-40 rounded-2xl bg-white border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
                        <Vote className="text-orange-400" size={24} />
                        <div className="space-y-2">
                          <div className="h-2 w-full bg-orange-100 rounded-full overflow-hidden">
                            <div className="h-full w-[70%] bg-orange-500 rounded-full" />
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full w-[30%] bg-slate-300 rounded-full" />
                          </div>
                        </div>
                      </div>
                      <div className="h-40 rounded-2xl bg-white border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
                         <Car className="text-amber-400" size={24} />
                         <div className="flex -space-x-2">
                           <div className="w-8 h-8 rounded-full border-2 border-white bg-amber-200" />
                           <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-200" />
                           <div className="w-8 h-8 rounded-full border-2 border-white bg-red-200" />
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
              Todo el poder de la app, <br className="hidden md:block" /> explicado en 5 pasos.
            </h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto">
              Descubre las herramientas exclusivas que hacen de PaseoYa la mejor opción. Funciona directo desde el navegador de tu celular.
            </p>
          </div>

          <div className="space-y-32">
            
            {/* FEATURE 1: Link Magico & Invitaciones */}
            <FeatureBlock 
              align="right"
              badge="Invitación & RSVP"
              badgeColor="text-orange-600 bg-orange-100"
              title="El Link Mágico"
              desc="Nada de pedir correos o descargar apps. Creas el paseo, copias el link y lo envías al grupo de WhatsApp. Tus amigos abren una tarjeta interactiva, confirman su asistencia con un toque y entran al parche de inmediato."
              visual={<RSVPMockup />}
            />

            {/* FEATURE 2: Votación */}
            <FeatureBlock 
              align="left"
              badge="Votaciones Democráticas"
              badgeColor="text-amber-600 bg-amber-100"
              title="Cero peleas en el chat"
              desc="¿Finca o playa? ¿Este puente o el otro? En la app, cualquier invitado puede proponer fechas y lugares. Todos votan con '👍' o 'No', y el sistema corona automáticamente la opción ganadora mostrándote exactamente quién votó por qué."
              visual={<VoteMockup />}
            />

            {/* FEATURE 3: Logística (NUEVO DETALLE) */}
            <FeatureBlock 
              align="right"
              badge="Logística & Menú"
              badgeColor="text-teal-600 bg-teal-100"
              title="Transporte y Mercado en Grupo"
              desc="¿Quién lleva carro? Coordina los vehículos, cuántos cupos libres quedan y divide el costo de la gasolina. Además, armen la lista del mercado de forma colaborativa para que nada se olvide (y todo se cobre)."
              visual={<LogisticaMockup />}
            />

            {/* FEATURE 4: La Vaca */}
            <FeatureBlock 
              align="left"
              badge="Finanzas Automáticas"
              badgeColor="text-rose-600 bg-rose-100"
              title="La Vaca Perfecta"
              desc="El terror de todo organizador, solucionado. La app suma automáticamente la cuota de la finca, los víveres del mercado y tu puesto en el carro (si aplica). Lo divide exactamente y te entrega una factura individual detallada al centavo."
              visual={<VacaMockup />}
            />

          </div>
        </div>
      </section>

      {/* 💬 SOCIAL PROOF (TESTIMONIALS) */}
      <section className="py-24 bg-orange-50 border-y border-orange-100">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-12">
          <h2 className="text-3xl font-extrabold text-slate-800">Diseñada para salvar amistades</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <Testimonial 
              quote="Por fin dejamos de pelearnos por quién compró el hielo y quién puso el carro. La Vaca automática es una salvación total."
              author="Carlos M."
              role="El que siempre organizaba"
            />
            <Testimonial 
              quote="Antes durábamos 3 semanas en el chat decidiendo la fecha. Ahora todos votan en la app y en 2 días ya tenemos todo listo."
              author="Laura Gómez"
              role="Usuaria feliz"
            />
            <Testimonial 
              quote="Me encantó ver ese 'recibo' al final diciendo exactamente por qué pagué 85 mil pesos. Súper transparente y justo."
              author="Andrés F."
              role="Invitado"
            />
          </div>
        </div>
      </section>

      {/* 🏁 CTA FOOTER */}
      <section className="relative py-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-bl from-orange-500/30 to-amber-500/0 blur-3xl rounded-full" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tighter">
            Lleva tu parche a <br className="hidden md:block" /> las grandes ligas.
          </h2>
          <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto font-medium">
            PaseoYa es 100% gratuita. Atrévete a organizar el próximo viaje familiar o de amigos en un minuto y deja a todos con la boca abierta.
          </p>
          <Link
            to="/crear"
            className="inline-flex items-center gap-3 px-10 py-5 bg-orange-500 text-white rounded-full font-extrabold text-xl transition-all hover:scale-105 hover:bg-orange-600 shadow-[0_0_40px_rgba(249,115,22,0.3)]"
          >
            Crear Paseo Ahora <Sparkles size={24} className="text-white" />
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
            Hecho con <Heart size={14} className="text-orange-500 fill-orange-500 animate-pulse" /> en Colombia para el mundo
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
        <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
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

function Testimonial({ quote, author, role }) {
  return (
    <div className="p-6 rounded-3xl bg-white border border-orange-100 shadow-sm space-y-4">
      <div className="flex gap-1 text-orange-400">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-slate-600 text-sm leading-relaxed italic">"{quote}"</p>
      <div>
        <p className="font-bold text-slate-900 text-sm">{author}</p>
        <p className="text-xs text-slate-400">{role}</p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// ANIMATED MOCKUPS (PURE CSS & REACT) - DETAILED EXPERIENCES
// ----------------------------------------------------------------------

function RSVPMockup() {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-orange-400 to-amber-500 p-6 shadow-2xl shadow-orange-500/20 transform -rotate-2 hover:rotate-0 transition-transform duration-500 text-center relative overflow-hidden h-[360px] flex items-center">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
      <div className="relative z-10 w-full bg-white p-6 rounded-2xl shadow-xl animate-float">
        <div className="w-14 h-14 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-3">
          <Ticket className="text-orange-500" size={28} />
        </div>
        <h4 className="text-lg font-extrabold text-slate-800">Paseo de Fin de Semestre</h4>
        <p className="text-slate-500 text-xs mt-1 mb-5">Estás invitado por Carlos.</p>
        
        <div className="space-y-3">
          <div className="h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 text-slate-400 text-sm shadow-inner">
            <span className="animate-typing border-r-2 border-slate-400 pr-1 overflow-hidden whitespace-nowrap">Laura Gómez</span>
          </div>
          <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg relative overflow-hidden group">
            <span className="relative z-10">¡Sí, confirmo asistencia! 🎉</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}

function VoteMockup() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 transform rotate-1 hover:rotate-0 transition-transform duration-500 h-[360px] flex flex-col justify-center">
      <h4 className="font-extrabold text-slate-800 flex items-center gap-2 mb-4">
        <Vote className="text-orange-500" size={20} /> Votación de Destinos
      </h4>
      <div className="space-y-4">
        {/* Lugar Ganador */}
        <div className="p-4 rounded-2xl border-2 border-amber-400 bg-amber-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-400 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl">
            Ganando
          </div>
          <p className="font-bold text-slate-800 text-sm mb-3">Finca en Melgar 🌴</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1 text-green-600">
                <ThumbsUp size={12}/> 8 Votos
              </span>
              <div className="flex -space-x-1">
                <div className="w-4 h-4 rounded-full bg-slate-300 border border-white" />
                <div className="w-4 h-4 rounded-full bg-slate-400 border border-white" />
                <div className="w-4 h-4 rounded-full bg-slate-500 border border-white" />
              </div>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full animate-grow-width w-[80%]" />
            </div>
          </div>
        </div>
        
        {/* Lugar Perdedor */}
        <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
          <p className="font-bold text-slate-800 text-sm mb-3">Cabaña en Guatapé ⛰️</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1 text-green-600">
                <ThumbsUp size={12}/> 2 Votos
              </span>
              <div className="flex -space-x-1">
                <div className="w-4 h-4 rounded-full bg-slate-300 border border-white" />
              </div>
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

function LogisticaMockup() {
  return (
    <div className="rounded-3xl bg-slate-50 p-6 shadow-2xl border border-slate-200 transform -rotate-1 hover:rotate-0 transition-transform duration-500 h-[360px] flex flex-col justify-center space-y-4">
      
      {/* Transporte */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 animate-slide-in">
        <div className="flex items-center gap-2 mb-3">
          <Car className="text-teal-500" size={18} />
          <p className="font-bold text-slate-800 text-sm">Transporte</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-700">Camioneta de Andrés</p>
            <p className="text-[10px] text-slate-400">Cupos: 3/5 llenos</p>
          </div>
          <div className="flex gap-1">
            <div className="w-6 h-6 rounded-md bg-teal-100 flex items-center justify-center text-[10px] font-bold text-teal-700">A</div>
            <div className="w-6 h-6 rounded-md bg-teal-100 flex items-center justify-center text-[10px] font-bold text-teal-700">M</div>
            <div className="w-6 h-6 rounded-md bg-teal-100 flex items-center justify-center text-[10px] font-bold text-teal-700">L</div>
            <div className="w-6 h-6 rounded-md bg-slate-100 border border-dashed border-slate-300 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Mercado */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 animate-slide-in animation-delay-200">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingCart className="text-orange-500" size={18} />
          <p className="font-bold text-slate-800 text-sm">Mercado Compartido</p>
        </div>
        <div className="space-y-2">
          {/* Item 1 - Checked */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare size={14} className="text-orange-500" />
              <p className="text-xs font-medium text-slate-400 line-through">Carne para asado</p>
            </div>
            <p className="text-xs font-bold text-slate-400">$ 60.000</p>
          </div>
          {/* Item 2 - Animating to Checked */}
          <div className="flex items-center justify-between relative overflow-hidden group">
            <div className="flex items-center gap-2">
              <div className="relative w-[14px] h-[14px]">
                <div className="absolute inset-0 border-2 border-slate-300 rounded-[3px] animate-hide-box" />
                <CheckSquare size={14} className="text-orange-500 absolute inset-0 opacity-0 animate-show-check" />
              </div>
              <p className="text-xs font-medium text-slate-700 relative">
                Cervezas y Hielo
                <span className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-400 scale-x-0 origin-left animate-strike" />
              </p>
            </div>
            <p className="text-xs font-bold text-slate-700">$ 45.000</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}

function VacaMockup() {
  return (
    <div className="rounded-3xl bg-white shadow-2xl border border-slate-100 transform rotate-1 hover:rotate-0 transition-transform duration-500 flex flex-col overflow-hidden relative h-[360px]">
      <div className="h-2 w-full bg-orange-500" />
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-dashed border-slate-200">
          <div className="flex items-center gap-2">
            <Receipt size={18} className="text-slate-400" />
            <p className="text-xs font-extrabold text-slate-700 uppercase tracking-widest">Factura Desglose</p>
          </div>
          <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-mono text-slate-500">RESUMEN</span>
        </div>
        
        <div className="space-y-4 font-mono text-sm flex-1">
          <div className="flex justify-between">
            <span className="text-slate-500">🏡 Finca & Base</span>
            <span className="font-bold text-slate-800">$ 65.000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">🍖 Mercado</span>
            <span className="font-bold text-slate-800">$ 25.000</span>
          </div>
          <div className="flex justify-between text-teal-600 bg-teal-50 px-2 py-1 rounded -mx-2">
            <span className="font-bold">🚌 Cupo Van</span>
            <span className="font-bold">+$ 15.000</span>
          </div>
          
          <div className="pt-4 mt-2 border-t-2 border-dashed border-slate-200 flex justify-between items-center">
            <span className="font-extrabold text-xs uppercase tracking-widest text-slate-400">Total a Pagar</span>
            <span className="text-2xl font-extrabold text-orange-600 animate-pulse-slow">$ 105.000</span>
          </div>
        </div>
        
        <div className="mt-4 bg-green-50 text-green-700 p-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold border border-green-100">
          <CheckCircle2 size={14} /> Cuota pagada por Pedro
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
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      @keyframes grow-width {
        from { width: 0; }
      }
      @keyframes pulse-slow {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
      @keyframes typing {
        from { width: 0; }
        to { width: 100%; }
      }
      @keyframes slide-in {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes strike {
        0% { transform: scaleX(0); }
        50% { transform: scaleX(0); }
        100% { transform: scaleX(1); }
      }
      @keyframes hide-box {
        0% { opacity: 1; }
        49% { opacity: 1; }
        50% { opacity: 0; }
        100% { opacity: 0; }
      }
      @keyframes show-check {
        0% { opacity: 0; transform: scale(0.5); }
        49% { opacity: 0; transform: scale(0.5); }
        50% { opacity: 1; transform: scale(1.2); }
        70% { transform: scale(0.9); }
        100% { opacity: 1; transform: scale(1); }
      }

      .animate-fade-in-up {
        animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
      }
      .animate-float {
        animation: float 4s ease-in-out infinite;
      }
      .animate-grow-width {
        animation: grow-width 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      .animate-pulse-slow {
        animation: pulse-slow 3s ease-in-out infinite;
      }
      .animate-typing {
        display: inline-block;
        animation: typing 2s steps(20, end) infinite alternate;
      }
      .animate-slide-in {
        animation: slide-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
      }
      .animate-strike {
        animation: strike 3s ease-in-out infinite;
      }
      .animate-hide-box {
        animation: hide-box 3s ease-in-out infinite;
      }
      .animate-show-check {
        animation: show-check 3s ease-in-out infinite;
      }
      
      .animation-delay-100 { animation-delay: 100ms; }
      .animation-delay-200 { animation-delay: 200ms; }
      .animation-delay-300 { animation-delay: 300ms; }
      .animation-delay-500 { animation-delay: 500ms; }
      
      html { scroll-behavior: smooth; }
      .perspective-1000 { perspective: 1000px; }
    `}} />
  );
}
