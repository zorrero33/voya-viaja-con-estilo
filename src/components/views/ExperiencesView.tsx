import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Star,
  Clock,
  Globe2,
  CheckCircle2,
  ExternalLink,
  Search,
  Compass,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ExperienceItem } from '../../types';

export const ExperiencesView: React.FC = () => {
  const { formatMoney } = useLanguage();
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchExperiences();
  }, [selectedCategory]);

  const fetchExperiences = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.append('category', selectedCategory);
    if (searchTerm) params.append('destination', searchTerm);

    fetch(`/api/experiences?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setExperiences(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const categories = [
    { id: 'all', label: 'Todas las Actividades' },
    { id: 'museum', label: 'Museos & Entradas sin Cola' },
    { id: 'guided_tour', label: 'Visitas Guiadas' },
    { id: 'adventure', label: 'Aventuras & Naturaleza' },
    { id: 'food_tasting', label: 'Gastronomía & Catas' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20 mb-2">
          <Ticket className="h-3.5 w-3.5" />
          <span>VOYA EXPERIENCES • TOURS & ENTRADAS</span>
        </div>
        <h1 className="font-heading text-3xl font-black text-white">
          Excursiones, Entradas a Museos y Experiencias Inolvidables
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Reserva actividades con guías en español, cancelación gratuita hasta 24h antes y confirmación digital instantánea
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchExperiences()}
              placeholder="¿Qué experiencia buscas? (ej. Coliseo, teamLab, safari, catas...)"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={fetchExperiences}
            className="rounded-xl bg-cyan-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow cursor-pointer"
          >
            Buscar Actividades
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Experiences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md transition-all hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10"
          >
            <div>
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold text-cyan-300 backdrop-blur-md border border-cyan-500/30">
                  <MapPin className="h-3 w-3" />
                  <span>{exp.destination}, {exp.country}</span>
                </div>

                {exp.badge && (
                  <span className="absolute top-3 right-3 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold text-slate-950 shadow">
                    {exp.badge}
                  </span>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <span>{exp.rating}</span>
                    <span className="text-slate-500 font-normal">({exp.reviewsCount})</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-300">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{exp.duration}</span>
                  </div>
                </div>

                <h3 className="font-heading text-lg font-bold text-white leading-tight">
                  {exp.title}
                </h3>

                <p className="text-xs text-slate-400">
                  Punto de encuentro: <span className="text-slate-200">{exp.meetingPoint}</span>
                </p>

                {/* Included Checklist */}
                <div className="space-y-1 pt-1 text-xs text-slate-300">
                  {exp.included.slice(0, 2).map((inc, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{inc}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-medium pt-0.5">
                    <Globe2 className="h-3.5 w-3.5 shrink-0" />
                    <span>Idiomas: {exp.languages.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="flex items-baseline justify-between border-t border-slate-800/80 pt-3 mb-3">
                <span className="text-xs text-slate-400">Desde por persona:</span>
                <span className="font-heading text-2xl font-black text-white">
                  {formatMoney(exp.price)}
                </span>
              </div>

              <a
                href={exp.bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 py-2.5 text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <span>Reservar en {exp.partner}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
