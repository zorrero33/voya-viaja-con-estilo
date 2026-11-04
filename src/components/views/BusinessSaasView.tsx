import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Briefcase,
  FileText,
  DollarSign,
  TrendingUp,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Plus,
  Send,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Mail,
  Phone,
  Calculator,
  Percent,
  Layers,
  Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LeadItem } from '../../types';

export const BusinessSaasView: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'leads' | 'crm' | 'quote' | 'plans'>('leads');
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [leadFilter, setLeadFilter] = useState<'all' | 'new' | 'assigned' | 'contacted'>('all');
  const [leadSearch, setLeadSearch] = useState('');

  // Quote Generator State
  const [quoteClient, setQuoteClient] = useState('');
  const [quoteDestination, setQuoteDestination] = useState('');
  const [quotePax, setQuotePax] = useState(2);
  const [quoteDays, setQuoteDays] = useState(5);
  const [flightCost, setFlightCost] = useState(600);
  const [hotelCost, setHotelCost] = useState(800);
  const [activitiesCost, setActivitiesCost] = useState(350);
  const [marginPct, setMarginPct] = useState(15);
  const [quoteGenerated, setQuoteGenerated] = useState<any | null>(null);

  // New Lead Form State
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    travelerName: '',
    travelerEmail: '',
    destination: '',
    budgetTotal: 2500,
    travelersCount: 2,
    dates: 'Próximo mes',
    tripType: 'Vacaciones de relax',
    notes: ''
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.success && data.data) {
        setLeads(data.data);
      }
    } catch (e) {
      console.error('Error fetching leads:', e);
    } finally {
      setLoadingLeads(false);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLeadForm)
      });
      const data = await res.json();
      if (data.success) {
        setLeads(prev => [data.data, ...prev]);
        setShowNewLeadModal(false);
        setNewLeadForm({
          travelerName: '',
          travelerEmail: '',
          destination: '',
          budgetTotal: 2500,
          travelersCount: 2,
          dates: 'Próximo mes',
          tripType: 'Vacaciones de relax',
          notes: ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCalculateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const netCost = flightCost + hotelCost + activitiesCost;
    const marginAmount = (netCost * marginPct) / 100;
    const totalQuote = netCost + marginAmount;
    const perPerson = totalQuote / Math.max(1, quotePax);

    setQuoteGenerated({
      id: `PROP-${Date.now().toString().slice(-5)}`,
      client: quoteClient || 'Viajero Preferente',
      destination: quoteDestination || 'Destino Internacional',
      pax: quotePax,
      days: quoteDays,
      netCost,
      marginPct,
      marginAmount,
      totalQuote,
      perPerson,
      date: new Date().toLocaleDateString()
    });
  };

  const filteredLeads = leads.filter(l => {
    const matchesFilter = leadFilter === 'all' || l.status === leadFilter;
    const matchesSearch =
      l.travelerName.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.destination.toLowerCase().includes(leadSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400">
            <Building2 className="h-3.5 w-3.5" />
            VOYA Business & SaaS Platform
          </div>
          <h1 className="mt-2 font-heading text-3xl font-extrabold text-white md:text-4xl">
            Portal B2B para Agencias y Guías
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Gestiona solicitudes de viajeros cualificados, calcula presupuestos con margen garantizado y expande tu negocio turístico con VOYA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewLeadModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-blue-500 transition-all"
          >
            <Plus className="h-4 w-4" />
            Capturar Nuevo Viajero
          </button>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Leads Activos</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-white">{leads.length}</p>
          <span className="text-[11px] font-medium text-emerald-400">✓ Listos para cotización</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Volumen Negocio</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-white">
            {leads.reduce((acc, l) => acc + (l.budgetTotal || 0), 0).toLocaleString()} €
          </p>
          <span className="text-[11px] font-medium text-slate-400">Presupuesto demandado</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Tasa Conversión</span>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-white">32.4%</p>
          <span className="text-[11px] font-medium text-cyan-400">+4.1% este mes</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Plan Agencia</span>
            <Crown className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-white">VOYA Business</p>
          <span className="text-[11px] font-medium text-amber-400">Acceso CRM ilimitado</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('leads')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeTab === 'leads'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'border border-slate-800 bg-slate-900/70 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          Gestor de Leads Turísticos ({leads.length})
        </button>

        <button
          onClick={() => setActiveTab('quote')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeTab === 'quote'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'border border-slate-800 bg-slate-900/70 text-slate-400 hover:text-white'
          }`}
        >
          <Calculator className="h-4 w-4" />
          Generador de Presupuestos & Margen
        </button>

        <button
          onClick={() => setActiveTab('crm')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeTab === 'crm'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'border border-slate-800 bg-slate-900/70 text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          CRM de Clientes & Estados
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeTab === 'plans'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'border border-slate-800 bg-slate-900/70 text-slate-400 hover:text-white'
          }`}
        >
          <Crown className="h-4 w-4" />
          Planes B2B & Licencias SaaS
        </button>
      </div>

      {/* Tab 1: Leads Management */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por viajero, destino o notas..."
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              {(['all', 'new', 'assigned', 'contacted'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setLeadFilter(filter)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                    leadFilter === filter
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter === 'all' ? 'Todos' : filter === 'new' ? 'Nuevos' : filter === 'assigned' ? 'Asignados' : 'Contactados'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Leads List */}
            <div className="lg:col-span-2 space-y-3">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`group relative cursor-pointer rounded-2xl border p-4 transition-all ${
                    selectedLead?.id === lead.id
                      ? 'border-indigo-500 bg-indigo-950/20 shadow-lg shadow-indigo-950/40'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-white text-base">
                          {lead.travelerName}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            lead.status === 'new'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : lead.status === 'assigned'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {lead.status === 'new' ? 'Nuevo' : lead.status === 'assigned' ? 'Asignado' : 'Contactado'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400 flex items-center gap-1.5">
                        <span>Destino solicitado:</span>
                        <span className="font-semibold text-slate-200">{lead.destination}</span>
                        <span>•</span>
                        <span>{lead.travelersCount} viajeros</span>
                        <span>•</span>
                        <span>{lead.dates}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Presupuesto</span>
                      <span className="font-mono text-lg font-bold text-emerald-400">
                        {lead.budgetTotal.toLocaleString()} €
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 rounded-xl bg-slate-950/60 p-2.5 text-xs text-slate-300 italic border border-slate-800/60">
                    "{lead.notes}"
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/60 pt-2.5">
                    <span>Captado: {lead.createdDate}</span>
                    <span className="font-semibold text-indigo-400 group-hover:underline flex items-center gap-1">
                      Ver Ficha Técnica <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))}

              {filteredLeads.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
                  <p className="text-sm text-slate-400">No se encontraron leads con los filtros seleccionados.</p>
                </div>
              )}
            </div>

            {/* Selected Lead Details Sidebar */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md h-fit space-y-5">
              {selectedLead ? (
                <>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-heading font-bold text-white text-base">Ficha del Viajero</h3>
                    <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/30">
                      ID: {selectedLead.id}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[11px] uppercase font-bold text-slate-500">Nombre & Contacto</span>
                      <p className="text-sm font-semibold text-white">{selectedLead.travelerName}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Mail className="h-3 w-3 text-slate-500" />
                        {selectedLead.travelerEmail}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
                        <span className="text-slate-500 block text-[10px] uppercase">Destino</span>
                        <span className="font-bold text-slate-200">{selectedLead.destination}</span>
                      </div>
                      <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
                        <span className="text-slate-500 block text-[10px] uppercase">Personas</span>
                        <span className="font-bold text-slate-200">{selectedLead.travelersCount} pax</span>
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Presupuesto del cliente:</span>
                        <span className="font-bold text-emerald-400">{selectedLead.budgetTotal} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Comisión estimada (15%):</span>
                        <span className="font-bold text-cyan-400">
                          {Math.round(selectedLead.budgetTotal * 0.15)} €
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tipo de viaje:</span>
                        <span className="font-bold text-slate-200">{selectedLead.tripType}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase font-bold text-slate-500">Notas & Requisitos</span>
                      <p className="mt-1 text-xs text-slate-300 rounded-xl bg-slate-950/80 p-3 border border-slate-800/80">
                        {selectedLead.notes}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setQuoteClient(selectedLead.travelerName);
                          setQuoteDestination(selectedLead.destination);
                          setQuotePax(selectedLead.travelersCount);
                          setActiveTab('quote');
                        }}
                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
                      >
                        <Calculator className="h-4 w-4" />
                        Crear Presupuesto a Medida
                      </button>

                      <a
                        href={`mailto:${selectedLead.travelerEmail}?subject=Propuesta de viaje a ${selectedLead.destination} - VOYA Partner`}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
                      >
                        <Mail className="h-4 w-4" />
                        Contactar Directamente
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center">
                  <Users className="mx-auto h-8 w-8 text-slate-600" />
                  <p className="mt-2 text-xs text-slate-400">
                    Selecciona un viajero para ver sus detalles de contacto y generar su cotización personalizada.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Quote Generator & Commission Calculator */}
      {activeTab === 'quote' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Inputs Form */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Calculator className="h-5 w-5 text-indigo-400" />
              <h2 className="font-heading font-bold text-white text-lg">
                Calculadora de Cotizaciones & Margen B2B
              </h2>
            </div>

            <form onSubmit={handleCalculateQuote} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400">Nombre del Cliente</label>
                  <input
                    type="text"
                    required
                    value={quoteClient}
                    onChange={(e) => setQuoteClient(e.target.value)}
                    placeholder="Ej. Laura Fernández"
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">Destino</label>
                  <input
                    type="text"
                    required
                    value={quoteDestination}
                    onChange={(e) => setQuoteDestination(e.target.value)}
                    placeholder="Ej. Kioto, Japón"
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400">Número de Pasajeros (Pax)</label>
                  <input
                    type="number"
                    min={1}
                    value={quotePax}
                    onChange={(e) => setQuotePax(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">Días de Viaje</label>
                  <input
                    type="number"
                    min={1}
                    value={quoteDays}
                    onChange={(e) => setQuoteDays(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-3 space-y-3">
                <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                  Costes Netos de Proveedor
                </span>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Vuelos / Transporte Neto:</span>
                    <span className="font-mono text-white">{flightCost} €</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={3000}
                    step={50}
                    value={flightCost}
                    onChange={(e) => setFlightCost(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Alojamiento (Hoteles / Homes) Neto:</span>
                    <span className="font-mono text-white">{hotelCost} €</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={4000}
                    step={50}
                    value={hotelCost}
                    onChange={(e) => setHotelCost(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Actividades, Tours & Seguros:</span>
                    <span className="font-mono text-white">{activitiesCost} €</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={2000}
                    step={25}
                    value={activitiesCost}
                    onChange={(e) => setActivitiesCost(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-3">
                  <div className="flex justify-between text-xs text-indigo-300 font-bold mb-1">
                    <span>Margen Comercial de tu Agencia (%):</span>
                    <span>{marginPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={40}
                    step={1}
                    value={marginPct}
                    onChange={(e) => setMarginPct(Number(e.target.value))}
                    className="w-full accent-indigo-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-blue-500 transition-all"
              >
                Generar Propuesta y Desglose Financiero
              </button>
            </form>
          </div>

          {/* Generated Quote Sheet */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md flex flex-col justify-between">
            {quoteGenerated ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      Cotización Oficial VOYA B2B
                    </span>
                    <h3 className="font-heading font-extrabold text-xl text-white">
                      {quoteGenerated.id}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Fecha</span>
                    <p className="text-xs font-semibold text-slate-200">{quoteGenerated.date}</p>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cliente titular:</span>
                    <span className="font-bold text-white">{quoteGenerated.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Destino & Duración:</span>
                    <span className="font-bold text-white">
                      {quoteGenerated.destination} ({quoteGenerated.days} días / {quoteGenerated.pax} pasajeros)
                    </span>
                  </div>
                </div>

                {/* Financial breakdown table */}
                <div className="space-y-2 border-t border-slate-800 pt-3 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Coste Neto de Proveedores:</span>
                    <span className="font-mono text-slate-200">{quoteGenerated.netCost} €</span>
                  </div>
                  <div className="flex justify-between text-indigo-400 font-semibold">
                    <span>Margen de la Agencia ({quoteGenerated.marginPct}%):</span>
                    <span className="font-mono">+{Math.round(quoteGenerated.marginAmount)} €</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-2 text-base font-extrabold text-white">
                    <span>PVP Total Recomendado:</span>
                    <span className="font-mono text-emerald-400">
                      {Math.round(quoteGenerated.totalQuote).toLocaleString()} €
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Coste por persona:</span>
                    <span className="font-mono text-slate-300">
                      {Math.round(quoteGenerated.perPerson).toLocaleString()} € / pax
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                  <span>
                    Esta propuesta incluye garantía de precio, trazabilidad de reservas VOYA y cobertura de asistencia consular.
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      alert(`Propuesta ${quoteGenerated.id} descargada como resumen en formato PDF.`);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition-all"
                  >
                    <Download className="h-4 w-4" />
                    Descargar PDF
                  </button>
                  <button
                    onClick={() => {
                      alert(`Propuesta enviada a ${quoteGenerated.client} por correo.`);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30"
                  >
                    <Send className="h-4 w-4" />
                    Enviar al Cliente
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-16 text-center text-slate-500">
                <Calculator className="h-12 w-12 text-slate-700 mb-3" />
                <h4 className="font-heading font-bold text-slate-300 text-sm">
                  Sin presupuesto calculado todavía
                </h4>
                <p className="mt-1 text-xs text-slate-500 max-w-xs">
                  Completa los parámetros en el formulario lateral y pulsa "Generar Propuesta" para calcular el PVP y descargar el desglose.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: CRM Dashboard */}
      {activeTab === 'crm' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-blue-500/20 bg-slate-900/60 p-4">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Fase 1: Nuevas Peticiones
              </span>
              <p className="mt-1 text-2xl font-black text-white">4</p>
              <p className="text-xs text-slate-400 mt-1">Viajeros esperando primera propuesta</p>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-slate-900/60 p-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Fase 2: Cotización Enviada
              </span>
              <p className="mt-1 text-2xl font-black text-white">7</p>
              <p className="text-xs text-slate-400 mt-1">En negociación de vuelos o fechas</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Fase 3: Reservas Cerradas
              </span>
              <p className="mt-1 text-2xl font-black text-white">12</p>
              <p className="text-xs text-slate-400 mt-1">Clientes viajando este mes</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="font-heading font-bold text-white text-base mb-4">
              Historial de Interacciones Recientes
            </h3>
            <div className="space-y-3">
              {[
                { client: 'Carlos Mendoza', event: 'Presupuesto Japón 12 días aceptado', time: 'Hace 2 horas', status: 'cerrado' },
                { client: 'Elena Vance', event: 'Solicitud de hotel pet-friendly en Roma', time: 'Hace 5 horas', status: 'contacto' },
                { client: 'Marco Rossi', event: 'Descargó itinerario generado por Atlas IA', time: 'Ayer', status: 'nuevo' },
                { client: 'Sophie Dupont', event: 'Pago de depósito de 450 € recibido', time: 'Hace 2 días', status: 'cerrado' },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3.5 border border-slate-800/80 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 font-bold">
                      {row.client[0]}
                    </div>
                    <div>
                      <p className="font-bold text-white">{row.client}</p>
                      <p className="text-slate-400">{row.event}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block">{row.time}</span>
                    <span className="text-emerald-400 font-semibold uppercase text-[10px]">
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Plans & Pricing */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Starter Guide</span>
              <h3 className="mt-1 font-heading text-2xl font-bold text-white">Gratuito</h3>
              <p className="mt-2 text-xs text-slate-400">Para guías locales independientes que publican hasta 3 experiencias.</p>
              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Perfil de guía verificado</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Hasta 5 leads/mes</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> 15% comisión de plataforma</li>
              </ul>
            </div>
            <button className="mt-8 w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-700">
              Plan Actual
            </button>
          </div>

          <div className="relative rounded-2xl border-2 border-indigo-500 bg-indigo-950/20 p-6 flex flex-col justify-between shadow-xl shadow-indigo-950/50">
            <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
              Más Popular B2B
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">VOYA Business Agency</span>
              <h3 className="mt-1 font-heading text-3xl font-extrabold text-white">
                29.99 € <span className="text-sm font-normal text-slate-400">/ mes</span>
              </h3>
              <p className="mt-2 text-xs text-slate-300">Para agencias de viaje, DMC y anfitriones profesionales que buscan clientes globales.</p>
              <ul className="mt-6 space-y-3 text-xs text-slate-200">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-400" /> Leads cualificados ilimitados</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-400" /> Generador de cotizaciones con PDF de marca</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-400" /> Solo 3% comisión sobre transacciones</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-400" /> Acceso al agente Nexus B2B de IA 24/7</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-400" /> Módulo de facturación y cobro Stripe B2B</li>
              </ul>
            </div>
            <button
              onClick={async () => {
                const res = await fetch('/api/subscriptions/checkout', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ tier: 'business' })
                });
                const data = await res.json();
                if (data.success) {
                  alert(data.message);
                }
              }}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 py-3 text-xs font-bold text-white hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-indigo-600/30 transition-all"
            >
              Activar Suscripción Business
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Enterprise & Whitelabel</span>
              <h3 className="mt-1 font-heading text-2xl font-bold text-white">199 € <span className="text-sm font-normal text-slate-400">/ mes</span></h3>
              <p className="mt-2 text-xs text-slate-400">Grandes touroperadores y cadenas hoteleras con integración API directa.</p>
              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> API de conectividad en tiempo real</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Dominio y app móvil de marca blanca</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Gestor de cuenta dedicado</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> 0% de comisión de plataforma</li>
              </ul>
            </div>
            <button
              onClick={() => alert('Nuestro equipo de ventas Enterprise te contactará en menos de 24h.')}
              className="mt-8 w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-700"
            >
              Contactar con Ventas
            </button>
          </div>
        </div>
      )}

      {/* Modal: New Lead Capture */}
      {showNewLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="font-heading text-lg font-bold text-white">Capturar Nuevo Viajero</h3>
            <p className="mt-1 text-xs text-slate-400">Añade un lead cualificado para asignarlo a tu cartera.</p>

            <form onSubmit={handleCreateLead} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300">Nombre del Viajero</label>
                <input
                  type="text"
                  required
                  value={newLeadForm.travelerName}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, travelerName: e.target.value })}
                  placeholder="Ej. Carmen Rodríguez"
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Email de Contacto</label>
                <input
                  type="email"
                  required
                  value={newLeadForm.travelerEmail}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, travelerEmail: e.target.value })}
                  placeholder="cliente@ejemplo.com"
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Destino</label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.destination}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, destination: e.target.value })}
                    placeholder="Ej. Islandia"
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Presupuesto (€)</label>
                  <input
                    type="number"
                    required
                    value={newLeadForm.budgetTotal}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, budgetTotal: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Requisitos y Notas</label>
                <textarea
                  rows={2}
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  placeholder="Detalles sobre fechas, preferencias o restricciones..."
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  className="flex-1 rounded-xl border border-slate-800 py-2.5 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30"
                >
                  Guardar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
