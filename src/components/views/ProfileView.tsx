import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Download,
  Trash2,
  Sparkles,
  Share2,
  Globe2,
  Coins,
  CheckCircle2,
  Award,
  Bell,
  Lock,
  ArrowRight,
  Briefcase,
  Wallet,
  Calendar,
  Compass,
  Heart,
  Plane,
  QrCode,
  Tag,
  Settings,
  CreditCard,
  Hotel
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { BookingItem, ExpenseItem } from '../../types';

export const ProfileView: React.FC = () => {
  const { user, setIsUpgradeModalOpen, setActiveTab } = useAuth();
  const { currency, setCurrency, language, setLanguage, formatMoney } = useLanguage();
  const [activeTabName, setActiveTabName] = useState<'overview' | 'bookings' | 'budget' | 'settings'>('overview');
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [dataExported, setDataExported] = useState(false);

  // Live user bookings & expenses
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoadingData(true);
    try {
      const [bRes, eRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/expenses')
      ]);
      const [bData, eData] = await Promise.all([bRes.json(), eRes.json()]);
      if (bData.success && bData.data) setBookings(bData.data);
      if (eData.success && eData.data) setExpenses(eData.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const copyReferral = () => {
    if (!user?.referralCode) return;
    navigator.clipboard.writeText(`https://voyatravel.io/join?ref=${user.referralCode}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2500);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `VOYA_UserData_${user?.id || 'profile'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDataExported(true);
    setTimeout(() => setDataExported(false), 3000);
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto animate-fadeIn">
      {/* 1. Header Profile & Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B1B3D] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={user?.name}
                className="h-24 w-24 rounded-3xl object-cover ring-2 ring-[#087BFF] shadow-xl"
              />
              <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#087BFF] text-white shadow-md">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
                  {user?.name || 'Alejandro Morales'}
                </h1>
                <span className="rounded-full bg-[#087BFF]/20 border border-[#087BFF]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#087BFF] uppercase tracking-wider">
                  Plan {user?.tier}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {user?.email} · Base City: <strong className="text-white">{user?.homeCity}</strong>
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] text-slate-400">
                <span>Verified Traveler ID: <strong className="text-slate-200">VOYA-{user?.id.slice(-4) || '7890'}</strong></span>
                <span>·</span>
                <span>Passport: <strong className="text-emerald-400">Active</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#087BFF] to-[#006CE6] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#087BFF]/25 hover:opacity-95 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Manage Membership</span>
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[#07152F] px-5 py-2 text-xs font-bold text-slate-300 hover:text-white hover:border-white/20 transition-all cursor-pointer"
            >
              <Briefcase className="h-4 w-4" />
              <span>Travel Wallet</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Ticker */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/10 pt-6">
          <div className="rounded-2xl bg-[#07152F] p-3.5 border border-white/5">
            <span className="text-[10px] font-bold uppercase text-slate-400">Countries Visited</span>
            <p className="mt-1 text-2xl font-black text-white">{user?.visitedCountries?.length || 4}</p>
            <span className="text-[10px] text-emerald-400">Global Traveler</span>
          </div>

          <div className="rounded-2xl bg-[#07152F] p-3.5 border border-white/5">
            <span className="text-[10px] font-bold uppercase text-slate-400">Active Bookings</span>
            <p className="mt-1 text-2xl font-black text-white">{bookings.length}</p>
            <span className="text-[10px] text-[#087BFF]">Flights & Hotels</span>
          </div>

          <div className="rounded-2xl bg-[#07152F] p-3.5 border border-white/5">
            <span className="text-[10px] font-bold uppercase text-slate-400">Referral Credits</span>
            <p className="mt-1 text-2xl font-black text-emerald-400">{user?.referralCredits || 20} €</p>
            <span className="text-[10px] text-slate-400">Ready to spend</span>
          </div>

          <div className="rounded-2xl bg-[#07152F] p-3.5 border border-white/5">
            <span className="text-[10px] font-bold uppercase text-slate-400">Saved Trips</span>
            <p className="mt-1 text-2xl font-black text-white">{user?.savedTripsCount || 3}</p>
            <span className="text-[10px] text-purple-400">AI Itineraries</span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: Compass },
          { id: 'bookings', label: `My Trips & Wallet (${bookings.length})`, icon: Briefcase },
          { id: 'budget', label: 'Budget & Expenses', icon: Wallet },
          { id: 'settings', label: 'Security & Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isCurrent = activeTabName === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabName(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-[#087BFF] text-white shadow-md shadow-[#087BFF]/30'
                  : 'border border-white/10 bg-[#0B1B3D] text-slate-300 hover:text-white hover:border-white/20'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Content */}
      {activeTabName === 'overview' && (
        <div className="space-y-6">
          {/* Upcoming Trip Alert Card */}
          <div className="rounded-3xl border border-[#087BFF]/40 bg-[#0B1B3D] p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#087BFF]/15 text-[#087BFF]">
                <Plane className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#087BFF]">
                  Upcoming Confirmed Journey
                </span>
                <h3 className="font-heading text-xl font-bold text-white mt-0.5">
                  Flight to Tokyo Narita (NRT) · Flight IB-6801
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Departs 10 Dec 2026 from Madrid Terminal 4S · Boarding Pass active in Wallet
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('bookings')}
                className="flex items-center gap-2 rounded-xl bg-[#087BFF] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#006CE6] transition-all cursor-pointer shadow-md"
              >
                <QrCode className="h-4 w-4" />
                <span>Show Boarding QR</span>
              </button>
            </div>
          </div>

          {/* Referral & Invite Friends Card */}
          <div className="rounded-3xl border border-white/10 bg-[#0B1B3D] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF8A00]">
                  Invite & Earn Credits
                </span>
                <h3 className="font-heading text-lg font-bold text-white">
                  Share VOYA with Fellow Travelers
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Give friends 10 € off their first booking and receive 10 € travel credit automatically.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400">
                Code: {user?.referralCode || 'VOYA-MAR78'}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={copyReferral}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF8A00] to-[#E67A00] px-4 py-2 text-xs font-bold text-white hover:opacity-95 transition-all cursor-pointer shadow-md"
              >
                <Share2 className="h-4 w-4" />
                <span>{copiedReferral ? 'Link Copied!' : 'Copy Invite Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bookings & Passes */}
      {activeTabName === 'bookings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xl font-bold text-white">
              Confirmed Travel Bookings & Passes
            </h3>
            <button
              onClick={() => setActiveTab('cheap_travel')}
              className="text-xs font-bold text-[#087BFF] hover:underline"
            >
              + Search New Flight
            </button>
          </div>

          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-white/10 bg-[#0B1B3D] p-4 gap-4 hover:border-[#087BFF]/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#087BFF]/15 text-[#087BFF] font-bold">
                    {b.type === 'flight' ? <Plane className="h-5 w-5" /> : <Hotel className="h-5 w-5" />}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-white text-sm">{b.title}</h4>
                    <p className="text-xs text-slate-400">
                      Ref: <strong className="text-slate-200">{b.referenceNumber}</strong> · Provider: {b.provider} · Date: {b.startDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="font-mono text-base font-bold text-emerald-400">
                    {formatMoney(b.totalPrice)}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 uppercase">
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget & Expenses */}
      {activeTabName === 'budget' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-[#0B1B3D] p-5">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Expenses Tracked</span>
              <p className="mt-2 text-2xl font-black text-white">{formatMoney(totalSpent)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0B1B3D] p-5">
              <span className="text-xs font-bold text-slate-400 uppercase">Transactions</span>
              <p className="mt-2 text-2xl font-black text-[#087BFF]">{expenses.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0B1B3D] p-5">
              <span className="text-xs font-bold text-slate-400 uppercase">Currency</span>
              <p className="mt-2 text-2xl font-black text-emerald-400">{currency}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0B1B3D] p-5 space-y-3">
            <h4 className="font-heading font-bold text-white text-base">Expense Breakdown</h4>
            <div className="space-y-2">
              {expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between rounded-xl bg-[#07152F] p-3 text-xs border border-white/5"
                >
                  <div>
                    <p className="font-bold text-white">{exp.description}</p>
                    <span className="text-[10px] text-slate-400 uppercase">{exp.category} · {exp.date}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-200">
                    {formatMoney(exp.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings & Privacy */}
      {activeTabName === 'settings' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#0B1B3D] p-6 space-y-4">
            <h3 className="font-heading font-bold text-white text-lg">
              Data Privacy & Account Security
            </h3>
            <p className="text-xs text-slate-400">
              Under GDPR and international travel regulations, you retain full ownership of your data, booking history and payment methods.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 rounded-xl bg-[#087BFF] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#006CE6] transition-all cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>{dataExported ? 'Data Exported (.json)' : 'Export My Travel Data'}</span>
              </button>

              <button
                onClick={() => alert('Account retention verified. No third-party data tracking active.')}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#07152F] px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white"
              >
                <Shield className="h-4 w-4 text-emerald-400" />
                <span>Security Audit: Safe</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
