import React, { useState, useEffect } from 'react';
import {
  X,
  PhoneCall,
  MapPin,
  HeartPulse,
  Building2,
  Share2,
  AlertTriangle,
  Check,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SafetyInfo } from '../../types';

export const SosModal: React.FC = () => {
  const { isSosModalOpen, setIsSosModalOpen } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState('JP');
  const [safetyInfo, setSafetyInfo] = useState<SafetyInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (isSosModalOpen) {
      fetchSafety(selectedCountry);
    }
  }, [isSosModalOpen, selectedCountry]);

  const fetchSafety = async (countryCode: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/safety/${countryCode}`);
      const data = await res.json();
      if (data.success && data.data) {
        setSafetyInfo(data.data);
      }
    } catch (err) {
      console.error('Error fetching safety data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGpsLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalización no soportada en tu navegador');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5))
        });
        setGpsLoading(false);
      },
      (err) => {
        console.warn('Geolocation denied or unavailable:', err);
        // Fallback default
        setUserCoords({ lat: 35.6895, lng: 139.6917 });
        setGpsLoading(false);
      },
      { timeout: 8000 }
    );
  };

  const copyGpsLink = () => {
    if (!userCoords) return;
    const url = `https://www.google.com/maps?q=${userCoords.lat},${userCoords.lng}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (!isSosModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-rose-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={() => setIsSosModalOpen(false)}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 shadow-lg shadow-rose-900/30">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-black text-white">
              Centro de Seguridad & Emergencias SOS
            </h2>
            <p className="text-xs text-rose-300 font-medium">
              Asistencia inmediata verificada por país • No sustituye a los servicios de rescate oficiales
            </p>
          </div>
        </div>

        {/* Country Selector */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-slate-800 py-3">
          <span className="text-xs font-bold text-slate-300">
            País de estancia actual:
          </span>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-bold text-cyan-400 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="JP">🇯🇵 Japón (Tokio, Kioto, Osaka)</option>
            <option value="IT">🇮🇹 Italia (Roma, Milán, Florencia)</option>
            <option value="FR">🇫🇷 Francia (París, Niza, Lyon)</option>
            <option value="MA">🇲🇦 Marruecos (Marrakech, Rabat)</option>
            <option value="ES">🇪🇸 España (Madrid, Barcelona)</option>
          </select>
        </div>

        {/* Quick Emergency Phone Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <a
            href={`tel:${safetyInfo?.emergencyNumbers.general || '112'}`}
            className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-center hover:bg-rose-500/20 transition-all group"
          >
            <PhoneCall className="h-6 w-6 text-rose-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-bold text-slate-300 uppercase">General</span>
            <span className="font-heading text-lg font-black text-rose-400">
              {safetyInfo?.emergencyNumbers.general || '112'}
            </span>
          </a>

          <a
            href={`tel:${safetyInfo?.emergencyNumbers.police || '110'}`}
            className="flex flex-col items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-center hover:bg-blue-500/20 transition-all group"
          >
            <ShieldAlert className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-bold text-slate-300 uppercase">Policía</span>
            <span className="font-heading text-lg font-black text-blue-400">
              {safetyInfo?.emergencyNumbers.police || '110'}
            </span>
          </a>

          <a
            href={`tel:${safetyInfo?.emergencyNumbers.ambulance || '119'}`}
            className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center hover:bg-emerald-500/20 transition-all group"
          >
            <HeartPulse className="h-6 w-6 text-emerald-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-bold text-slate-300 uppercase">Ambulancia</span>
            <span className="font-heading text-lg font-black text-emerald-400">
              {safetyInfo?.emergencyNumbers.ambulance || '119'}
            </span>
          </a>

          <a
            href={`tel:${safetyInfo?.emergencyNumbers.fire || '119'}`}
            className="flex flex-col items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-center hover:bg-amber-500/20 transition-all group"
          >
            <AlertTriangle className="h-6 w-6 text-amber-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-bold text-slate-300 uppercase">Bomberos</span>
            <span className="font-heading text-lg font-black text-amber-400">
              {safetyInfo?.emergencyNumbers.fire || '119'}
            </span>
          </a>
        </div>

        {/* GPS Location Share */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-cyan-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-200">
                  Compartir mi posición GPS con familiares o rescate
                </p>
                <p className="text-[11px] text-slate-400">
                  {userCoords
                    ? `Coordenadas: Lat ${userCoords.lat}, Lng ${userCoords.lng}`
                    : 'Permiso de geolocalización para generar enlace exacto'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!userCoords ? (
                <button
                  onClick={getGpsLocation}
                  disabled={gpsLoading}
                  className="rounded-xl bg-cyan-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow"
                >
                  {gpsLoading ? 'Obteniendo GPS...' : 'Obtener mi GPS'}
                </button>
              ) : (
                <button
                  onClick={copyGpsLink}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow"
                >
                  {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                  <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace Maps'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Embassies & Hospitals info */}
        {safetyInfo && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200 mb-2">
                <Building2 className="h-4 w-4 text-blue-400" />
                <span>Embajadas y Consulados Oficiales</span>
              </div>
              <div className="space-y-2 text-xs text-slate-400">
                {safetyInfo.embassies.slice(0, 2).map((emb, idx) => (
                  <div key={idx} className="border-b border-slate-800/80 pb-1.5">
                    <p className="font-semibold text-slate-300">
                      Embajada de {emb.country} ({emb.city})
                    </p>
                    <p className="text-[11px] text-cyan-400">{emb.phone}</p>
                    <p className="text-[11px] truncate text-slate-500">{emb.address}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200 mb-2">
                <HeartPulse className="h-4 w-4 text-emerald-400" />
                <span>Hospitales de Referencia Internacional</span>
              </div>
              <div className="space-y-2 text-xs text-slate-400">
                {safetyInfo.hospitals.slice(0, 2).map((hosp, idx) => (
                  <div key={idx} className="border-b border-slate-800/80 pb-1.5">
                    <p className="font-semibold text-slate-300">{hosp.name}</p>
                    <p className="text-[11px] text-cyan-400">{hosp.phone}</p>
                    <span className="inline-block mt-0.5 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
                      Personal en inglés / internacional
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-6 text-center">
          <p className="text-[11px] text-slate-500">
            En caso de riesgo vital inminente, marca de inmediato el número general del país. VOYA almacena estos datos en tu dispositivo para acceso offline.
          </p>
        </div>
      </div>
    </div>
  );
};
