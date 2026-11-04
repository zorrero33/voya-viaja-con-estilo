import React from 'react';
import {
  Globe,
  Coins,
  ShieldAlert,
  Sparkles,
  Search,
  Menu,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { LanguageCode, CurrencyCode } from '../types';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const LANGUAGES: Array<{ code: LanguageCode; label: string; flag: string }> = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'العربية (RTL)', flag: '🇦🇪' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'zh', label: '简体中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

const CURRENCIES: Array<{ code: CurrencyCode; label: string }> = [
  { code: 'EUR', label: 'EUR (€)' },
  { code: 'USD', label: 'USD ($)' },
  { code: 'GBP', label: 'GBP (£)' },
  { code: 'JPY', label: 'JPY (¥)' },
  { code: 'AED', label: 'AED (د.إ)' },
  { code: 'CAD', label: 'CAD (C$)' },
  { code: 'CHF', label: 'CHF' },
  { code: 'MXN', label: 'MXN (Mex$)' },
];

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { language, setLanguage, currency, setCurrency, t } = useLanguage();
  const { user, setIsUpgradeModalOpen, setIsSosModalOpen, activeTab, setActiveTab } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/8 bg-[#07152F]/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile trigger & Official Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#0B1B3D] text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Official VOYA Brand Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex cursor-pointer items-center gap-2.5 transition-transform hover:opacity-95"
          >
            <img
              src="/brand/voya-symbol.svg"
              alt="VOYA Symbol"
              className="h-8 w-auto drop-shadow-[0_2px_12px_rgba(8,123,255,0.4)]"
            />
            <div className="flex flex-col">
              <span className="font-heading text-xl font-black tracking-wider text-white">
                VOYA
              </span>
              <span className="text-[9px] font-bold tracking-widest text-[#087BFF] uppercase -mt-1">
                ULTIMATE
              </span>
            </div>
          </div>

          {/* Desktop Direct Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 pl-4 border-l border-white/10">
            {[
              { id: 'explore', label: 'Explore' },
              { id: 'cheap_travel', label: 'Flights' },
              { id: 'hotels', label: 'Hotels' },
              { id: 'experiences', label: 'Experiences' },
              { id: 'assistant', label: 'Travel AI' },
              { id: 'business_saas', label: 'Business B2B' }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === link.id
                    ? 'text-white bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Center Quick Search (Mid-Large Screens) */}
        <div className="hidden lg:flex items-center relative w-64 xl:w-80">
          <Search className="absolute left-3.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search flights, destinations, hotels..."
            onClick={() => setActiveTab('explore')}
            readOnly
            className="w-full rounded-full border border-white/10 bg-[#0B1B3D]/80 py-1.5 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-400 focus:border-[#087BFF] focus:outline-none transition-all cursor-pointer"
          />
        </div>

        {/* Right Tools: Currency, Language, SOS, Subscription, User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Selector */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              aria-label="Select currency"
              className="appearance-none rounded-xl border border-white/10 bg-[#0B1B3D] px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-white/20 focus:outline-none focus:border-[#087BFF] cursor-pointer pr-6"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#07152F] text-slate-200">
                  {c.code}
                </option>
              ))}
            </select>
            <Coins className="pointer-events-none absolute right-2 top-2 h-3 w-3 text-slate-400" />
          </div>

          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              aria-label="Select language"
              className="appearance-none rounded-xl border border-white/10 bg-[#0B1B3D] px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-white/20 focus:outline-none focus:border-[#087BFF] cursor-pointer pr-6"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-[#07152F] text-slate-200">
                  {l.flag} {l.code.toUpperCase()}
                </option>
              ))}
            </select>
            <Globe className="pointer-events-none absolute right-2 top-2 h-3 w-3 text-slate-400" />
          </div>

          {/* SOS Emergency Button */}
          <button
            onClick={() => setIsSosModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
            title="Emergency SOS & Consular Support"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">SOS</span>
          </button>

          {/* Upgrade CTA / Tier Badge */}
          {user?.tier === 'free' ? (
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF8A00] to-[#E67A00] px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-[#FF8A00]/25 hover:opacity-95 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">VOYA Plus</span>
              <span className="sm:hidden">Plus</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('pricing')}
              className="flex items-center gap-1.5 rounded-xl border border-[#087BFF]/40 bg-[#087BFF]/15 px-3 py-1.5 text-xs font-bold text-[#087BFF] hover:bg-[#087BFF]/25 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="capitalize">{user?.tier}</span>
            </button>
          )}

          {/* User Profile Avatar */}
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0B1B3D] p-1 pr-2.5 hover:border-white/20 transition-all cursor-pointer"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={user?.name || 'User Profile'}
              className="h-7 w-7 rounded-lg object-cover ring-1 ring-[#087BFF]/50"
            />
            <span className="hidden md:inline text-xs font-bold text-slate-200 truncate max-w-[80px]">
              {user?.name?.split(' ')[0] || 'Traveler'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
