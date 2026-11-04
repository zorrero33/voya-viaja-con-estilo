import React, { useState, useEffect } from 'react';
import {
  Shield,
  HeartPulse,
  Luggage,
  Clock,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  Info,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { InsurancePlan } from '../../types';

export const InsuranceView: React.FC = () => {
  const { formatMoney } = useLanguage();
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/insurance')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPlans(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 mb-2">
          <Shield className="h-3.5 w-3.5" />
          <span>VOYA INSURANCE • COMPARADOR AUTORIZADO</span>
        </div>
        <h1 className="font-heading text-3xl font-black text-white">
          Seguros de Viaje con Cobertura Médica Internacional
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Asistencia sanitaria 24/7 sin adelantar dinero, repatriación incluida, cobertura COVID y seguro de cancelación
        </p>
      </div>

      {/* Plans Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl transition-all hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 space-y-6"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  {p.provider}
                </span>
                <span className="rounded-full bg-slate-800 px-3 py-0.5 text-[10px] font-bold text-slate-300 uppercase">
                  Nivel {p.tier}
                </span>
              </div>

              <h3 className="font-heading text-2xl font-black text-white">
                {p.name}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {p.summary}
              </p>

              {/* Coverage Highlights */}
              <div className="mt-5 space-y-2.5 border-t border-slate-800/80 pt-4 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <HeartPulse className="h-4 w-4 text-emerald-400" />
                    Gastos Médicos en el Extranjero:
                  </span>
                  <span className="font-bold text-white">{p.medicalCoverage}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <Luggage className="h-4 w-4 text-cyan-400" />
                    Pérdida o Robo de Equipaje:
                  </span>
                  <span className="font-bold text-white">{p.luggageCoverage}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400" />
                    Repatriación Sanitaria 24h:
                  </span>
                  <span className="font-bold text-emerald-400">100% Incluida</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" />
                    Deportes de Aventura y Rescate:
                  </span>
                  <span className="font-bold text-white">{p.sportsCovered ? 'Cubierto' : 'Opcional'}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="border-t border-slate-800/80 pt-4 flex items-baseline justify-between mb-4">
                <span className="text-xs text-slate-400">Tarifa estimada:</span>
                <span className="font-heading text-2xl font-black text-white">
                  {formatMoney(p.pricePerDay)} <span className="text-xs font-normal text-slate-400">/día</span>
                </span>
              </div>

              <a
                href={p.bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-xs font-bold text-slate-950 hover:opacity-95 transition-all shadow cursor-pointer"
              >
                <span>Calcular Póliza con Descuento en {p.provider}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <p className="mt-3 text-[10px] text-slate-500 leading-tight">
                {p.officialDisclosure}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
