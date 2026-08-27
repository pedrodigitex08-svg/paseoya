import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { usePaseo } from "../store/usePaseoStore";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function GuestRecovery() {
  const { slug, guestId } = useParams();
  const navigate = useNavigate();
  const { state, loadPaseoFromCloud, setCurrentUser } = usePaseo();
  const [status, setStatus] = useState("loading"); // loading, success, error

  useEffect(() => {
    const recoverSession = async () => {
      try {
        // 1. Cargar el paseo desde la nube si no está en memoria
        let paseo = state.activePaseo;
        if (!paseo || paseo.slug !== slug) {
          paseo = await loadPaseoFromCloud(slug);
        }

        if (!paseo) {
          setStatus("error");
          return;
        }

        // 2. Buscar al participante
        const participant = paseo.participants?.find((p) => p.id === guestId);
        
        if (!participant) {
          setStatus("error");
          return;
        }

        // 3. Restaurar la sesión en localStorage (Zustand)
        setCurrentUser({
          id: participant.id,
          name: participant.name,
          role: "guest",
        });

        setStatus("success");
        
        // 4. Redirigir al Guest Hub después de un segundito para que se vea el éxito
        setTimeout(() => {
          navigate(`/paseo/${slug}/guest-hub`, { replace: true });
        }, 1500);

      } catch (error) {
        console.error("Error recuperando sesión:", error);
        setStatus("error");
      }
    };

    recoverSession();
  }, [slug, guestId, loadPaseoFromCloud, state.activePaseo, setCurrentUser, navigate]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Recuperando tu sesión...</h2>
        <p className="text-slate-500 mt-2 text-center">Estamos buscando tu silla en el paseo.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Enlace inválido o expirado</h2>
        <p className="text-slate-500 mt-2 mb-6">No pudimos encontrar tu perfil en este paseo. Pídele al organizador que te vuelva a enviar el link.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
        >
          Ir al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <CheckCircle2 className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800">¡Sesión Recuperada!</h2>
      <p className="text-slate-500 mt-2">Bienvenido de vuelta. Te estamos redirigiendo a tu panel...</p>
    </div>
  );
}
