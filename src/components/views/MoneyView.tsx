import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Coins,
  TrendingUp,
  PieChart,
  Plus,
  Trash2,
  Users,
  ShieldAlert,
  ArrowRightLeft,
  DollarSign,
  Info,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ExpenseItem, CurrencyCode } from '../../types';

export const MoneyView: React.FC = () => {
  const { formatMoney, rates, currency, setCurrency } = useLanguage();

  // Budget Calculator state
  const [transportCost, setTransportCost] = useState(240);
  const [stayCost, setStayCost] = useState(380);
  const [foodCost, setFoodCost] = useState(200);
  const [activitiesCost, setActivitiesCost] = useState(90);
  const [insuranceCost, setInsuranceCost] = useState(35);
  const [contingencyMargin, setContingencyMargin] = useState(10); // 10%
  const [tripDays, setTripDays] = useState(5);
  const [travelers, setTravelers] = useState(2);

  // Group split calculator
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState(45);
  const [newCategory, setNewCategory] = useState<'transport' | 'accommodation' | 'food' | 'activities'>('food');
  const [newPayer, setNewPayer] = useState('Alejandro');

  // Currency Converter
  const [convAmount, setConvAmount] = useState(100);
  const [convFrom, setConvFrom] = useState<CurrencyCode>('EUR');
  const [convTo, setConvTo] = useState<CurrencyCode>('JPY');

  useEffect(() => {
    fetch('/api/expenses')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setExpenses(data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const subtotal = transportCost + stayCost + foodCost + activitiesCost + insuranceCost;
  const marginAmount = (subtotal * contingencyMargin) / 100;
  const grandTotal = subtotal + marginAmount;
  const perPerson = grandTotal / Math.max(1, travelers);
  const perDay = grandTotal / Math.max(1, tripDays);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc) return;
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          category: newCategory,
          description: newDesc,
          amount: Number(newAmount),
          currency,
          paidBy: newPayer,
          splitWith: ['Alejandro', 'Compañero']
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setExpenses((prev) => [data.data, ...prev]);
        setNewDesc('');
        setNewAmount(25);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      setExpenses((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const convertedValue = (convAmount / (rates[convFrom] || 1)) * (rates[convTo] || 1);

  const tippingRules = [
    { country: 'Japón 🇯🇵', rule: '0% (No se deja propina)', note: 'Dejar propina se considera una falta de respeto cultural.' },
    { country: 'Estados Unidos 🇺🇸', rule: '18% - 22%', note: 'Prácticamente obligatoria para camareros y servicios.' },
    { country: 'Italia 🇮🇹 / España 🇪🇸', rule: 'Redondeo o 5-10%', note: 'Agradecida si el servicio fue excepcional; no obligatoria.' },
    { country: 'Marruecos 🇲🇦', rule: '10% habitual', note: 'Muy extendida en restaurantes y guías turísticos.' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20 mb-2">
          <Wallet className="h-3.5 w-3.5" />
          <span>VOYA MONEY & DIVISAS</span>
        </div>
        <h1 className="font-heading text-3xl font-black text-white">
          Calculadora de Presupuesto & Gastos
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Cálculo exacto del coste total por persona y por día con margen para imprevistos, división de cuentas en grupo y tipos de cambio
        </p>
      </div>

      {/* Main Budget Calculator Panel */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl space-y-6">
        <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-emerald-400" />
          <span>Calculadora Maestra de Presupuesto</span>
        </h2>

        {/* Inputs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Transporte
            </label>
            <input
              type="number"
              value={transportCost}
              onChange={(e) => setTransportCost(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Alojamiento
            </label>
            <input
              type="number"
              value={stayCost}
              onChange={(e) => setStayCost(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Comidas
            </label>
            <input
              type="number"
              value={foodCost}
              onChange={(e) => setFoodCost(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Actividades
            </label>
            <input
              type="number"
              value={activitiesCost}
              onChange={(e) => setActivitiesCost(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Seguro & Extras
            </label>
            <input
              type="number"
              value={insuranceCost}
              onChange={(e) => setInsuranceCost(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Días ({tripDays})
            </label>
            <input
              type="number"
              min="1"
              value={tripDays}
              onChange={(e) => setTripDays(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Viajeros ({travelers})
            </label>
            <input
              type="number"
              min="1"
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Totals Summary Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border-t border-slate-800/80 pt-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-xs font-semibold text-slate-400 block">Presupuesto Total Estimado</span>
            <span className="font-heading text-2xl font-black text-white mt-1 block">
              {formatMoney(grandTotal)}
            </span>
            <span className="text-[10px] text-slate-500">
              Incluye {contingencyMargin}% margen ({formatMoney(marginAmount)})
            </span>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
            <span className="text-xs font-semibold text-emerald-400 block">Coste por Persona</span>
            <span className="font-heading text-2xl font-black text-emerald-400 mt-1 block">
              {formatMoney(perPerson)}
            </span>
            <span className="text-[10px] text-slate-400">
              Dividido entre {travelers} viajeros
            </span>
          </div>

          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4">
            <span className="text-xs font-semibold text-cyan-300 block">Gasto Diario Medio</span>
            <span className="font-heading text-2xl font-black text-cyan-400 mt-1 block">
              {formatMoney(perDay)} / día
            </span>
            <span className="text-[10px] text-slate-400">
              Promedio para {tripDays} días de viaje
            </span>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4">
            <span className="text-xs font-semibold text-amber-300 block">Margen de Imprevistos</span>
            <span className="font-heading text-2xl font-black text-amber-400 mt-1 block">
              {formatMoney(marginAmount)}
            </span>
            <span className="text-[10px] text-slate-400">
              Colchón de seguridad para retrasos o taxis
            </span>
          </div>
        </div>
      </div>

      {/* Group Expenses Split & Live Currency Converter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Split Group Expenses */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-400" />
              <h3 className="font-heading text-lg font-bold text-white">
                División de Gastos en Grupo (Split)
              </h3>
            </div>
            <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/20">
              Saldos en Vivo
            </span>
          </div>

          {/* Add Expense Form */}
          <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Concepto (ej. Cena trattoria)"
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(Number(e.target.value))}
              placeholder="Importe"
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-cyan-600 py-2 text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow cursor-pointer"
            >
              Registrar Gasto
            </button>
          </form>

          {/* Expenses List */}
          <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar pt-2">
            {expenses.map((exp) => (
              <div
                key={exp.id}
                className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950 p-3 text-xs"
              >
                <div>
                  <p className="font-bold text-white">{exp.description}</p>
                  <p className="text-[10px] text-slate-400">
                    Pagado por <span className="text-cyan-400">{exp.paidBy}</span> • {exp.date}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-heading font-black text-emerald-400 text-sm">
                    {formatMoney(exp.amount)}
                  </span>
                  <button
                    onClick={() => handleDeleteExpense(exp.id)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Currency Converter & Tipping Rules */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-400" />
            <h3 className="font-heading text-lg font-bold text-white">
              Conversor de Divisas Oficial
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Importe & Moneda Origen:
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={convAmount}
                  onChange={(e) => setConvAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-bold text-white focus:outline-none"
                />
                <select
                  value={convFrom}
                  onChange={(e) => setConvFrom(e.target.value as any)}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-2 py-2 text-xs font-bold text-slate-200"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="AED">AED (د.إ)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Moneda Destino:
              </label>
              <div className="flex gap-2">
                <div className="w-full rounded-xl border border-cyan-500/40 bg-slate-950 px-3 py-2 text-xs font-black text-cyan-400 truncate">
                  {convTo === 'JPY' ? Math.round(convertedValue).toLocaleString() : convertedValue.toFixed(2)}
                </div>
                <select
                  value={convTo}
                  onChange={(e) => setConvTo(e.target.value as any)}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-2 py-2 text-xs font-bold text-slate-200"
                >
                  <option value="JPY">JPY (¥)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AED">AED (د.إ)</option>
                  <option value="MXN">MXN</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tipping Guidelines Box */}
          <div className="border-t border-slate-800/80 pt-4">
            <span className="text-xs font-bold text-slate-300 block mb-2">
              Guía de Propinas por País:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {tippingRules.map((r, i) => (
                <div key={i} className="rounded-xl bg-slate-950 p-2.5 border border-slate-800/80">
                  <p className="font-bold text-white">{r.country}</p>
                  <p className="text-[11px] font-semibold text-cyan-400">{r.rule}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{r.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
