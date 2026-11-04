import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Zap,
  Users,
  Shield,
  HelpCircle,
  Clock,
  ArrowRight,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserTier } from '../../types';

export const PricingView: React.FC = () => {
  const { user, updateUserTier, setIsUpgradeModalOpen } = useAuth();
  const { formatMoney } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const tiers = [
    {
      id: 'free' as UserTier,
      name: 'VOYA Free',
      tagline: 'Para explorar y dar los primeros pasos',
      monthlyPrice: 0,
      yearlyPrice: 0,
      badge: 'Básico',
      features: [
        'Exploración de destinos de todo el mundo',
        'Buscador multimodal de vuelos y trenes',
        'Mapas interactivos online',
        'Hasta 2 itinerarios básicos con IA al mes',
        'Traductor de texto esencial',
        'Seguridad y emergencias SOS básicas'
      ],
      notIncluded: [
        'Traducción de menús por cámara',
        'Alertas de bajada de precio',
        'Mapas y rutas 100% offline',
        'Asistente personal 24/7 sin límite'
      ],
      btnText: 'Plan Actual Gratuito',
      accent: 'border-slate-800 bg-slate-900/60'
    },
    {
      id: 'plus' as UserTier,
      name: 'VOYA Plus',
      tagline: 'Para quienes viajan 2 o más veces al año',
      monthlyPrice: 4.99,
      yearlyPrice: 39.99,
      badge: 'Más Popular',
      features: [
        'Todo lo de VOYA Free sin publicidad',
        'Itinerarios ilimitados día a día con IA',
        'Alertas de bajada de precios en transporte',
        'Traductor de frases offline descargable',
        'Bolsa de gastos y división entre amigos',
        'Descuentos exclusivos en negocios locales'
      ],
      notIncluded: [
        'Asistente VIP prioritario',
        'Mapas 3D topográficos offline',
        'Perfiles familiares'
      ],
      btnText: 'Activar VOYA Plus',
      accent: 'border-cyan-500/80 bg-cyan-950/20 shadow-xl shadow-cyan-500/10'
    },
    {
      id: 'premium' as UserTier,
      name: 'VOYA Pro',
      tagline: 'La superapp completa para viajeros del mundo',
      monthlyPrice: 9.99,
      yearlyPrice: 79.99,
      badge: 'Recomendado',
      features: [
        'Todo lo de VOYA Plus',
        'Asistente Inteligente Concierge 24/7 ilimitado',
        'Mapas, rutas y POIs 100% offline',
        'Traducción de menús y carteles con cámara',
        'Seguros de viaje integrados y tarjeta digital',
        'Soporte prioritario ante incidencias aéreas'
      ],
      notIncluded: [
        'Perfiles familiares múltiples'
      ],
      btnText: 'Activar VOYA Pro',
      accent: 'border-amber-500/80 bg-amber-950/20 shadow-xl shadow-amber-500/10'
    },
    {
      id: 'family' as UserTier,
      name: 'VOYA Family',
      tagline: 'Hasta 5 perfiles para familias o grupos de amigos',
      monthlyPrice: 14.99,
      yearlyPrice: 119.99,
      badge: '5 Viajeros',
      features: [
        'Todas las funciones Premium para 5 cuentas',
        'Planificador compartido con votaciones de actividades',
        'Bolsa común de gastos familiares',
        'Localización y botón SOS familiar seguro',
        'Listas de equipaje adaptadas para niños',
        'Atención técnica VIP telefónica'
      ],
      notIncluded: [],
      btnText: 'Activar VOYA Family',
      accent: 'border-emerald-500/80 bg-emerald-950/20 shadow-xl shadow-emerald-500/10'
    },
    {
      id: 'business' as UserTier,
      name: 'VOYA Business SaaS',
      tagline: 'Para agencias de viaje, DMC y guías profesionales',
      monthlyPrice: 29.99,
      yearlyPrice: 249.99,
      badge: 'B2B Agency',
      features: [
        'Acceso al gestor de leads cualificados de viajeros',
        'Generador de presupuestos con margen comercial y PDF de marca',
        'Comisión reducida al 3% en reservas turísticas',
        'Nexus B2B Agent de IA para asesoría de negocio 24/7',
        'CRM de clientes y panel de estados en vivo',
        'Cobro integrado vía Stripe Connect B2B'
      ],
      notIncluded: [],
      btnText: 'Activar Plan Business',
      accent: 'border-indigo-500/80 bg-indigo-950/20 shadow-xl shadow-indigo-500/10'
    }
  ];

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>PLANES TRANSPARENTES SIN PERMANENCIA</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-white">
          Suscripciones & Planes VOYA
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Invierte en viajar mejor, ahorrar en billetes y tener siempre a tu lado al asistente de viaje más avanzado del mundo
        </p>

        {/* Toggle Monthly / Yearly */}
        <div className="pt-2">
          <div className="inline-flex items-center rounded-2xl bg-slate-900 p-1 border border-slate-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Anual (Hasta 35% descuento)
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {tiers.map((t) => {
          const isCurrent = user?.tier === t.id;
          const price = billingCycle === 'monthly' ? t.monthlyPrice : t.yearlyPrice;
          const period = billingCycle === 'monthly' ? '/mes' : '/año';

          return (
            <div
              key={t.id}
              className={`relative flex flex-col justify-between rounded-3xl border p-6 backdrop-blur-xl transition-all hover:scale-[1.01] ${t.accent}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-lg font-bold text-white">
                    {t.name}
                  </span>
                  <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-300">
                    {t.badge}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400 min-h-[32px]">{t.tagline}</p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-heading text-3xl font-black text-white">
                    {formatMoney(price)}
                  </span>
                  {t.monthlyPrice > 0 && (
                    <span className="text-xs text-slate-400">{period}</span>
                  )}
                </div>

                {/* Features List */}
                <div className="mt-6 space-y-2.5 border-t border-slate-800/80 pt-4 text-xs">
                  {t.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-200">
                      <Check className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                  {t.notIncluded.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-600 line-through">
                      <span className="h-4 w-4 shrink-0 text-center font-bold">✕</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/60">
                <button
                  disabled={isCurrent}
                  onClick={() => {
                    if (t.id === 'free') return;
                    updateUserTier(t.id);
                  }}
                  className={`w-full rounded-2xl py-2.5 text-xs font-bold transition-all ${
                    isCurrent
                      ? 'border border-slate-800 bg-slate-800/50 text-slate-400 cursor-default'
                      : t.id === 'business'
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30 hover:opacity-95 cursor-pointer'
                      : t.id === 'premium'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20 hover:opacity-95 cursor-pointer'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:opacity-95 cursor-pointer'
                  }`}
                >
                  {isCurrent ? 'Tu Plan Actual' : t.btnText}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ or Assurance */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
        <h3 className="font-heading text-lg font-bold text-white mb-3">
          Garantía VOYA
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <Shield className="h-5 w-5 text-cyan-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Sin compromiso de permanencia</p>
              <p className="text-slate-400 mt-0.5">Cancela tu suscripción en cualquier momento con un solo clic desde tu perfil.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Clock className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Garantía de reembolso de 14 días</p>
              <p className="text-slate-400 mt-0.5">Si no ahorras más de lo que cuesta la cuota en tu primer viaje, te devolvemos el 100%.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <HelpCircle className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Soporte y factura profesional</p>
              <p className="text-slate-400 mt-0.5">Generamos facturas deducibles para empresas, agencias y autónomos con CIF/NIF.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
