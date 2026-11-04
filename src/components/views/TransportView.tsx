import React, { useState, useEffect } from 'react';
import {
  Car,
  Plane,
  Ship,
  Train,
  ShieldCheck,
  Check,
  ExternalLink,
  Users,
  Briefcase,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { TransportRental } from '../../types';

export const TransportView: React.FC = () => {
  const { formatMoney } = useLanguage();
  const [rentals, setRentals] = useState<TransportRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchRentals();
  }, [selectedType]);

  const fetchRentals = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedType !== 'all') params.append('type', selectedType);

    fetch(`/api/transport-rentals?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRentals(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20 mb-2">
          <Car className="h-3.5 w-3.5" />
          <span>VOYA TRANSPORT & MOBILITY</span>
        </div>
        <h1 className="font-heading text-3xl font-black text-white">
          Alquiler de Coches y Traslados Privados Aeropuerto-Hotel
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Compara flotas de Hertz, Sixt, Avis y traslados ejecutivos puerta a puerta con precio cerrado sin taxímetro
        </p>
      </div>

      {/* Type Filter Buttons */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setSelectedType('all')}
          className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
            selectedType === 'all'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Todos los Vehículos
        </button>
        <button
          onClick={() => setSelectedType('car_rental')}
          className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
            selectedType === 'car_rental'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Alquiler de Coches
        </button>
        <button
          onClick={() => setSelectedType('airport_transfer')}
          className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
            selectedType === 'airport_transfer'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Traslados Privados Aeropuerto
        </button>
      </div>

      {/* Grid of Rentals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rentals.map((r) => (
          <div
            key={r.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md transition-all hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-cyan-500/10 px-3 py-0.5 text-xs font-bold text-cyan-300 uppercase border border-cyan-500/30">
                  {r.type === 'car_rental' ? 'Alquiler de Coche' : 'Chófer Privado'}
                </span>
                <span className="text-xs font-bold text-slate-300">
                  Operador: <strong className="text-white">{r.operator}</strong>
                </span>
              </div>

              <div>
                <h3 className="font-heading text-xl font-bold text-white">
                  {r.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{r.pickupLocation}</span>
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-950 p-3 border border-slate-800 text-xs text-slate-300 text-center">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Capacidad</span>
                  <span className="font-bold text-white">{r.seats || 4} plazas</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Equipaje</span>
                  <span className="font-bold text-white">{r.luggage || 2} maletas</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Transmisión</span>
                  <span className="font-bold text-white">{r.transmission || 'Manual'}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Kilometraje ilimitado y política de combustible justa</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Cancelación gratuita hasta 48h antes de la recogida</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-800/80 pt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Tarifa por día</span>
                <span className="font-heading text-2xl font-black text-white">
                  {formatMoney(r.dailyPrice)}
                </span>
              </div>

              <a
                href={r.bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <span>Reservar en {r.partner}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
