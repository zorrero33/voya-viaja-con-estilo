import React, { useState, useEffect } from 'react';
import {
  Building,
  Star,
  MapPin,
  Wifi,
  Coffee,
  ShieldCheck,
  Check,
  ExternalLink,
  Search,
  SlidersHorizontal,
  Flame,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { HotelListing } from '../../types';

export const HotelsView: React.FC = () => {
  const { formatMoney } = useLanguage();
  const [hotels, setHotels] = useState<HotelListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchDest, setSearchDest] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [filterFreeCancel, setFilterFreeCancel] = useState(false);
  const [filterPool, setFilterPool] = useState(false);
  const [filterBreakfast, setFilterBreakfast] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, [selectedType]);

  const fetchHotels = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedType !== 'all') params.append('type', selectedType);
    if (searchDest) params.append('destination', searchDest);

    fetch(`/api/hotels?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHotels(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const filteredHotels = hotels.filter((h) => {
    if (filterFreeCancel && !h.amenities.freeCancellation) return false;
    if (filterPool && !h.amenities.pool) return false;
    if (filterBreakfast && !h.amenities.breakfast) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20 mb-2">
          <Building className="h-3.5 w-3.5" />
          <span>VOYA HOTELS • COMPARADOR INTERNACIONAL</span>
        </div>
        <h1 className="font-heading text-3xl font-black text-white">
          Hoteles, Resorts y Alojamientos con Cancelación Gratuita
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Compara tarifas verificadas en Booking.com, Agoda y cadenas hoteleras con opiniones reales y sin sobrecostes ocultos
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchDest}
              onChange={(e) => setSearchDest(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchHotels()}
              placeholder="¿Qué ciudad buscas? (ej. Tokio, Roma, Marrakech, París...)"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs font-bold text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">Todos los Alojamientos</option>
            <option value="hotel">Hoteles</option>
            <option value="boutique">Hoteles Boutique</option>
            <option value="resort">Resorts & Spa</option>
            <option value="hostel">Hostales & Bunk</option>
          </select>

          <button
            onClick={fetchHotels}
            className="rounded-xl bg-cyan-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow cursor-pointer"
          >
            Buscar Hoteles
          </button>
        </div>

        {/* Quick Checkbox Amenities */}
        <div className="flex flex-wrap items-center gap-4 border-t border-slate-800/80 pt-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={filterFreeCancel}
              onChange={(e) => setFilterFreeCancel(e.target.checked)}
              className="rounded accent-cyan-500"
            />
            <span>Solo con Cancelación Gratuita</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={filterBreakfast}
              onChange={(e) => setFilterBreakfast(e.target.checked)}
              className="rounded accent-cyan-500"
            />
            <span>Desayuno Incluido</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={filterPool}
              onChange={(e) => setFilterPool(e.target.checked)}
              className="rounded accent-cyan-500"
            />
            <span>Piscina o Spa</span>
          </label>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((h) => (
          <div
            key={h.id}
            className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md transition-all hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10"
          >
            <div>
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  src={h.images[0]}
                  alt={h.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold text-cyan-300 backdrop-blur-md border border-cyan-500/30">
                  <MapPin className="h-3 w-3" />
                  <span>{h.destination}, {h.country}</span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-slate-950/80 px-2.5 py-1 text-[11px] font-bold text-amber-400 backdrop-blur-md border border-slate-700/60">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span>{h.rating}</span>
                  <span className="text-slate-400 font-normal">({h.reviewCount})</span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: h.stars }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400" />
                  ))}
                  <span className="text-[10px] text-slate-400 capitalize ml-1">• {h.type}</span>
                </div>

                <h3 className="font-heading text-lg font-bold text-white leading-tight">
                  {h.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1">{h.address}</p>

                {/* Amenities Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {h.amenities.wifi && (
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 flex items-center gap-1">
                      <Wifi className="h-3 w-3 text-cyan-400" /> Wi-Fi Alta Vel.
                    </span>
                  )}
                  {h.amenities.freeCancellation && (
                    <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Cancelación Gratis
                    </span>
                  )}
                  {h.amenities.breakfast && (
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 flex items-center gap-1">
                      <Coffee className="h-3 w-3 text-amber-400" /> Desayuno
                    </span>
                  )}
                </div>

                {/* Room options summary */}
                <div className="rounded-2xl bg-slate-950 p-3 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Opción recomendada:</span>
                  <p className="font-semibold text-white">{h.roomTypes[0]?.name || 'Habitación Confort'}</p>
                  <p className="text-[11px] text-slate-400">{h.roomTypes[0]?.bed}</p>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="flex items-baseline justify-between border-t border-slate-800/80 pt-3 mb-3">
                <span className="text-xs text-slate-400">Por noche:</span>
                <span className="font-heading text-2xl font-black text-white">
                  {formatMoney(h.nightlyPrice)}
                </span>
              </div>

              <a
                href={h.bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 py-2.5 text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <span>Ver Oferta en {h.affiliatePartner}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
