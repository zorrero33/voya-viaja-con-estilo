import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plane,
  Building,
  Train,
  Car,
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  QrCode,
  FileText,
  CheckCircle2,
  X
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { BookingItem } from '../../types';

export const BookingsView: React.FC = () => {
  const { formatMoney, currency } = useLanguage();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeQrModal, setActiveQrModal] = useState<BookingItem | null>(null);

  // Form states
  const [newType, setNewType] = useState<'flight' | 'hotel' | 'train' | 'car' | 'activity'>('flight');
  const [newTitle, setNewTitle] = useState('');
  const [newRef, setNewRef] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newDate, setNewDate] = useState('2026-11-20');
  const [newLocation, setNewLocation] = useState('');
  const [newPrice, setNewPrice] = useState(50);
  const [newNotes, setNewNotes] = useState('');

  const fetchBookings = () => {
    setLoading(true);
    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBookings(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newType,
          title: newTitle,
          referenceNumber: newRef || `REF-${Date.now().toString().slice(-6)}`,
          provider: newProvider || 'Reserva Directa',
          startDate: newDate,
          location: newLocation || 'Destino',
          totalPrice: Number(newPrice),
          currency,
          status: 'confirmed',
          notes: newNotes,
          qrCodeData: `VOYA-${newRef || Date.now()}`
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setBookings((prev) => [data.data, ...prev]);
        setIsAddModalOpen(false);
        setNewTitle('');
        setNewRef('');
        setNewProvider('');
        setNewNotes('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterType === 'all') return true;
    return b.type === filterType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return Plane;
      case 'hotel':
        return Building;
      case 'train':
        return Train;
      case 'car':
        return Car;
      default:
        return Briefcase;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20 mb-2">
            <Briefcase className="h-3.5 w-3.5" />
            <span>WALLET & ORGANIZADOR DE VIAJE</span>
          </div>
          <h1 className="font-heading text-3xl font-black text-white">
            Mis Reservas & Billetes
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Billetes de avión, trenes, reservas de hotel y excursiones en un único lugar accesible offline con códigos QR
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-cyan-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Añadir Reserva Manual</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-800 pb-3">
        {['all', 'flight', 'hotel', 'train', 'car', 'activity'].map((f) => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold capitalize transition-all cursor-pointer ${
              filterType === f
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {f === 'all' ? 'Todas' : f === 'flight' ? 'Vuelos' : f === 'hotel' ? 'Alojamientos' : f === 'train' ? 'Trenes' : f === 'car' ? 'Coches' : 'Actividades'}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((b) => {
          const Icon = getIcon(b.type);
          return (
            <div
              key={b.id}
              className="flex flex-col md:flex-row items-stretch justify-between rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-xl transition-all hover:border-slate-700 space-y-4 md:space-y-0"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Icon className="h-6 w-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 uppercase">
                      {b.status}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      Ref: <span className="text-cyan-400">{b.referenceNumber}</span>
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-white">
                    {b.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{b.startDate}</span>
                    </div>
                    {b.startTime && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>{b.startTime}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{b.location}</span>
                    </div>
                  </div>

                  {b.notes && (
                    <p className="text-xs text-slate-300 pt-1 italic">
                      "{b.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex md:flex-col items-center justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-800/80 pt-3 md:pt-0 md:pl-6 text-right">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Precio Total
                  </span>
                  <span className="font-heading text-xl font-black text-white">
                    {formatMoney(b.totalPrice)}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => setActiveQrModal(b)}
                    className="flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    <span>Ver QR</span>
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="rounded-xl p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Eliminar reserva"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* QR Code Modal */}
      {activeQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-center space-y-4">
            <h3 className="font-heading text-lg font-bold text-white">
              Pase Digital de Embarque
            </h3>
            <p className="text-xs text-slate-400">
              {activeQrModal.title}
            </p>

            <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl bg-white p-4 shadow-xl">
              {/* Clean SVG QR Code simulation */}
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <rect width="100" height="100" fill="white" />
                <rect x="10" y="10" width="25" height="25" fill="#0f172a" />
                <rect x="15" y="15" width="15" height="15" fill="white" />
                <rect x="18" y="18" width="9" height="9" fill="#0f172a" />
                <rect x="65" y="10" width="25" height="25" fill="#0f172a" />
                <rect x="70" y="15" width="15" height="15" fill="white" />
                <rect x="73" y="18" width="9" height="9" fill="#0f172a" />
                <rect x="10" y="65" width="25" height="25" fill="#0f172a" />
                <rect x="15" y="70" width="15" height="15" fill="white" />
                <rect x="18" y="73" width="9" height="9" fill="#0f172a" />
                {/* Random QR pixels */}
                <rect x="42" y="15" width="6" height="6" fill="#0f172a" />
                <rect x="52" y="25" width="6" height="6" fill="#0f172a" />
                <rect x="45" y="45" width="10" height="10" fill="#0f172a" />
                <rect x="65" y="45" width="8" height="8" fill="#0f172a" />
                <rect x="40" y="65" width="12" height="12" fill="#0f172a" />
                <rect x="65" y="75" width="18" height="6" fill="#0f172a" />
              </svg>
            </div>

            <p className="text-[11px] font-mono text-cyan-400">
              {activeQrModal.referenceNumber}
            </p>

            <button
              onClick={() => setActiveQrModal(null)}
              className="w-full rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Add Booking Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleAddConfirm}
            className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-white">
                Añadir Reserva al Wallet
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Tipo de servicio:</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="flight">Vuelo de Avión</option>
                <option value="hotel">Hotel / Apartamento</option>
                <option value="train">Tren de Alta Velocidad</option>
                <option value="car">Alquiler de Coche</option>
                <option value="activity">Excursión / Entradas</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Título de la reserva:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ej. Vuelo Madrid - Roma, Hotel Gracery..."
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Localizador / Ref:</label>
                <input
                  type="text"
                  value={newRef}
                  onChange={(e) => setNewRef(e.target.value)}
                  placeholder="Ej. IB-49219"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Precio ({currency}):</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Fecha:</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Ubicación / Aeropuerto:</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Ej. Roma Fiumicino T3"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Notas (asiento, equipaje...):</label>
              <textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                rows={2}
                placeholder="Ej. Maleta en cabina 10kg, asiento 14F..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
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
                className="rounded-xl bg-cyan-600 px-5 py-2 text-xs font-bold text-white hover:bg-cyan-500 shadow"
              >
                Guardar Reserva
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
