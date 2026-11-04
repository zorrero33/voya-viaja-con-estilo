import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Sun,
  Coins,
  Shield,
  Calendar,
  Sparkles,
  ChevronRight,
  X,
  Compass,
  ArrowRight,
  Info,
  CheckCircle,
  Accessibility
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Destination } from '../../types';

export const ExplorerView: React.FC = () => {
  const { t, formatMoney } = useLanguage();
  const { setActiveTab, selectedDestinationId, setSelectedDestinationId } = useAuth();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModalDest, setActiveModalDest] = useState<Destination | null>(null);

  useEffect(() => {
    fetch('/api/destinations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDestinations(data.data);
          if (selectedDestinationId) {
            const match = data.data.find((d: Destination) => d.id === selectedDestinationId);
            if (match) setActiveModalDest(match);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedDestinationId]);

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'culture', label: 'Cultura & Historia' },
    { id: 'budget', label: 'Económicos' },
    { id: 'beach', label: 'Playas & Islas' },
    { id: 'urban', label: 'Metrópolis' },
    { id: 'nature', label: 'Naturaleza' },
    { id: 'hidden_gem', label: 'Joyas Ocultas' },
  ];

  const continents = [
    { id: 'all', label: 'Todo el mundo' },
    { id: 'Europe', label: 'Europa' },
    { id: 'Asia', label: 'Asia' },
    { id: 'Americas', label: 'América' },
    { id: 'Africa', label: 'África' },
  ];

  const filteredDestinations = destinations.filter((dest) => {
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
    const matchesContinent = selectedContinent === 'all' || dest.continent === selectedContinent;
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      dest.name.toLowerCase().includes(s) ||
      dest.country.toLowerCase().includes(s) ||
      dest.tagline.toLowerCase().includes(s) ||
      dest.tags.some((t) => t.toLowerCase().includes(s));
    return matchesCategory && matchesContinent && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-black text-white">
          Explorador Internacional de Destinos
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Fichas completas con coste medio diario, clima real, consejos locales verificados y nivel de accesibilidad
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por ciudad, país, monumento o etiqueta (ej. Roma, templos, marisco...)"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Continent Dropdown */}
          <select
            value={selectedContinent}
            onChange={(e) => setSelectedContinent(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs font-semibold text-slate-300 focus:border-cyan-500 focus:outline-none cursor-pointer"
          >
            {continents.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            onClick={() => setActiveModalDest(dest)}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 transition-all hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={dest.image}
                alt={dest.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-slate-950/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md border border-slate-700/60">
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span>{dest.weather.tempC}°C</span>
              </div>

              <div className="absolute top-3 left-3 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300 backdrop-blur-md border border-cyan-500/30">
                {dest.country}
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="font-heading text-xl font-bold text-white">
                  {dest.name}
                </h3>
                <p className="text-[11px] text-slate-300 line-clamp-1">
                  {dest.tagline}
                </p>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Coste diario aprox:</span>
                <span className="font-bold text-emerald-400">
                  ~{formatMoney(dest.avgDailyCost)}/día
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Seguridad:</span>
                <span className="font-semibold text-cyan-400">
                  {dest.safetyScore}/10 ★
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {dest.tags.slice(0, 3).map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveModalDest(dest);
                }}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 py-2 text-xs font-bold text-slate-200 group-hover:bg-cyan-600 group-hover:border-cyan-500 group-hover:text-white transition-all cursor-pointer"
              >
                <span>Ver Ficha Completa</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal with Full Destination Details */}
      {activeModalDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => {
                setActiveModalDest(null);
                setSelectedDestinationId(null);
              }}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Image Header */}
            <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-6">
              <img
                src={activeModalDest.image}
                alt={activeModalDest.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="rounded-full bg-cyan-500/20 border border-cyan-500/40 px-3 py-1 text-xs font-bold text-cyan-300 uppercase">
                  {activeModalDest.country} • {activeModalDest.continent}
                </span>
                <h2 className="font-heading text-3xl font-extrabold text-white mt-1">
                  {activeModalDest.name}
                </h2>
                <p className="text-xs text-slate-200 mt-1 italic">
                  {activeModalDest.tagline}
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-y border-slate-800 py-3 mb-6 text-xs">
              <div>
                <span className="text-slate-400 block">Coste medio diario:</span>
                <span className="font-bold text-emerald-400">
                  ~{formatMoney(activeModalDest.avgDailyCost)} / día
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Clima actual:</span>
                <span className="font-bold text-white">
                  {activeModalDest.weather.tempC}°C ({activeModalDest.weather.condition})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Mejor temporada:</span>
                <span className="font-bold text-white">{activeModalDest.bestSeason}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Seguridad certificada:</span>
                <span className="font-bold text-cyan-400">{activeModalDest.safetyScore}/10 ★</span>
              </div>
            </div>

            {/* Description & Details */}
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <p>{activeModalDest.description}</p>

              {/* Highlights */}
              <div>
                <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-cyan-400" />
                  Lugares imprescindibles y monumentos:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeModalDest.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Local Tips */}
              <div>
                <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-amber-400" />
                  Consejos de residentes locales para ahorrar:
                </h4>
                <div className="space-y-1.5">
                  {activeModalDest.localTips.map((tip, idx) => (
                    <p key={idx} className="rounded-xl bg-slate-950/70 p-2.5 border border-slate-800 text-slate-300">
                      💡 {tip}
                    </p>
                  ))}
                </div>
              </div>

              {/* Accessibility */}
              <div className="flex items-start gap-2.5 rounded-xl bg-slate-950 p-3 border border-slate-800">
                <Accessibility className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Accesibilidad & Movilidad:</span>
                  <span className="text-slate-400">{activeModalDest.accessibility}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 border-t border-slate-800 pt-5">
              <button
                onClick={() => {
                  setActiveModalDest(null);
                  setActiveTab('planner');
                }}
                className="w-full flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-xs font-bold text-white hover:opacity-95 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Generar Itinerario Completo con IA</span>
              </button>

              <button
                onClick={() => {
                  setActiveModalDest(null);
                  setActiveTab('cheap_travel');
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Buscar Transportes Baratos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
