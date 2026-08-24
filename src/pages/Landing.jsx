import { Link } from "react-router-dom";
import {
  Map,
  Calculator,
  Vote,
  Car,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Heart,
  Coffee
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-200 selection:text-teal-900">
      {/* 🌟 NAVBAR */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
              <Map size={20} className="text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-800">
              PaseoYa
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm font-semibold text-slate-500 hover:text-slate-800 hidden md:block">
              Características
            </a>
            <a href="#how-it-works" className="text-sm font-semibold text-slate-500 hover:text-slate-800 hidden md:block">
              Cómo Funciona
            </a>
            <Link
              to="/crear"
              className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-800 transition-all active:scale-95"
            >
              Crear Paseo
            </Link>
          </div>
        </div>
      </nav>

      {/* 🚀 HERO SECTION */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles size={14} /> La app definitiva para parches
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Organizar un paseo <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-500">
              nunca fue tan fácil
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Olvídate de las discusiones en WhatsApp y los enredos con la plata. PaseoYa centraliza fechas, lugares, transporte y calcula "La Vaca" automáticamente.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/crear"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl font-extrabold text-lg transition-all shadow-lg shadow-teal-500/30 active:scale-95"
            >
              Comenzar a organizar <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* 💡 FEATURES GRID */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Todo lo que tu grupo necesita</h2>
            <p className="text-slate-500">Deja de usar hojas de cálculo y chats interminables.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Calculator className="text-orange-500" size={24} />}
              color="bg-orange-50"
              title="La Vaca Automática"
              desc="La app calcula exactamente cuánto debe pagar cada uno. Divide alojamiento, mercado y pasajes de bus al centavo. ¡Cero peleas por plata!"
            />
            <FeatureCard 
              icon={<Vote className="text-indigo-500" size={24} />}
              color="bg-indigo-50"
              title="Votación Democrática"
              desc="Propongan fechas y lugares. Cada invitado puede votar por su opción favorita. El sistema corona a la opción ganadora."
            />
            <FeatureCard 
              icon={<Car className="text-teal-500" size={24} />}
              color="bg-teal-50"
              title="Logística y Transporte"
              desc="¿Quién lleva carro? ¿Quién va en el bus? Coordina los cupos vehiculares y divide el costo de la van automáticamente."
            />
          </div>
        </div>
      </section>

      {/* 📱 HOW IT WORKS */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                Del "hagamos algo" <br/> al "¡qué buen viaje!" en 3 pasos.
              </h2>
              
              <div className="space-y-6">
                <Step 
                  num="1" 
                  title="Crea el paseo en 1 minuto" 
                  desc="Ponle nombre, agrega una foto de portada y define el presupuesto base (como la finca)."
                />
                <Step 
                  num="2" 
                  title="Comparte el Link Mágico" 
                  desc="Manda el enlace por WhatsApp. Tus amigos se registran con un clic y confirman asistencia."
                />
                <Step 
                  num="3" 
                  title="Delega y Relájate" 
                  desc="La app se encarga de recolectar votos, armar el mercado y sacar las cuentas de cuánto le toca a cada uno."
                />
              </div>
            </div>
            <div className="relative">
              {/* Mockup decoration */}
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-200 to-indigo-200 blur-3xl opacity-30 rounded-full" />
              <div className="relative bg-white p-6 rounded-3xl border border-slate-100 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <p className="font-extrabold text-slate-800">Factura Desglose</p>
                      <p className="text-xs text-slate-400 font-mono">Total a pagar</p>
                    </div>
                    <span className="text-2xl font-extrabold text-orange-500">$ 120.000</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">🏡 Finca (Base)</span>
                      <span className="font-bold text-slate-700">$ 80.000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">🍖 Mercado</span>
                      <span className="font-bold text-slate-700">$ 25.000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">🚌 Transporte</span>
                      <span className="font-bold text-slate-700">$ 15.000</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                    <div className="bg-green-50 text-green-700 text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-2">
                      <CheckCircle2 size={14} /> ¡Pedro ha pagado!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 💬 SOCIAL PROOF (TESTIMONIALS) */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-12">
          <h2 className="text-3xl font-extrabold">Diseñada para salvar amistades</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <Testimonial 
              quote="Por fin dejamos de pelearnos por quién compró el hielo y quién puso el carro. La Vaca automática es una salvación."
              author="Carlos M."
              role="El que siempre organizaba"
            />
            <Testimonial 
              quote="Antes durábamos 3 semanas en el chat decidiendo la fecha. Ahora con la votación, en 2 días ya tenemos todo listo."
              author="Laura Gómez"
              role="Usuaria feliz"
            />
            <Testimonial 
              quote="Me encanta que no tuve que descargar ninguna app. Solo abrí el link de WhatsApp y ya estaba en el parche."
              author="Andrés F."
              role="Invitado"
            />
          </div>
        </div>
      </section>

      {/* 🏁 CTA FOOTER */}
      <section className="py-24 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
          ¿Listo para el próximo parche?
        </h2>
        <p className="text-slate-500 mb-8 max-w-xl mx-auto">
          Es 100% gratis. Crea tu paseo en un minuto y sorprende a tus amigos con la mejor organización que han visto.
        </p>
        <Link
          to="/crear"
          className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-extrabold text-lg transition-transform active:scale-95 shadow-xl shadow-slate-900/20"
        >
          Crear Paseo Ahora <Sparkles size={20} />
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-semibold text-slate-400">
          <div className="flex items-center gap-2">
            <Map size={16} /> PaseoYa © {new Date().getFullYear()}
          </div>
          <div className="flex items-center gap-1">
            Hecho con <Heart size={14} className="text-red-500 fill-red-500" /> y <Coffee size={14} /> para los mejores parches
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, color, title, desc }) {
  return (
    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ num, title, desc }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-extrabold flex items-center justify-center">
        {num}
      </div>
      <div>
        <h4 className="text-lg font-bold text-slate-800 mb-1">{title}</h4>
        <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function Testimonial({ quote, author, role }) {
  return (
    <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-4">
      <div className="flex gap-1 text-teal-400">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-slate-300 text-sm leading-relaxed italic">"{quote}"</p>
      <div>
        <p className="font-bold text-white text-sm">{author}</p>
        <p className="text-xs text-slate-400">{role}</p>
      </div>
    </div>
  );
}
