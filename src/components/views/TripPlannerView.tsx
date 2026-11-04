import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Coins,
  Plus,
  Trash2,
  Printer,
  Save,
  CheckCircle2,
  AlertCircle,
  Share2,
  ChevronDown,
  ChevronUp,
  Download,
  Users,
  Utensils,
  Accessibility
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { TripItinerary, ItineraryDay, ItineraryActivity } from '../../types';

export const TripPlannerView: React.FC = () => {
  const { formatMoney, currency } = useLanguage();
  const { setActiveTab } = useAuth();

  const [destination, setDestination] = useState('Tokio, Japón');
  const [daysCount, setDaysCount] = useState(4);
  const [budgetTotal, setBudgetTotal] = useState(600);
  const [travelersCount, setTravelersCount] = useState(2);
  const [travelStyle, setTravelStyle] = useState('Equilibrado y Cultural');
  const [dietary, setDietary] = useState('Ninguna');
  const [mobility, setMobility] = useState('Estándar');

  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New activity form in modal
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [newActTitle, setNewActTitle] = useState('');
  const [newActTime, setNewActTime] = useState('11:00');
  const [newActDesc, setNewActDesc] = useState('');
  const [newActCost, setNewActCost] = useState(0);

  const handleGenerate = async () => {
    setLoading(true);
    setItinerary(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/ai/trip-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          days: daysCount,
          budgetTotal,
          travelers: travelersCount,
          style: travelStyle,
          dietary,
          mobility,
          currency
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setItinerary(data.data);
      }
    } catch (err) {
      console.error('Error generating itinerary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToTrips = async () => {
    if (!itinerary) return;
    try {
      await fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itinerary)
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteActivity = (dayIndex: number, actId: string) => {
    if (!itinerary) return;
    const updatedDays = [...itinerary.days];
    updatedDays[dayIndex].activities = updatedDays[dayIndex].activities.filter(a => a.id !== actId);
    setItinerary({
      ...itinerary,
      days: updatedDays
    });
  };

  const handleAddActivityConfirm = () => {
    if (!itinerary || !newActTitle) return;
    const newAct: ItineraryActivity = {
      id: `act_custom_${Date.now()}`,
      time: newActTime,
      title: newActTitle,
      description: newActDesc || 'Actividad añadida manualmente por el viajero.',
      category: 'sightseeing',
      durationHours: 1.5,
      costEstimate: Number(newActCost),
      isFree: Number(newActCost) === 0,
      locationName: destination
    };

    const updatedDays = [...itinerary.days];
    updatedDays[activeDayIndex].activities.push(newAct);
    // Sort by time
    updatedDays[activeDayIndex].activities.sort((a, b) => a.time.localeCompare(b.time));

    setItinerary({
      ...itinerary,
      days: updatedDays
    });

    setIsAddingActivity(false);
    setNewActTitle('');
    setNewActDesc('');
    setNewActCost(0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>MOTOR GEMINI 3.8 FLASH</span>
          </div>
          <h1 className="font-heading text-3xl font-black text-white">
            VOYA AI Trip Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Genera itinerarios inteligentes día por día con horarios lógicos, costes detallados y alternativas gratuitas
          </p>
        </div>

        {itinerary && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={handleSaveToTrips}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{savedSuccess ? '¡Guardado con éxito!' : 'Guardar en Mis Viajes'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Generator Wizard Parameters */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
              Destino
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Ej. Tokio, Roma, París, Marrakech..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
              Días de viaje ({daysCount} días)
            </label>
            <input
              type="range"
              min="1"
              max="14"
              value={daysCount}
              onChange={(e) => setDaysCount(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>1 día</span>
              <span>7 días</span>
              <span>14 días</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
              Presupuesto Total Estimado
            </label>
            <div className="relative">
              <input
                type="number"
                value={budgetTotal}
                onChange={(e) => setBudgetTotal(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
              <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">
                {currency}
              </span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
              Viajeros & Tipo
            </label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-200 focus:border-cyan-500 focus:outline-none cursor-pointer"
            >
              <option value="Equilibrado y Cultural">Cultural y Equilibrado</option>
              <option value="Mochilero Ultra Low Cost">Mochilero Low-Cost</option>
              <option value="Parejas & Romántico">Parejas & Romántico</option>
              <option value="Familiar con Niños">Familiar con Niños</option>
              <option value="Gastronómico & Placer">Gastronómico Gourmet</option>
              <option value="Aventura & Naturaleza">Aventura & Naturaleza</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters Toggle: Dietary and Mobility */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-800/80 pt-3">
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="text-xs text-slate-400">Dieta:</span>
            <select
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="Ninguna">Sin restricciones</option>
              <option value="Vegetariana">Vegetariana</option>
              <option value="Vegana">Vegana</option>
              <option value="Halal">Halal</option>
              <option value="Sin Gluten">Sin Gluten / Celíaco</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Accessibility className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="text-xs text-slate-400">Movilidad:</span>
            <select
              value={mobility}
              onChange={(e) => setMobility(e.target.value)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="Estándar">Estándar (Caminar libremente)</option>
              <option value="Ritmo pausado">Ritmo pausado / Personas mayores</option>
              <option value="Silla de ruedas">Adaptado para silla de ruedas</option>
              <option value="Carricoche de bebé">Apto para carrito de bebé</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-500 py-3 text-xs font-bold text-white shadow-xl shadow-cyan-500/20 hover:opacity-95 transition-all cursor-pointer"
        >
          {loading ? (
            <span>Generando itinerario con Gemini 3.8 Flash...</span>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Generar Itinerario Completo Personalizado</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Itinerary Display */}
      {itinerary && (
        <div className="space-y-6">
          {/* Trip Summary Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-0.5 text-xs font-bold text-cyan-300 uppercase">
                  {itinerary.travelerType}
                </span>
                <h2 className="font-heading text-2xl font-black text-white mt-1">
                  {itinerary.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {itinerary.daysCount} días • Presupuesto sugerido: {formatMoney(itinerary.totalEstimatedCost)}
                </p>
              </div>

              {itinerary.packingList && (
                <div className="rounded-2xl bg-slate-950 p-3 border border-slate-800 text-xs text-slate-300 max-w-sm">
                  <span className="font-bold text-cyan-400 block mb-1">
                    🎒 Lista de equipaje recomendada:
                  </span>
                  <p className="text-[11px] text-slate-400">
                    {itinerary.packingList.join(' • ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Days Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {itinerary.days.map((day, idx) => (
              <button
                key={idx}
                onClick={() => setActiveDayIndex(idx)}
                className={`flex flex-col items-center rounded-2xl px-5 py-3 transition-all cursor-pointer ${
                  activeDayIndex === idx
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xs uppercase tracking-wider">Día {day.dayNumber}</span>
                <span className="text-[11px] mt-0.5 opacity-90">
                  {formatMoney(day.estimatedDayCost)}
                </span>
              </button>
            ))}
          </div>

          {/* Current Day Schedule */}
          {itinerary.days[activeDayIndex] && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                <div>
                  <h3 className="font-heading text-xl font-bold text-white">
                    {itinerary.days[activeDayIndex].title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {itinerary.days[activeDayIndex].summary}
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingActivity(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-400 hover:bg-cyan-500/20 transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Añadir Actividad</span>
                </button>
              </div>

              {/* Timeline activities */}
              <div className="space-y-4 pt-2">
                {itinerary.days[activeDayIndex].activities.map((act) => (
                  <div
                    key={act.id}
                    className="relative flex items-start gap-4 rounded-2xl border border-slate-800/80 bg-slate-950 p-4 transition-all hover:border-slate-700"
                  >
                    <div className="flex flex-col items-center shrink-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 font-bold text-xs border border-cyan-500/20">
                        {act.time}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">
                        {act.durationHours}h
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-heading text-base font-bold text-white">
                          {act.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              act.isFree
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {act.isFree ? 'Gratis' : `~${formatMoney(act.costEstimate)}`}
                          </span>

                          <button
                            onClick={() => handleDeleteActivity(activeDayIndex, act.id)}
                            className="rounded-lg p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Eliminar actividad"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                        {act.description}
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                        <MapPin className="h-3 w-3 text-cyan-400" />
                        <span>{act.locationName}</span>
                        {act.bookingRecommended && (
                          <span className="text-amber-400 font-medium ml-2">
                            • Reserva anticipada recomendada
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Add Activity */}
      {isAddingActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="font-heading text-lg font-bold text-white">
              Añadir actividad al Día {activeDayIndex + 1}
            </h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Nombre del lugar o plan:</label>
              <input
                type="text"
                value={newActTitle}
                onChange={(e) => setNewActTitle(e.target.value)}
                placeholder="Ej. Café con vistas, Museo de Arte Moderno..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Hora aproximada:</label>
                <input
                  type="time"
                  value={newActTime}
                  onChange={(e) => setNewActTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Coste ({currency}):</label>
                <input
                  type="number"
                  value={newActCost}
                  onChange={(e) => setNewActCost(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Notas o descripción:</label>
              <textarea
                value={newActDesc}
                onChange={(e) => setNewActDesc(e.target.value)}
                rows={2}
                placeholder="Detalles sobre cómo llegar o qué pedir..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAddingActivity(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddActivityConfirm}
                className="rounded-xl bg-cyan-600 px-5 py-2 text-xs font-bold text-white hover:bg-cyan-500 shadow"
              >
                Añadir al Día
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
