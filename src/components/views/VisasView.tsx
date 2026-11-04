import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Calendar,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  Clock,
  Coins,
  Shield,
  Info,
  Globe2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { VisaRequirement } from '../../types';

export const VisasView: React.FC = () => {
  const { formatMoney } = useLanguage();
  const [visas, setVisas] = useState<VisaRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [originCountry, setOriginCountry] = useState('ES');
  const [destCountry, setDestCountry] = useState('ALL');

  useEffect(() => {
    fetch('/api/visas')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVisas(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredVisas = visas.filter((v) => {
    if (destCountry !== 'ALL' && v.destinationCountryCode !== destCountry) return false;
    return true;
  });

  const getBadgeType = (type: string) => {
    switch (type) {
      case 'visa_free':
        return { label: 'Sin Visado (Exención Turística)', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'eta':
        return { label: 'Autorización Electrónica (ESTA / ETA)', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
      case 'evisa':
        return { label: 'e-Visa Online', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
      case 'visa_on_arrival':
        return { label: 'Visado a la Llegada', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      default:
        return { label: 'Visado Consular Previo', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20 mb-2">
          <FileCheck2 className="h-3.5 w-3.5" />
          <span>VOYA VISA & DOCUMENTS CHECKER</span>
        </div>
        <h1 className="font-heading text-3xl font-black text-white">
          Requisitos de Visados y Documentos Oficiales
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Comprueba la documentación exigida según tu nacionalidad: regla de los 6 meses del pasaporte, formularios ESTA y tasas consulares
        </p>
      </div>

      {/* Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Mi Nacionalidad / Pasaporte:
            </label>
            <select
              value={originCountry}
              onChange={(e) => setOriginCountry(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none"
            >
              <option value="ES">🇪🇸 España (Unión Europea)</option>
              <option value="US">🇺🇸 Estados Unidos</option>
              <option value="MX">🇲🇽 México</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              País de Destino:
            </label>
            <select
              value={destCountry}
              onChange={(e) => setDestCountry(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-bold text-cyan-400 focus:outline-none"
            >
              <option value="ALL">Todos los Destinos</option>
              <option value="JP">🇯🇵 Japón</option>
              <option value="US">🇺🇸 Estados Unidos</option>
              <option value="MA">🇲🇦 Marruecos</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Info className="h-4 w-4 text-cyan-400" />
          <span>Datos contrastados con IATA y embajadas oficiales</span>
        </div>
      </div>

      {/* Visas Grid */}
      <div className="space-y-4">
        {filteredVisas.map((v) => {
          const badge = getBadgeType(v.requirementType);
          return (
            <div
              key={v.id}
              className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4 transition-all hover:border-slate-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-heading text-xl font-bold text-white">
                    {v.originCountry} ➔ {v.destinationCountry}
                  </span>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold border ${badge.color}`}>
                  {badge.label}
                </span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="rounded-2xl bg-slate-950 p-3 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Estancia Máxima</span>
                  <span className="font-bold text-white text-sm">{v.maxStayDays} días</span>
                </div>
                <div className="rounded-2xl bg-slate-950 p-3 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Validez Pasaporte</span>
                  <span className="font-bold text-white text-sm">Mínimo {v.passportValidityMonths} meses</span>
                </div>
                <div className="rounded-2xl bg-slate-950 p-3 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Tasa Estimada</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {v.feeEstimated === 0 ? 'Gratuito' : formatMoney(v.feeEstimated)}
                  </span>
                </div>
                <div className="rounded-2xl bg-slate-950 p-3 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Tiempo Trámite</span>
                  <span className="font-bold text-cyan-400 text-sm">
                    {v.processingTimeDays === 0 ? 'Inmediato' : `~${v.processingTimeDays} días`}
                  </span>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <span className="font-bold text-white block">Documentos obligatorios para embarcar:</span>
                {v.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-400 italic">
                ℹ️ {v.notes} (Última verificación consular: {v.lastVerifiedDate})
              </p>

              <div className="pt-2">
                <a
                  href={v.officialEmbassyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-slate-700 transition-colors"
                >
                  <span>Portal Oficial del Gobierno</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
