import React, { useState, useEffect } from 'react';
import {
  Home,
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  X,
  Send
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { HomeListing } from '../../types';

export const HomesView: React.FC = () => {
  const { formatMoney } = useLanguage();
  const { user } = useAuth();
  const [homes, setHomes] = useState<HomeListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [bookingHome, setBookingHome] = useState<HomeListing | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // New Listing Form
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<'apartment' | 'villa' | 'cottage' | 'private_room'>('apartment');
  const [destination, setDestination] = useState('Madrid');
  const [country, setCountry] = useState('España');
  const [nightlyPrice, setNightlyPrice] = useState(85);
  const [maxGuests, setMaxGuests] = useState(3);
  const [bedrooms, setBedrooms] = useState(1);
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    fetch('/api/homes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHomes(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handlePublishHome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      const res = await fetch('/api/homes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          propertyType,
          destination,
          country,
          nightlyPrice: Number(nightlyPrice),
          cleaningFee: 25,
          maxGuests: Number(maxGuests),
          bedrooms: Number(bedrooms),
          beds: Number(bedrooms),
          bathrooms: 1,
          amenities: ['Wi-Fi Rápido', 'Cocina equipada', 'Lavadora', 'Cerradura inteligente'],
          host: {
            name: user?.name || 'Alejandro Morales',
            avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            superhost: true,
            responseRate: '100% en 15m'
          },
          photos: [
            photoUrl || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80'
          ],
          instantBookable: true,
          rules: ['No fiestas', 'Respeto a vecinos']
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setHomes((prev) => [data.data, ...prev]);
        setIsAddModalOpen(false);
        setTitle('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmBookingRequest = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingHome(null);
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 mb-2">
            <Home className="h-3.5 w-3.5" />
            <span>VOYA HOMES • MARKETPLACE DE ANFITRIONES</span>
          </div>
          <h1 className="font-heading text-3xl font-black text-white">
            Apartamentos y Alojamientos Turísticos Singulares
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Reserva directamente con anfitriones verificados o publica tu propia propiedad para generar ingresos (comisión más baja del mercado: 3%)
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-bold text-slate-950 hover:opacity-95 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Publicar mi Alojamiento</span>
        </button>
      </div>

      {/* Grid of Homes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homes.map((h) => (
          <div
            key={h.id}
            className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md transition-all hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10"
          >
            <div>
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={h.photos[0]}
                  alt={h.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold text-emerald-300 backdrop-blur-md border border-emerald-500/30">
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
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="capitalize font-semibold text-emerald-400">{h.propertyType}</span>
                  <div className="flex items-center gap-1">
                    <img
                      src={h.host.avatar}
                      alt={h.host.name}
                      className="h-5 w-5 rounded-full object-cover ring-1 ring-emerald-500"
                    />
                    <span>Anfitrión: <strong>{h.host.name}</strong></span>
                  </div>
                </div>

                <h3 className="font-heading text-lg font-bold text-white leading-tight">
                  {h.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-slate-300 border-y border-slate-800/80 py-2">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{h.maxGuests} huéspedes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bed className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{h.bedrooms} hab.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bath className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{h.bathrooms} baño</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {h.amenities.slice(0, 3).map((a, i) => (
                    <span key={i} className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                      • {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="flex items-baseline justify-between border-t border-slate-800/80 pt-3 mb-3">
                <div>
                  <span className="text-xs text-slate-400">Precio por noche:</span>
                  <span className="font-heading text-2xl font-black text-white block">
                    {formatMoney(h.nightlyPrice)}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  Limpieza: {formatMoney(h.cleaningFee)}
                </span>
              </div>

              <button
                onClick={() => setBookingHome(h)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 text-xs font-bold text-slate-950 hover:opacity-95 transition-all shadow cursor-pointer"
              >
                <Calendar className="h-4 w-4" />
                <span>Solicitar Reserva Inmediata</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Confirmation Modal */}
      {bookingHome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-white">
                Reserva de Alojamiento
              </h3>
              <button onClick={() => setBookingHome(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2">
              <p className="font-bold text-white text-sm">{bookingHome.title}</p>
              <p className="text-xs text-slate-400">{bookingHome.destination}, {bookingHome.country}</p>
              <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-2 text-slate-300">
                <span>Total 3 noches + limpieza:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {formatMoney(bookingHome.nightlyPrice * 3 + bookingHome.cleaningFee)}
                </span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 p-3 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <CheckCircle2 className="h-5 w-5" />
                <span>¡Solicitud enviada al anfitrión con éxito! Añadida a tu Wallet.</span>
              </div>
            ) : (
              <button
                onClick={handleConfirmBookingRequest}
                className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow"
              >
                Confirmar Solicitud con Garantía VOYA
              </button>
            )}
          </div>
        </div>
      )}

      {/* Publish Listing Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handlePublishHome}
            className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-bold text-white">
                Publicar Nuevo Alojamiento en VOYA Homes
              </h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Título del anuncio:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Ático céntrico con terraza panorámica"
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Tipo de Propiedad:</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="apartment">Apartamento</option>
                  <option value="villa">Villa de Lujo</option>
                  <option value="cottage">Casa Rural / Campo</option>
                  <option value="private_room">Habitación Privada</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Precio por noche (€):</label>
                <input
                  type="number"
                  value={nightlyPrice}
                  onChange={(e) => setNightlyPrice(Number(e.target.value))}
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Ciudad:</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Máximo de huéspedes:</label>
                <input
                  type="number"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow"
              >
                Publicar Ahora
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
