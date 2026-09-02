import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function Privacidad() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-orange-200">
      {/* Header Fijo */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link
            to="/"
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-orange-500" size={24} />
            <h1 className="font-extrabold text-slate-800 text-lg">PaseoYa</h1>
          </div>
        </div>
      </header>

      {/* Contenido Legal */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-sm border border-slate-200">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Política de Privacidad y Tratamiento de Datos
          </h1>
          <p className="text-slate-500 font-medium mb-12">
            Última actualización: 2 de Septiembre de 2026 (Adaptado a la Ley 1581 de 2012 de la República de Colombia).
          </p>

          <div className="space-y-10 text-slate-700 leading-relaxed">
            
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                1. Identificación del Responsable del Tratamiento
              </h2>
              <p>
                De acuerdo con la Ley 1581 de 2012 y el Decreto 1377 de 2013, se informa que el responsable de la recolección, almacenamiento, uso, y eliminación de los datos personales recopilados a través de la aplicación web PaseoYa es:
              </p>
              <ul className="mt-3 list-disc list-inside text-slate-600 bg-orange-50 p-4 rounded-xl border border-orange-100">
                <li><strong>Nombre / Razón Social:</strong> <span className="text-orange-600 font-bold bg-orange-200/50 px-1 rounded">[PENDIENTE POR VERIFICAR]</span></li>
                <li><strong>Correo de Contacto:</strong> <span className="text-orange-600 font-bold bg-orange-200/50 px-1 rounded">[PENDIENTE POR VERIFICAR]</span></li>
                <li><strong>País de Operación principal:</strong> Colombia.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. Datos que se recopilan</h2>
              <p>PaseoYa recopila única y exclusivamente la información estrictamente necesaria para el funcionamiento de la aplicación:</p>
              <ul className="mt-3 list-disc list-inside space-y-2 ml-4">
                <li><strong>Usuarios Anfitriones (Organizadores):</strong> Nombre completo, dirección de correo electrónico y fotografía de perfil (suministrados directamente por Google LLC a través del protocolo OAuth de inicio de sesión).</li>
                <li><strong>Usuarios Invitados:</strong> Apodo o nombre proporcionado libremente al momento de acceder mediante un enlace de invitación. No se requiere correo electrónico ni contraseña para este rol.</li>
                <li><strong>Datos Operativos:</strong> Información sobre destinos, fechas propuestas, listas de mercado y montos financieros ingresados manualmente por los usuarios para calcular los gastos compartidos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. Finalidad del Tratamiento</h2>
              <p>Los datos personales recolectados serán utilizados para las siguientes finalidades:</p>
              <ul className="mt-3 list-disc list-inside space-y-2 ml-4">
                <li>Permitir la creación, organización y gestión de eventos (paseos) en la plataforma.</li>
                <li>Garantizar la identidad del anfitrión y proteger la propiedad de los datos del evento.</li>
                <li>Facilitar herramientas de cálculo financiero (La Vaca) y votaciones democráticas.</li>
              </ul>
              <p className="mt-4 font-bold text-slate-900 bg-slate-100 p-3 rounded-lg border-l-4 border-slate-500">
                PaseoYa declara explícitamente que NO comercializa, alquila, ni cede bases de datos a terceros para fines publicitarios o de marketing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Derechos del Titular (Derechos ARCO)</h2>
              <p>Conforme a la legislación colombiana (Artículo 8, Ley 1581 de 2012), los usuarios de PaseoYa tienen derecho a:</p>
              <ul className="mt-3 list-disc list-inside space-y-2 ml-4">
                <li><strong>Conocer, actualizar y rectificar</strong> sus datos personales frente a PaseoYa.</li>
                <li><strong>Solicitar prueba de la autorización</strong> otorgada para el tratamiento de datos.</li>
                <li>Ser informados, previa solicitud, respecto del uso que se le ha dado a sus datos.</li>
                <li><strong>Revocar la autorización y/o solicitar la supresión del dato</strong> cuando en el tratamiento no se respeten los principios, derechos y garantías constitucionales y legales.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">5. Procedimiento para ejercer los derechos</h2>
              <p>
                Para ejercer sus derechos constitucionales y legales (conocer, actualizar, rectificar y suprimir datos), el Titular deberá enviar una solicitud por escrito al correo electrónico: <strong className="text-orange-600 bg-orange-100 px-1 rounded">[CORREO PENDIENTE]</strong>.
              </p>
              <p className="mt-2">
                La solicitud será atendida en un término máximo de quince (15) días hábiles contados a partir del día siguiente a la fecha de su recibo, conforme a los tiempos estipulados por la ley.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">6. Transferencia Internacional de Datos</h2>
              <p>
                Para garantizar la disponibilidad y seguridad del servicio, PaseoYa utiliza infraestructura de computación en la nube (proveedores como Vercel y Supabase/Google Cloud), cuyos servidores pueden estar ubicados en Estados Unidos u otros países. Al usar la aplicación, el Titular autoriza la transferencia y transmisión internacional de sus datos a estas plataformas, las cuales cumplen con estándares internacionales de seguridad (SOC2, ISO 27001).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">7. Uso de Cookies y Almacenamiento Local</h2>
              <p>
                La aplicación utiliza tecnologías de "Local Storage" (Almacenamiento Local) en el navegador o dispositivo del usuario para mantener la sesión activa, guardar preferencias y optimizar la velocidad de la aplicación. El usuario puede borrar esta información en cualquier momento limpiando el caché de su navegador.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">8. Seguridad de la Información</h2>
              <p>
                PaseoYa adopta las medidas técnicas, humanas y administrativas necesarias para evitar la adulteración, pérdida, consulta, uso o acceso no autorizado a los datos, implementando protocolos como:
              </p>
              <ul className="mt-3 list-disc list-inside space-y-2 ml-4">
                <li>Conexiones encriptadas de extremo a extremo mediante certificados SSL/TLS (HTTPS).</li>
                <li>Reglas de Seguridad a Nivel de Fila (Row Level Security - RLS) y Triggers en la base de datos para impedir que terceros modifiquen información que no les pertenece.</li>
                <li>Autenticación delegada a Google LLC, evitando el almacenamiento de contraseñas propias.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">9. Vigencia</h2>
              <p>
                La presente política rige a partir de su publicación en la plataforma web. Las bases de datos en las que se registrarán los datos personales tendrán una vigencia igual al tiempo en que se mantenga y utilice la información para las finalidades descritas en esta política, o hasta que el Titular solicite su eliminación.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer minimalista */}
      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} PaseoYa. Construido en Colombia. 🇨🇴</p>
      </footer>
    </div>
  );
}
