import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  HeartPulse,
  Building2,
  Droplets,
  AlertTriangle,
  Info,
  MapPin,
  FileText,
  UserCheck
} from 'lucide-react';
import { SafetyInfo } from '../../types';

export const SafetyView: React.FC = () => {
  const [countryCode, setCountryCode] = useState('JP');
  const [safety, setSafety] = useState<SafetyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/safety/${countryCode}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSafety(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [countryCode]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400 border border-rose-500/20 mb-2">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>VOYA SAFETY & ASISTENCIA CONSULAR</span>
        </div>
        <h1 className="font-heading text-3xl font-black text-white">
          Centro de Seguridad & Emergencias Internacionales
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Llamadas de emergencia directas, consulados acreditados, prevención de estafas y hospitales de referencia con atención médica en inglés y español
        </p>
      </div>

      {/* Country Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300">
            Selecciona el país de consulta:
          </span>
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-1.5 text-xs font-bold text-cyan-400 focus:outline-none cursor-pointer"
          >
            <option value="JP">🇯🇵 Japón</option>
            <option value="IT">🇮🇹 Italia</option>
            <option value="FR">🇫🇷 Francia</option>
            <option value="MA">🇲🇦 Marruecos</option>
          </select>
        </div>

        {safety && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Índice de Seguridad:</span>
            <span className="rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
              {safety.safetyScore}/10 • {safety.advisoryLevel.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Safety Summary Banner */}
      {safety && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-3">
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <span>Situación de Seguridad en {safety.countryName}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {safety.advisorySummary}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              <Droplets className={`h-4 w-4 ${safety.tapWaterSafe ? 'text-cyan-400' : 'text-amber-400'}`} />
              <span className="text-slate-300">
                Agua del grifo: <strong>{safety.tapWaterSafe ? 'Potable y Segura ✓' : 'Consumir embotellada ⚠️'}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <HeartPulse className="h-4 w-4 text-emerald-400" />
              <span className="text-slate-300">
                Sanidad: <strong>Seguro médico de viaje con repatriación recomendado</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Phone Buttons */}
      {safety && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <a
            href={`tel:${safety.emergencyNumbers.general}`}
            className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-center hover:bg-rose-500/20 transition-all flex flex-col items-center justify-center space-y-1 group"
          >
            <PhoneCall className="h-6 w-6 text-rose-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-bold text-slate-400 uppercase">Emergencia Única</span>
            <span className="font-heading text-2xl font-black text-rose-400">
              {safety.emergencyNumbers.general}
            </span>
          </a>

          <a
            href={`tel:${safety.emergencyNumbers.police}`}
            className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5 text-center hover:bg-blue-500/20 transition-all flex flex-col items-center justify-center space-y-1 group"
          >
            <ShieldAlert className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-bold text-slate-400 uppercase">Policía</span>
            <span className="font-heading text-2xl font-black text-blue-400">
              {safety.emergencyNumbers.police}
            </span>
          </a>

          <a
            href={`tel:${safety.emergencyNumbers.ambulance}`}
            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center hover:bg-emerald-500/20 transition-all flex flex-col items-center justify-center space-y-1 group"
          >
            <HeartPulse className="h-6 w-6 text-emerald-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-bold text-slate-400 uppercase">Ambulancia</span>
            <span className="font-heading text-2xl font-black text-emerald-400">
              {safety.emergencyNumbers.ambulance}
            </span>
          </a>

          <a
            href={`tel:${safety.emergencyNumbers.fire}`}
            className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-center hover:bg-amber-500/20 transition-all flex flex-col items-center justify-center space-y-1 group"
          >
            <AlertTriangle className="h-6 w-6 text-amber-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-bold text-slate-400 uppercase">Bomberos</span>
            <span className="font-heading text-2xl font-black text-amber-400">
              {safety.emergencyNumbers.fire}
            </span>
          </a>
        </div>
      )}

      {/* Common Scams and Embassy Directory */}
      {safety && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Common Scams */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl space-y-3">
            <h3 className="font-heading text-lg font-bold text-amber-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Estafas y Timos Frecuentes en {safety.countryName}</span>
            </h3>
            <p className="text-xs text-slate-400">
              Conócelos de antemano para viajar prevenido y evitar cargos abusivos
            </p>

            <div className="space-y-2 pt-2">
              {safety.commonScams.map((scam, i) => (
                <div key={i} className="rounded-2xl bg-slate-950 p-3.5 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  ⚠️ {scam}
                </div>
              ))}
            </div>
          </div>

          {/* Embassies Directory */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl space-y-3">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-cyan-400" />
              <span>Embajadas y Consulados Oficiales</span>
            </h3>
            <p className="text-xs text-slate-400">
              En caso de pérdida o robo de pasaporte o detención policial
            </p>

            <div className="space-y-3 pt-2">
              {safety.embassies.map((emb, i) => (
                <div key={i} className="rounded-2xl bg-slate-950 p-4 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">
                      Embajada de {emb.country} ({emb.city})
                    </span>
                    <a
                      href={`tel:${emb.phone}`}
                      className="rounded-lg bg-cyan-600/20 px-2 py-1 text-cyan-400 font-bold"
                    >
                      {emb.phone}
                    </a>
                  </div>
                  <p className="text-slate-400 text-[11px]">{emb.address}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
