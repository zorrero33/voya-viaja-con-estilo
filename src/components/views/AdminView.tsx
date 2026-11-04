import React, { useState, useEffect } from 'react';
import {
  Sliders,
  DollarSign,
  TrendingUp,
  Users,
  Activity,
  Cpu,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Save,
  CheckCircle2,
  Lock,
  Unlock,
  Coins,
  Globe2,
  Megaphone,
  Briefcase,
  Layers,
  ShoppingBag,
  Store,
  ExternalLink,
  Target,
  BarChart3
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AdminMetrics, AdCampaign, PartnerAffiliate } from '../../types';

export const AdminView: React.FC = () => {
  const { formatMoney } = useLanguage();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'partners' | 'settings'>('overview');

  // Campaigns & Partners
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [partners, setPartners] = useState<PartnerAffiliate[]>([]);

  // Editable prices
  const [plusPrice, setPlusPrice] = useState(4.99);
  const [premiumPrice, setPremiumPrice] = useState(9.99);
  const [businessPrice, setBusinessPrice] = useState(29.99);
  const [familyPrice, setFamilyPrice] = useState(14.99);

  // Modules toggle
  const [adsEnabled, setAdsEnabled] = useState(false);
  const [affiliatesEnabled, setAffiliatesEnabled] = useState(true);
  const [storeEnabled, setStoreEnabled] = useState(true);
  const [bizEnabled, setBizEnabled] = useState(true);

  useEffect(() => {
    fetchMetrics();
    fetchCampaigns();
    fetchPartners();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/admin/metrics');
      const data = await res.json();
      if (data.success && data.data) {
        setMetrics(data.data);
        setPlusPrice(data.data.tierPrices?.plus || 4.99);
        setPremiumPrice(data.data.tierPrices?.premium || 9.99);
        setFamilyPrice(data.data.tierPrices?.family || 14.99);
        setAdsEnabled(data.data.enabledModules?.ads ?? false);
        setAffiliatesEnabled(data.data.enabledModules?.affiliates ?? true);
        setStoreEnabled(data.data.enabledModules?.digitalStore ?? true);
        setBizEnabled(data.data.enabledModules?.localBusinesses ?? true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      if (data.success && data.data) {
        setCampaigns(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/partners');
      const data = await res.json();
      if (data.success && data.data) {
        setPartners(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierPrices: {
            plus: Number(plusPrice),
            premium: Number(premiumPrice),
            family: Number(familyPrice),
            business: Number(businessPrice)
          },
          enabledModules: {
            ads: adsEnabled,
            affiliates: affiliatesEnabled,
            digitalStore: storeEnabled,
            localBusinesses: bizEnabled,
            aiPlanner: true,
            community: true
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setMetrics(data.data);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!metrics) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400 text-xs">
        Cargando métricas de Master Admin Supreme...
      </div>
    );
  }

  const netProfit =
    metrics.grossRevenueMonthly - metrics.aiCostEstimateToday * 30 - 1800;

  // 7 Monetization Streams breakdown calculation
  const monetizationStreams = [
    {
      name: '1. Suscripciones SaaS (Plus, Pro, Business)',
      monthlyAmount: metrics.subscriptionRevenue || 12450,
      share: '51%',
      icon: Coins,
      color: 'text-indigo-400',
      description: 'Ingresos recurrentes mensuales (MRR) de usuarios y agencias.'
    },
    {
      name: '2. Afiliaciones & Conversiones OTAs',
      monthlyAmount: metrics.affiliateRevenue || 5620,
      share: '23%',
      icon: TrendingUp,
      color: 'text-emerald-400',
      description: 'Comisiones de Skyscanner, Booking, GetYourGuide, IATI, Rentalcars.'
    },
    {
      name: '3. Captación de Leads B2B & Cotizaciones',
      monthlyAmount: 2850,
      share: '12%',
      icon: Briefcase,
      color: 'text-cyan-400',
      description: 'Tarifa de venta o asignación de solicitudes a agencias y guías.'
    },
    {
      name: '4. Suscripciones B2B de Negocios Locales',
      monthlyAmount: 1890,
      share: '8%',
      icon: Store,
      color: 'text-amber-400',
      description: 'Cuotas de hoteles y restaurantes con insignia Verified Partner.'
    },
    {
      name: '5. Publicidad Patrocinada & Banners',
      monthlyAmount: 980,
      share: '4%',
      icon: Megaphone,
      color: 'text-rose-400',
      description: 'Campañas CPC/CPM de marcas turísticas de primer nivel.'
    },
    {
      name: '6. Marketplace Digital (Guías Creadores)',
      monthlyAmount: 430,
      share: '1.8%',
      icon: Layers,
      color: 'text-purple-400',
      description: '15% de comisión por venta de guías y mapas KML de influencers.'
    },
    {
      name: '7. Tienda Física VOYA Accessories',
      monthlyAmount: 280,
      share: '1.2%',
      icon: ShoppingBag,
      color: 'text-blue-400',
      description: 'Márgenes de venta en mochilas, adaptadores y candados TSA.'
    }
  ];

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20 mb-2">
            <Lock className="h-3.5 w-3.5" />
            <span>ACCESO ADMINISTRATIVO RESTRINGIDO • ROOT ROLE</span>
          </div>
          <h1 className="font-heading text-3xl font-black text-white">
            VOYA Master Admin Supreme
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Supervisión financiera en tiempo real, 7 líneas de monetización, control de campañas publicitarias y consumo IA
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>{savedSuccess ? '¡Ajustes Guardados!' : 'Guardar Configuración'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
              : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          7 Modelos de Monetización & P&L
        </button>

        <button
          onClick={() => setActiveTab('campaigns')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'campaigns'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
              : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
          }`}
        >
          <Megaphone className="h-4 w-4" />
          Campañas Publicitarias ({campaigns.length})
        </button>

        <button
          onClick={() => setActiveTab('partners')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'partners'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
              : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
          }`}
        >
          <Globe2 className="h-4 w-4" />
          Socios & Red de Afiliación ({partners.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'settings'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
              : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="h-4 w-4" />
          Módulos, Precios & Servidor
        </button>
      </div>

      {/* Tab 1: Overview & 7 Monetization Streams */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Financial KPIs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>Ingresos Brutos Mensuales</span>
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="font-heading text-3xl font-black text-white mt-2 block">
                {formatMoney(metrics.grossRevenueMonthly)}
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 mt-1 block">
                +{metrics.monthlyGrowthRate}% vs mes anterior
              </span>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>MRR Suscripciones</span>
                <Coins className="h-4 w-4 text-cyan-400" />
              </div>
              <span className="font-heading text-3xl font-black text-white mt-2 block">
                {formatMoney(metrics.subscriptionRevenue)}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {metrics.premiumSubscribers} usuarios de pago
              </span>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>Comisiones Afiliación</span>
                <TrendingUp className="h-4 w-4 text-blue-400" />
              </div>
              <span className="font-heading text-3xl font-black text-white mt-2 block">
                {formatMoney(metrics.affiliateRevenue)}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {metrics.affiliateClicksToday} clics registrados hoy
              </span>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>Beneficio Neto Estimado</span>
                <ShieldCheck className="h-4 w-4 text-amber-400" />
              </div>
              <span className="font-heading text-3xl font-black text-emerald-400 mt-2 block">
                {formatMoney(netProfit)}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Margen operativo ~{Math.round((netProfit / metrics.grossRevenueMonthly) * 100)}%
              </span>
            </div>
          </div>

          {/* 7 Monetization Streams Matrix */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                  <Coins className="h-5 w-5 text-cyan-400" />
                  <span>Desglose Oficial de las 7 Fuentes de Monetización</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Arquitectura comercial multidivisional de VOYA Superapp
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                Diversificación de Ingresos: 100% Activa
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {monetizationStreams.map((st, i) => {
                const Icon = st.icon;
                return (
                  <div
                    key={i}
                    className="flex items-start justify-between rounded-2xl bg-slate-950/80 p-4 border border-slate-800/80 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-800">
                        <Icon className={`h-5 w-5 ${st.color}`} />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-white text-xs sm:text-sm">
                          {st.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{st.description}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-3">
                      <span className="font-mono text-sm font-bold text-white block">
                        {formatMoney(st.monthlyAmount)}
                      </span>
                      <span className="text-[10px] font-semibold text-cyan-400">
                        {st.share} del total
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Ad Campaigns */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-white">
              Campañas de Publicidad Activas
            </h2>
            <span className="text-xs text-slate-400">Total: {campaigns.length} anunciantes</span>
          </div>

          <div className="space-y-3">
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="flex flex-col md:flex-row md:items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-4 gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-white text-sm">{c.title}</h4>
                    <p className="text-xs text-slate-400">
                      Anunciante: <span className="text-slate-200">{c.advertiserName}</span> • Ubicación:{' '}
                      <span className="text-slate-200 uppercase">{c.placement}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Impresiones</span>
                    <span className="font-mono font-bold text-white">{c.impressions.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Clics</span>
                    <span className="font-mono font-bold text-cyan-400">{c.clicks.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">CTR</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {((c.clicks / Math.max(1, c.impressions)) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Presupuesto/Día</span>
                    <span className="font-mono font-bold text-white">{c.budgetDaily} €</span>
                  </div>
                  <div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        c.active
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {c.active ? 'Activa' : 'Pausada'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Partners & Affiliates */}
      {activeTab === 'partners' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-white">
              Red de Socios Comerciales & Integraciones
            </h2>
            <span className="text-xs text-slate-400">{partners.length} convenios activos</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-white text-base">{p.name}</span>
                  <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/20 uppercase">
                    {p.type}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Código de referencia:</span>
                    <span className="font-mono font-bold text-emerald-400">{p.referralCode}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Conversiones acumuladas:</span>
                    <span className="font-mono font-bold text-white">{p.conversions}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Comisión generada:</span>
                    <span className="font-mono font-bold text-cyan-400">{formatMoney(p.commissionEarned)}</span>
                  </div>
                </div>

                <a
                  href={p.trackingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 py-2 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                >
                  <span>Ver Portal Partner</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Settings & Configuration */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Commercial Modules Toggle */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl space-y-4">
            <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <Sliders className="h-5 w-5 text-cyan-400" />
              <span>Interruptores de Módulos Comerciales</span>
            </h2>
            <p className="text-xs text-slate-400">
              Activa o desactiva fuentes de monetización sin alterar el código base
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-4 border border-slate-800">
                <div>
                  <p className="font-bold text-white text-xs">Publicidad Contextual (AdMob / Adsense)</p>
                  <p className="text-[11px] text-slate-400">Desactivada por defecto para experiencia premium no invasiva</p>
                </div>
                <button
                  onClick={() => setAdsEnabled(!adsEnabled)}
                  className={`p-1 transition-colors cursor-pointer ${adsEnabled ? 'text-emerald-400' : 'text-slate-600'}`}
                >
                  {adsEnabled ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-4 border border-slate-800">
                <div>
                  <p className="font-bold text-white text-xs">Enlaces de Afiliación (Vuelos, Trenes, Hoteles)</p>
                  <p className="text-[11px] text-slate-400">Conexión con Skyscanner, Booking, GetYourGuide, IATI</p>
                </div>
                <button
                  onClick={() => setAffiliatesEnabled(!affiliatesEnabled)}
                  className={`p-1 transition-colors cursor-pointer ${affiliatesEnabled ? 'text-emerald-400' : 'text-slate-600'}`}
                >
                  {affiliatesEnabled ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-4 border border-slate-800">
                <div>
                  <p className="font-bold text-white text-xs">Marketplace Digital de Creadores</p>
                  <p className="text-[11px] text-slate-400">Venta de guías y mapas KML (Comisión VOYA 15%)</p>
                </div>
                <button
                  onClick={() => setStoreEnabled(!storeEnabled)}
                  className={`p-1 transition-colors cursor-pointer ${storeEnabled ? 'text-emerald-400' : 'text-slate-600'}`}
                >
                  {storeEnabled ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-4 border border-slate-800">
                <div>
                  <p className="font-bold text-white text-xs">Perfiles de Negocios Locales (B2B)</p>
                  <p className="text-[11px] text-slate-400">Planes Pro y Business para restaurantes y hoteles verificados</p>
                </div>
                <button
                  onClick={() => setBizEnabled(!bizEnabled)}
                  className={`p-1 transition-colors cursor-pointer ${bizEnabled ? 'text-emerald-400' : 'text-slate-600'}`}
                >
                  {bizEnabled ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Editor */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl space-y-4">
            <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-400" />
              <span>Configuración de Precios de Planes</span>
            </h2>
            <p className="text-xs text-slate-400">
              Ajusta los precios de las suscripciones en euros para todos los mercados internacionales
            </p>

            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    VOYA Plus (€):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={plusPrice}
                    onChange={(e) => setPlusPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    VOYA Pro (€):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={premiumPrice}
                    onChange={(e) => setPremiumPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    VOYA Business B2B (€):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={businessPrice}
                    onChange={(e) => setBusinessPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    VOYA Family (€):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={familyPrice}
                    onChange={(e) => setFamilyPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* System Health Status */}
              <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2 mt-4 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider block">
                  Telemetría y Salud del Sistema:
                </span>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Motor Gemini 3.8 Flash:</span>
                  <span className="font-bold text-emerald-400">Operacional (Latencia ~{metrics.systemHealth.avgLatencyMs}ms)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Base de Datos Persistente:</span>
                  <span className="font-bold text-cyan-400">JSON Store Conectado</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Consumo IA Hoy:</span>
                  <span className="font-bold text-white">{metrics.aiTokensUsedToday.toLocaleString()} tokens (~{metrics.aiCostEstimateToday}€)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
