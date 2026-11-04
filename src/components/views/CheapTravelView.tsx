import React, { useState, useEffect } from 'react';
import {
  Plane,
  Train,
  Bus,
  Car,
  Ship,
  Search,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Briefcase,
  Leaf,
  ExternalLink,
  ShieldCheck,
  TrendingDown,
  Info,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { TravelOffer, TransportType } from '../../types';

export const CheapTravelView: React.FC = () => {
  const { t, formatMoney } = useLanguage();
  const [offers, setOffers] = useState<TravelOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [originInput, setOriginInput] = useState('Madrid');
  const [destinationInput, setDestinationInput] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'eco'>('price');

  const fetchOffers = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedType !== 'all') params.append('type', selectedType);
    if (originInput) params.append('origin', originInput);
    if (destinationInput) params.append('destination', destinationInput);

    fetch(`/api/travel/search?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOffers(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOffers();
  }, [selectedType]);

  const handleBookingClick = async (offer: TravelOffer) => {
    try {
      await fetch('/api/affiliate/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partner: offer.affiliatePartner, offerId: offer.id })
      });
    } catch (e) {
      // Non-blocking telemetry
    }
    window.open(offer.bookingUrl, '_blank');
  };

  const getTransportIcon = (type: TransportType) => {
    switch (type) {
      case 'flight':
        return Plane;
      case 'train':
        return Train;
      case 'bus':
        return Bus;
      case 'carpool':
        return Car;
      case 'ferry':
        return Ship;
      default:
        return Plane;
    }
  };

  const sortedOffers = [...offers].sort((a, b) => {
    if (sortBy === 'price') return (a.price + a.transferCostEst) - (b.price + b.transferCostEst);
    if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
    if (sortBy === 'eco') return a.carbonKg - b.carbonKg;
    return 0;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 mb-2">
          <TrendingDown className="h-3.5 w-3.5" />
          <span>MOTOR MULTIMODAL DE PRECIOS REALES</span>
        </div>
        <h1 className="font-heading text-3xl font-black text-white">
          VOYA Cheap Travel
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Compara avión, tren de alta velocidad, autobús interurbano, coche y ferry al coste neto más bajo con cálculo de traslados al centro
        </p>
      </div>

      {/* Search Filter Form */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
              Origen
            </label>
            <input
              type="text"
              value={originInput}
              onChange={(e) => setOriginInput(e.target.value)}
              placeholder="Ciudad o aeropuerto (ej. Madrid)"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
              Destino
            </label>
            <input
              type="text"
              value={destinationInput}
              onChange={(e) => setDestinationInput(e.target.value)}
              placeholder="Cualquier destino (ej. Roma, París...)"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
              Medio de Transporte
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-200 focus:border-cyan-500 focus:outline-none cursor-pointer"
            >
              <option value="all">Todos los medios combinados</option>
              <option value="flight">Solo Vuelos</option>
              <option value="train">Solo Trenes (Alta Velocidad)</option>
              <option value="bus">Solo Autobuses</option>
              <option value="carpool">Solo Coche compartido</option>
              <option value="ferry">Solo Ferris</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchOffers}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-xs font-bold text-white hover:opacity-95 shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Search className="h-4 w-4" />
              <span>Comparar Tarifas</span>
            </button>
          </div>
        </div>

        {/* Sorting and Transparency Alert */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Ordenar por:</span>
            <button
              onClick={() => setSortBy('price')}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer ${
                sortBy === 'price'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              Coste Real Más Bajo
            </button>
            <button
              onClick={() => setSortBy('duration')}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer ${
                sortBy === 'duration'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              Más Rápido
            </button>
            <button
              onClick={() => setSortBy('eco')}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer ${
                sortBy === 'eco'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              Menor Huella CO2
            </button>
          </div>

          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <Info className="h-3.5 w-3.5 text-cyan-400" />
            <span>Precios verificados sin comisiones ocultas • Incluye traslado estimado a centro</span>
          </p>
        </div>
      </div>

      {/* Offers Results List */}
      <div className="space-y-4">
        {sortedOffers.map((offer) => {
          const Icon = getTransportIcon(offer.type);
          const totalRealCost = offer.price + offer.transferCostEst;

          return (
            <div
              key={offer.id}
              className="group relative flex flex-col md:flex-row items-stretch justify-between rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 transition-all hover:border-cyan-500/40 hover:bg-slate-900"
            >
              {/* Left Details: Operator, Times, Route */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">
                      {offer.operator}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300 capitalize">
                        {offer.type === 'flight' ? 'Vuelo' : offer.type === 'train' ? 'Tren Alta Velocidad' : offer.type === 'bus' ? 'Autobús Interurbano' : offer.type === 'carpool' ? 'Coche Compartido' : 'Ferry Marítimo'}
                      </span>
                      {offer.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] font-medium text-cyan-400">
                          • {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Times and Stops */}
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <div>
                    <span className="font-heading text-lg font-black text-white">
                      {offer.departureTime}
                    </span>
                    <p className="text-[11px] text-slate-400">{offer.origin}</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                      <Clock className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{offer.duration}</span>
                    </div>
                    <div className="relative w-28 h-0.5 bg-slate-700 my-1">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400">
                      {offer.stops === 0 ? 'Directo sin escalas' : `${offer.stops} transbordo`}
                    </span>
                  </div>

                  <div>
                    <span className="font-heading text-lg font-black text-white">
                      {offer.arrivalTime}
                    </span>
                    <p className="text-[11px] text-slate-400">{offer.destination}</p>
                  </div>
                </div>

                {/* Baggage & Ecology Pill */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    <span>{offer.luggageIncluded}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Leaf className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{offer.carbonKg} kg CO2</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-amber-400" />
                    <span>Traslado al centro: ~{formatMoney(offer.transferCostEst)} ({offer.transferTimeMinutes} min)</span>
                  </div>
                </div>
              </div>

              {/* Right: Pricing & CTA Button */}
              <div className="mt-4 md:mt-0 md:ml-6 flex md:flex-col items-center justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-6 text-right">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Billete Neto
                  </span>
                  <span className="font-heading text-2xl font-black text-white">
                    {formatMoney(offer.price)}
                  </span>
                  <p className="text-[11px] font-semibold text-emerald-400">
                    Total real: {formatMoney(totalRealCost)}
                  </p>
                </div>

                <div className="mt-3">
                  <button
                    onClick={() => handleBookingClick(offer)}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-bold text-slate-950 hover:opacity-95 shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    <span>Ver Oferta Oficial</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                  <p className="text-[9px] text-slate-500 mt-1 text-center">
                    Vía {offer.affiliatePartner}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Commercial Affiliate Disclosure as demanded in Parte 14 */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-center">
        <p className="text-xs text-slate-400">
          <strong>Transparencia VOYA:</strong> Los precios mostrados provienen de proveedores oficiales de transporte. Los enlaces a aerolíneas, operadores ferroviarios y autobuses pueden generar una pequeña comisión de afiliación para VOYA sin coste alguno para ti, permitiéndonos mantener el servicio gratuito.
        </p>
      </div>
    </div>
  );
};
