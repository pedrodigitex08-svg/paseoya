import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePaseo } from "../store/usePaseoStore";
import { supabase } from "../store/supabase";
import { useState, useEffect } from "react";
import { LogOut, Plus, MapPin } from "lucide-react";
import {
  Map,
  Calculator,
  Vote,
  Car,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Heart,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  ShoppingCart,
  CheckSquare,
  Ticket,
  Receipt,
  Crown,
  Users,
  Image as ImageIcon,
  Banknote,
  CalendarDays,
  PenTool,
  HandCoins,
  ChevronDown
} from "lucide-react";

export default function Landing() {

  const navigate = useNavigate();
  const { state, signInWithGoogle, signOut, loadPaseoFromCloud, checkSession } = usePaseo();
  const [myPaseos, setMyPaseos] = useState([]);
  const [loadingPaseos, setLoadingPaseos] = useState(false);

  // Fetch paseos from Supabase when session exists
  useEffect(() => {
    checkSession();
    const fetchMyPaseos = async () => {
      if (!state.session?.user?.id) return;
      setLoadingPaseos(true);
      try {
        const { data, error } = await supabase
          .from('paseos')
          .select('data')
          .filter('data->>hostId', 'eq', state.session.user.id);
        
        if (data) {
          setMyPaseos(data.map(d => d.data));
        }
      } catch (e) {
        console.error(e);
      }
      setLoadingPaseos(false);
    };
    fetchMyPaseos();
  }, [state.session]);

  if (state.session) {
    return (
      <div className="min-h-screen bg-[#FFFBF7] font-sans selection:bg-orange-200">
        <nav className="fixed top-0 w-full bg-[#FFFBF7]/90 backdrop-blur-xl z-50 border-b border-orange-100/50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Map size={18} className="text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                PaseoYa
              </span>
            </div>
            <button 
              onClick={signOut}
              className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors text-sm font-bold"
            >
              <LogOut size={16} /> Salir
            </button>
          </div>
        </nav>

        <main className="pt-24 pb-20 px-6 max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900">Mis Paseos</h1>
            <p className="text-slate-500 mt-2">Bienvenido de vuelta. Aquí están todos los paseos que has organizado.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              to="/crear"
              className="h-48 border-2 border-dashed border-orange-200 bg-orange-50/50 rounded-3xl flex flex-col items-center justify-center text-orange-500 hover:bg-orange-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Plus size={24} />
              </div>
              <span className="font-bold">Crear Nuevo Paseo</span>
            </Link>

            {loadingPaseos ? (
              <div className="h-48 rounded-3xl bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 font-bold">
                Cargando...
              </div>
            ) : (
              myPaseos.map((paseo) => (
                <div 
                  key={paseo.id}
                  onClick={() => {
                    // Cargar al store activo y navegar
                    loadPaseoFromCloud(paseo.slug).then(() => {
                      navigate(`/paseo/${paseo.slug}`);
                    });
                  }}
                  className="h-48 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-200 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-3xl">{paseo.emoji || "🏕️"}</span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg uppercase">
                        {paseo.category || "Finca"}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-lg text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {paseo.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                      <MapPin size={14} />
                      <span className="text-xs font-medium truncate">{paseo.location || "Destino por definir"}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Users size={14} />
                      <span className="text-xs font-bold">{paseo.participants?.length || 1} invitados</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF7] font-sans selection:bg-orange-200 selection:text-orange-900 overflow-x-hidden">
      <CustomAnimations />

      {/* 🌟 NAVBAR ULTRA PREMIUM */}
      <nav className="fixed top-0 w-full bg-[#FFFBF7]/90 backdrop-blur-xl z-50 border-b border-orange-100/50 transition-all">
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
              Descubre las Funciones
            </a>
            <button
              onClick={signInWithGoogle}
              className="bg-orange-500 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-orange-600 transition-all hover:shadow-xl hover:shadow-orange-500/30 active:scale-95 flex items-center gap-2"
            >
              Ingresar con Google <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* 🚀 HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-b from-orange-200/40 to-transparent blur-3xl -z-10 rounded-full" />
        
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-200 text-orange-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
              <Sparkles size={14} className="text-orange-500" /> La herramienta definitiva
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tighter leading-[1.1]">
              Organizar tu paseo <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 animate-gradient-x">
                ya no es un dolor de cabeza.
              </span>
            </h1>
          </div>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-100 font-medium">
            Desde proponer el destino hasta cobrar el último peso de la vaca. Una experiencia premium diseñada para salvar amistades y hacer que armar el plan sea un placer.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up animation-delay-200">
            <button
              onClick={signInWithGoogle}
              className="group flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-extrabold text-lg transition-all shadow-xl shadow-orange-500/30 active:scale-95"
            >
              Ingresar con Google
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 🗺️ THE JOURNEY (DETAILED 5 STEPS) */}
      <section id="how-it-works" className="py-24 bg-white relative border-t border-orange-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-28 space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Así funciona la magia.
            </h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto">
              Conoce el paso a paso detallado de todas las herramientas exclusivas que te ofrece PaseoYa.
            </p>
          </div>

          <div className="space-y-40">
            
            {/* 1. CREACIÓN DEL PASEO */}
            <FeatureBlock 
              step="1"
              align="right"
              badge="Inicio Rápido"
              badgeColor="text-orange-600 bg-orange-100"
              title="Creación del Paseo (El Anfitrión)"
              content={
                <ul className="space-y-4 text-slate-600 font-medium">
                  <li><strong className="text-slate-900">Sin registros molestos:</strong> No necesitas correos pesados ni contraseñas. Un formulario directo.</li>
                  <li><strong className="text-slate-900">Nombre y Destino:</strong> Ej. "Desenguayabe en Melgar". Ponle el tono a tu evento desde el inicio.</li>
                  <li><strong className="text-slate-900">Presupuesto Base:</strong> Crucial. Aquí pones el costo fijo (ej. el alquiler de la finca). La app lo usará mágicamente después para dividirlo entre los que asistan.</li>
                  <li><strong className="text-slate-900">Foto de Portada:</strong> Sube una imagen espectacular para enamorar a tus invitados desde el primer clic.</li>
                </ul>
              }
              visual={<CreacionMockup />}
            />

            {/* 2. LINK MÁGICO Y RSVP */}
            <FeatureBlock 
              step="2"
              align="left"
              badge="Invitación & RSVP"
              badgeColor="text-amber-600 bg-amber-100"
              title="El Link Mágico y Confirmación"
              content={
                <ul className="space-y-4 text-slate-600 font-medium">
                  <li><strong className="text-slate-900">Compartir el Link:</strong> El anfitrión copia la URL única y la lanza al grupo de WhatsApp.</li>
                  <li><strong className="text-slate-900">Experiencia del Invitado:</strong> Al abrir el link, no ven una pantalla aburrida. Son recibidos por una Tarjeta de Invitación Premium.</li>
                  <li><strong className="text-slate-900">Confirmación (RSVP) Express:</strong> El invitado escribe su nombre, toca "Confirmar" y el sistema lo añade automáticamente a la lista oficial de la base de datos.</li>
                </ul>
              }
              visual={<LinkMockup />}
            />

            {/* 3. VOTACIONES */}
            <FeatureBlock 
              step="3"
              align="right"
              badge="Democracia"
              badgeColor="text-emerald-600 bg-emerald-100"
              title="Votaciones Transparentes"
              content={
                <ul className="space-y-4 text-slate-600 font-medium">
                  <li><strong className="text-slate-900">Sugerir Fechas y Lugares:</strong> Evita el caos en el chat. Cualquier invitado puede proponer fechas en el calendario o destinos como "Cabaña en Guatapé".</li>
                  <li><strong className="text-slate-900">Votos interactivos:</strong> Voten con "Sí/No" o manitas arriba/abajo (👍👎).</li>
                  <li><strong className="text-slate-900">¿Quién votó?:</strong> Debajo de cada opción aparecen las iniciales en circulitos. Pasa el mouse y mira exactamente quién apoyó qué opción.</li>
                  <li><strong className="text-slate-900">Coronar al Ganador:</strong> El anfitrión cierra la votación y el sistema bloquea y marca en amarillo brillante (con una corona 👑) la decisión oficial.</li>
                </ul>
              }
              visual={<VotacionMockup />}
            />

            {/* 4. LOGÍSTICA */}
            <FeatureBlock 
              step="4"
              align="left"
              badge="Organización"
              badgeColor="text-sky-600 bg-sky-100"
              title="Logística (Armando el plan)"
              content={
                <ul className="space-y-4 text-slate-600 font-medium">
                  <li><strong className="text-slate-900">Menú Colaborativo:</strong> Una lista de mercado donde agregan "Cervezas", ponen el precio y las marcan con check (✅). ¡El total se va directo a La Vaca para dividirse!</li>
                  <li><strong className="text-slate-900">Transporte (Los Carros):</strong> Registra vehículos, cupos libres y costo de gasolina.</li>
                  <li><strong className="text-slate-900">Justicia pura:</strong> Los invitados separan su cupo, y la genialidad es que el costo de la gasolina se divide SÓLO entre los ocupantes de ese vehículo.</li>
                </ul>
              }
              visual={<LogisticaMockup />}
            />

            {/* 5. LA VACA */}
            <FeatureBlock 
              step="5"
              align="right"
              badge="Finanzas"
              badgeColor="text-rose-600 bg-rose-100"
              title="La Vaca (Cuentas Claras)"
              content={
                <ul className="space-y-4 text-slate-600 font-medium">
                  <li><strong className="text-slate-900">Resumen Individual (La Factura):</strong> Al desplegar la flecha, cada invitado ve de dónde sale su cuota: Base dividida + Mercado dividido + Su asiento en el Transporte.</li>
                  <li><strong className="text-slate-900">Control de Pagos:</strong> Casillas (checkbox) para marcar quién ya transfirió, poniéndose en verde. (Todo se auto-ajusta si alguien cancela).</li>
                  <li><strong className="text-slate-900">Gastos Extras:</strong> Registra compras imprevistas grupales ("Se acabó el hielo por $20k"). Se suma y divide entre todos automáticamente.</li>
                  <li><strong className="text-slate-900">Deudas Personales 1 a 1:</strong> "María le debe $50k a Carlos". Se anota para que no se hagan los locos, sin afectar la Vaca grupal.</li>
                </ul>
              }
              visual={<VacaMockup />}
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
            Conviértete en el mejor organizador de tu grupo.
          </h2>
          <button
            onClick={signInWithGoogle}
            className="inline-flex items-center gap-3 px-10 py-5 bg-orange-500 text-white rounded-full font-extrabold text-xl transition-all hover:scale-105 hover:bg-orange-600 shadow-[0_0_40px_rgba(249,115,22,0.4)]"
          >
            Ingresar con Google <Sparkles size={24} className="text-white" />
          </button>
        </div>
      </section>
      
      <footer className="bg-slate-950 py-12 border-t border-slate-900 text-center">
        <div className="text-sm font-semibold text-slate-500 flex items-center justify-center gap-2">
          PaseoYa © {new Date().getFullYear()} • Hecho con <Heart size={14} className="text-orange-500 fill-orange-500" /> para salvar amistades.
        </div>
      </footer>
    </div>
  );
}

// ----------------------------------------------------------------------
// COMPONENTS
// ----------------------------------------------------------------------

function FeatureBlock({ step, align, badge, badgeColor, title, content, visual }) {
  const isRight = align === "right";
  
  return (
    <div className={`flex flex-col ${isRight ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24 relative`}>
      {/* Decorative Step Number Background */}
      <div className={`absolute top-0 ${isRight ? 'right-0 lg:right-1/2 translate-x-1/2' : 'left-0 lg:left-1/2 -translate-x-1/2'} -translate-y-1/2 text-[200px] font-black text-orange-50/50 -z-10 select-none leading-none`}>
        {step}
      </div>

      <div className="flex-1 space-y-6">
        <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${badgeColor}`}>
          Paso {step}: {badge}
        </div>
        <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {title}
        </h3>
        <div className="text-lg text-slate-500 leading-relaxed font-medium">
          {content}
        </div>
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

// 1. Creacion Mockup
function CreacionMockup() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 transform rotate-2 hover:rotate-0 transition-transform duration-500 h-[380px] flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <PenTool className="text-orange-500" size={24} />
          <h4 className="font-extrabold text-slate-800 text-lg">Crea tu plan</h4>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nombre del Paseo</label>
            <div className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-4 flex items-center shadow-inner">
              <span className="text-slate-800 font-bold text-sm animate-typing border-r-2 border-orange-500 pr-1 overflow-hidden whitespace-nowrap">Desenguayabe en Melgar</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Presupuesto Base (Finca)</label>
            <div className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-4 flex items-center shadow-inner">
              <span className="text-slate-800 font-bold text-sm">$ 850.000</span>
            </div>
          </div>

          <div className="h-20 bg-orange-50 border-2 border-dashed border-orange-200 rounded-xl flex flex-col items-center justify-center text-orange-400 gap-1 animate-pulse-slow">
            <ImageIcon size={20} />
            <span className="text-xs font-bold">Subir foto de portada</span>
          </div>
        </div>
      </div>
      
      <div className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-center shadow-lg hover:scale-[1.02] transition-transform">
        Generar Link del Paseo
      </div>
    </div>
  );
}

// 2. Link & RSVP Mockup
function LinkMockup() {
  return (
    <div className="relative h-[380px] w-full flex items-center justify-center perspective-1000 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
      {/* WhatsApp background card */}
      <div className="absolute top-4 left-0 right-8 h-48 bg-[#EFEAE2] rounded-3xl shadow-lg border-2 border-slate-200 p-4 flex flex-col justify-end animate-slide-in">
         <div className="self-end bg-[#DCF8C6] p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] relative">
            <p className="text-xs text-slate-800 mb-1 font-medium">
              ¡Muchachos! Armé el paseo. Confirmen aquí 👇
            </p>
            <div className="bg-[#128C7E]/10 rounded-xl p-2 border-l-4 border-[#128C7E] mt-1 flex items-center gap-2">
              <Map size={14} className="text-[#128C7E]" />
              <p className="text-[10px] font-bold text-[#128C7E] truncate">paseoya.com/desenguayabe</p>
            </div>
          </div>
      </div>

      {/* RSVP Ticket Overlay */}
      <div className="absolute bottom-0 right-0 left-8 h-64 bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl p-6 shadow-2xl shadow-orange-500/30 flex flex-col justify-center animate-fade-in-up animation-delay-300 border-4 border-white">
        <div className="w-12 h-12 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-2">
          <Ticket className="text-white" size={24} />
        </div>
        <h4 className="text-lg font-extrabold text-white text-center">Desenguayabe en Melgar</h4>
        
        <div className="mt-4 space-y-3 bg-white p-4 rounded-2xl shadow-inner">
          <div className="h-9 bg-slate-50 border border-slate-200 rounded-lg flex items-center px-3 text-slate-400 text-xs">
            Escribe tu nombre...
          </div>
          <button className="w-full bg-slate-900 text-white font-bold py-2 rounded-lg text-sm shadow-md relative overflow-hidden group">
            ¡Sí, confirmo!
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. Votacion Mockup
function VotacionMockup() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 transform rotate-1 hover:rotate-0 transition-transform duration-500 h-[380px] flex flex-col justify-center gap-4">
      
      {/* Winner Card */}
      <div className="p-4 rounded-2xl border-4 border-amber-400 bg-amber-50 relative overflow-hidden shadow-[0_0_20px_rgba(251,191,36,0.3)] animate-pulse-slow">
        <div className="absolute top-0 right-0 bg-amber-400 text-white px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
          <Crown size={12} className="text-white fill-white" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">Ganador</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <CalendarDays size={16} className="text-amber-500" />
          <p className="font-extrabold text-slate-800 text-sm">15 Oct - 18 Oct</p>
        </div>
        
        <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1">
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircle2 size={12}/> Sí (80%)
          </span>
          <div className="flex -space-x-1.5 relative z-10">
            <Avatar initials="CM" color="bg-orange-200 text-orange-700" title="Carlos" />
            <Avatar initials="LG" color="bg-teal-200 text-teal-700" title="Laura Gómez" />
            <Avatar initials="PM" color="bg-blue-200 text-blue-700" title="Pedro" />
            <Avatar initials="AF" color="bg-rose-200 text-rose-700" title="Andrés" />
          </div>
        </div>
        <div className="h-2 bg-white rounded-full overflow-hidden mt-1 shadow-inner">
          <div className="h-full bg-green-500 rounded-full w-[80%]" />
        </div>
      </div>
      
      {/* Normal Card */}
      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2 mb-2">
          <CalendarDays size={16} className="text-slate-400" />
          <p className="font-extrabold text-slate-700 text-sm">22 Oct - 25 Oct</p>
        </div>
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-1">
          <span className="flex items-center gap-1 text-slate-500">
            Sí (20%)
          </span>
          <div className="flex -space-x-1.5">
            <Avatar initials="JM" color="bg-indigo-200 text-indigo-700" title="Juan" />
          </div>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
          <div className="h-full bg-slate-400 rounded-full w-[20%]" />
        </div>
      </div>
      
    </div>
  );
}

function Avatar({ initials, color, title }) {
  return (
    <div 
      className={`w-6 h-6 rounded-full ${color} border-2 border-white flex items-center justify-center text-[9px] font-bold shadow-sm cursor-help hover:-translate-y-1 transition-transform`}
      title={title}
    >
      {initials}
    </div>
  );
}

// 4. Logistica Mockup
function LogisticaMockup() {
  return (
    <div className="rounded-3xl bg-slate-50 p-6 shadow-2xl border border-slate-200 transform -rotate-1 hover:rotate-0 transition-transform duration-500 h-[380px] flex flex-col justify-center space-y-4">
      
      {/* Transporte */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 animate-slide-in">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Car className="text-teal-500" size={18} />
            <p className="font-extrabold text-slate-800 text-sm">Transporte</p>
          </div>
          <span className="text-[10px] font-bold bg-teal-50 text-teal-600 px-2 py-0.5 rounded">Gasto dividido en 3</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-700">Camioneta de Pedro</p>
            <p className="text-[10px] text-slate-400">Gasolina: $60.000</p>
          </div>
          <div className="flex gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center text-[10px] font-bold text-teal-700 border border-teal-200">P</div>
            <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center text-[10px] font-bold text-teal-700 border border-teal-200">L</div>
            <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center text-[10px] font-bold text-teal-700 border border-teal-200">A</div>
            <div className="w-7 h-7 rounded-lg bg-slate-50 border-2 border-dashed border-slate-300 animate-pulse flex items-center justify-center text-slate-400"><Users size={12}/></div>
          </div>
        </div>
      </div>

      {/* Mercado */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 animate-slide-in animation-delay-200">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-orange-500" size={18} />
            <p className="font-extrabold text-slate-800 text-sm">Menú (Mercado)</p>
          </div>
          <span className="text-[10px] font-bold text-slate-400">Total a La Vaca</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
              <CheckSquare size={16} className="text-orange-500" />
              <p className="text-xs font-medium text-slate-400 line-through">Carne para asado</p>
            </div>
            <p className="text-xs font-bold text-slate-400">$ 60.000</p>
          </div>
          
          <div className="flex items-center justify-between relative overflow-hidden group">
            <div className="flex items-center gap-2">
              <div className="relative w-4 h-4">
                <div className="absolute inset-0 border-2 border-slate-300 rounded-[4px] animate-hide-box" />
                <CheckSquare size={16} className="text-orange-500 absolute inset-0 opacity-0 animate-show-check" />
              </div>
              <p className="text-xs font-medium text-slate-700 relative">
                Cervezas y Hielo
                <span className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-400 scale-x-0 origin-left animate-strike" />
              </p>
            </div>
            <p className="text-xs font-bold text-slate-700">$ 45.000</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}

// 5. Vaca Mockup
function VacaMockup() {
  return (
    <div className="rounded-3xl bg-white shadow-2xl border border-slate-200 transform rotate-1 hover:rotate-0 transition-transform duration-500 flex flex-col overflow-hidden relative h-[380px]">
      <div className="h-2 w-full bg-orange-500" />
      <div className="p-5 flex-1 flex flex-col">
        
        {/* Header - User Tab */}
        <div className="flex items-center justify-between mb-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600">AF</div>
            <span className="font-extrabold text-slate-800 text-sm">Andrés F.</span>
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </div>

        {/* Factura Receipt */}
        <div className="flex-1 bg-white border-x-2 border-t-2 border-dashed border-slate-200 rounded-t-xl p-4 flex flex-col relative before:absolute before:bottom-0 before:left-0 before:w-full before:h-2 before:bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
          <div className="flex items-center gap-2 mb-3 text-slate-400 border-b border-slate-100 pb-2">
            <Receipt size={14} />
            <span className="text-[10px] font-extrabold uppercase tracking-widest">Recibo Detallado</span>
          </div>
          
          <div className="space-y-2.5 font-mono text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Base (Finca / 10)</span>
              <span className="font-bold text-slate-800">$ 85.000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Mercado / 10</span>
              <span className="font-bold text-slate-800">$ 25.000</span>
            </div>
            <div className="flex justify-between items-center bg-teal-50 px-1 py-0.5 rounded text-teal-700">
              <span className="font-bold">Transporte (Camioneta)</span>
              <span className="font-bold">+$ 20.000</span>
            </div>
            <div className="flex justify-between items-center bg-rose-50 px-1 py-0.5 rounded text-rose-700">
              <span className="font-bold whitespace-nowrap">Gasto Extra (Hielo)</span>
              <span className="font-bold">+$ 2.000</span>
            </div>
            
            <div className="pt-2 mt-2 border-t-2 border-dashed border-slate-200 flex justify-between items-end">
              <span className="font-extrabold text-[10px] uppercase tracking-widest text-slate-400">Total Cuota</span>
              <span className="text-xl font-extrabold text-orange-600 animate-pulse-slow">$ 132.000</span>
            </div>
          </div>
        </div>

        {/* Deuda 1 a 1 Badge */}
        <div className="mt-3 flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-600">
            <HandCoins size={14} className="text-amber-500" />
            <span className="text-[10px] font-bold">Deuda personal</span>
          </div>
          <span className="text-[10px] font-bold text-slate-500">Le debes $50k a Carlos</span>
        </div>
        
        {/* Checkbox Pago */}
        <div className="mt-3 bg-green-50 text-green-700 py-2 px-3 rounded-xl flex items-center gap-2 text-xs font-bold border border-green-200">
          <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center">
            <CheckCircle2 size={12} className="text-white" />
          </div>
          Pago confirmado por Anfitrión
        </div>
      </div>
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
      
      html { scroll-behavior: smooth; }
      .perspective-1000 { perspective: 1000px; }
    `}} />
  );
}
