import React, { useState } from 'react';
import { X, Check, Sparkles, Shield, Users, Zap, CheckCircle2, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserTier } from '../../types';

export const UpgradeModal: React.FC = () => {
  const { isUpgradeModalOpen, setIsUpgradeModalOpen, user, updateUserTier } = useAuth();
  const { formatMoney } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [processingTier, setProcessingTier] = useState<UserTier | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isUpgradeModalOpen) return null;

  const handleSelectTier = async (tier: UserTier) => {
    setProcessingTier(tier);
    const success = await updateUserTier(tier);
    setProcessingTier(null);
    if (success) {
      setSuccessMessage(`¡Enhorabuena! Has activado VOYA ${tier.toUpperCase()}. Disfruta de todas las ventajas.`);
      setTimeout(() => {
        setSuccessMessage(null);
        setIsUpgradeModalOpen(false);
      }, 2000);
    }
  };

  const plans = [
    {
      id: 'plus' as UserTier,
      name: 'VOYA Plus',
      badge: 'Más Popular',
      monthlyPrice: 4.99,
      yearlyPrice: 39.99,
      description: 'Para viajeros frecuentes que buscan el máximo ahorro y flexibilidad.',
      features: [
        'Sin publicidad',
        'Itinerarios ilimitados con IA',
        'Alertas de bajada de precios en vuelos y trenes',
        'Traductor offline descargable',
        'Historial de gastos y exportación PDF',
        'Descuentos exclusivos en negocios locales'
      ],
      icon: Zap,
      accent: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'premium' as UserTier,
      name: 'VOYA Pro',
      badge: 'Recomendado',
      monthlyPrice: 9.99,
      yearlyPrice: 79.99,
      description: 'Experiencia integral VIP con soporte prioritario y herramientas avanzadas.',
      features: [
        'Todo lo de Voya Plus',
        'Asistente IA Concierge 24/7 sin límite',
        'Mapas y rutas 100% offline sin conexión',
        'Traducción de voz y menús por cámara ilimitada',
        'Generador de documentos y seguros de viaje',
        'Acceso prioritario a guías de creadores'
      ],
      icon: Sparkles,
      accent: 'from-amber-500 to-orange-600'
    },
    {
      id: 'family' as UserTier,
      name: 'VOYA Family',
      badge: 'Hasta 5 perfiles',
      monthlyPrice: 14.99,
      yearlyPrice: 119.99,
      description: 'La solución definitiva para familias y grupos de amigos que viajan juntos.',
      features: [
        'Todo lo de Voya Pro para 5 usuarios',
        'Planificador conjunto y votaciones de ruta',
        'Bolsa de gastos compartidos con división en vivo',
        'Rastreo seguro familiar y botón SOS coordinado',
        'Listas de equipaje colaborativas para niños y adultos',
        'Soporte técnico VIP dedicado'
      ],
      icon: Users,
      accent: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'business' as UserTier,
      name: 'VOYA Business',
      badge: 'B2B Agencias',
      monthlyPrice: 29.99,
      yearlyPrice: 249.99,
      description: 'Plataforma profesional para agencias de viaje, guías locales y DMC.',
      features: [
        'Gestión de leads y viajeros cualificados',
        'Generador de cotizaciones con PDF de marca',
        'Comisión reducida al 3% en reservas',
        'Agente Nexus B2B de IA 24/7',
        'CRM de clientes y cobros directos Stripe'
      ],
      icon: Building2,
      accent: 'from-indigo-600 to-blue-600'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={() => setIsUpgradeModalOpen(false)}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>SUSCRIPCIÓN VOYA ULTIMATE</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Desbloquea el Poder Total de VOYA
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Viaja con tranquilidad, ahorra cientos de euros en cada viaje y disfruta de todas las funciones sin restricciones.
          </p>

          {/* Toggle Monthly / Yearly */}
          <div className="mt-6 inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Facturación Mensual
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Anual (Ahorra hasta 35%)</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 p-4 text-emerald-300">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-400" />
            <p className="text-sm font-semibold">{successMessage}</p>
          </div>
        )}

        {/* Plans Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((p) => {
            const Icon = p.icon;
            const price = billingCycle === 'monthly' ? p.monthlyPrice : (p.yearlyPrice / 12);
            const isCurrent = user?.tier === p.id;
            const isProcessing = processingTier === p.id;

            return (
              <div
                key={p.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                  isCurrent
                    ? 'border-cyan-500/80 bg-cyan-950/20 shadow-lg shadow-cyan-500/10'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {p.name}
                    </span>
                    <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-300">
                      {p.badge}
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-heading text-2xl font-black text-white">
                      {formatMoney(price)}
                    </span>
                    <span className="text-xs text-slate-400">/mes</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-[10px] text-cyan-400 font-medium">
                      {formatMoney(p.yearlyPrice)}/año
                    </p>
                  )}

                  <p className="mt-2 text-xs text-slate-400 leading-relaxed min-h-[32px]">
                    {p.description}
                  </p>

                  <div className="mt-4 space-y-2">
                    {p.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400 mt-0.5" />
                        <span className="text-[11px]">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-cyan-300 border border-cyan-500/30"
                    >
                      Plan Actual Activo
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectTier(p.id)}
                      disabled={isProcessing}
                      className={`w-full rounded-xl bg-gradient-to-r ${p.accent} py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-95 transition-all`}
                    >
                      {isProcessing ? 'Procesando...' : `Activar ${p.name}`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Security and Guarantee footer */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 border-t border-slate-800 pt-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>Pago seguro encriptado SSL</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-cyan-400" />
            <span>Cancela en cualquier momento sin penalización</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Acceso instantáneo tras confirmación</span>
          </div>
        </div>
      </div>
    </div>
  );
};
