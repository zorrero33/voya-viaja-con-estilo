import React from 'react';
import {
  Compass,
  Globe2,
  Ticket,
  CalendarDays,
  MapPin,
  Bot,
  Languages,
  Briefcase,
  Wallet,
  ShieldCheck,
  Wifi,
  Award,
  ShoppingBag,
  Sparkles,
  Sliders,
  ChevronRight,
  Hotel,
  Home,
  Palmtree,
  Car,
  FileCheck,
  Building2,
  Umbrella
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, user } = useAuth();
  const { t } = useLanguage();

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onClose) onClose();
  };

  const navGroups = [
    {
      title: 'Travel Ecosystem',
      items: [
        { id: 'home', label: 'Home', icon: Compass, badge: null },
        { id: 'explore', label: 'Explore World', icon: Globe2, badge: 'Global' },
        { id: 'cheap_travel', label: 'VOYA Flights', icon: Ticket, badge: 'Live' },
        { id: 'hotels', label: 'VOYA Hotels', icon: Hotel, badge: 'OTA' },
        { id: 'homes', label: 'VOYA Homes', icon: Home, badge: 'Rentals' },
        { id: 'experiences', label: 'Experiences & Tours', icon: Palmtree, badge: 'Activities' },
        { id: 'transport', label: 'Car Rentals & Transfers', icon: Car, badge: 'Drive' },
      ]
    },
    {
      title: 'AI & Intelligence',
      items: [
        { id: 'assistant', label: '10 AI Brain Agents', icon: Bot, badge: 'Gemini' },
        { id: 'planner', label: 'AI Trip Planner', icon: CalendarDays, badge: 'Smart' },
        { id: 'translator', label: 'Voice & Camera Translator', icon: Languages, badge: 'Offline' },
        { id: 'maps', label: 'Maps & Offline GPS', icon: MapPin, badge: null },
      ]
    },
    {
      title: 'Traveler Protection',
      items: [
        { id: 'visas', label: 'Official Visa & Passports', icon: FileCheck, badge: 'Embassy' },
        { id: 'insurance', label: 'International Insurance', icon: Umbrella, badge: 'DGSFP' },
        { id: 'safety', label: 'Safety & SOS 24/7', icon: ShieldCheck, badge: 'Emergency' },
        { id: 'esim', label: 'Global 5G eSIM', icon: Wifi, badge: 'Data' },
      ]
    },
    {
      title: 'Management & B2B',
      items: [
        { id: 'trips', label: 'My Saved Trips', icon: CalendarDays, badge: String(user?.savedTripsCount || 0) },
        { id: 'bookings', label: 'Travel Wallet & Passes', icon: Briefcase, badge: 'Wallet' },
        { id: 'money', label: 'Multi-Currency Budget', icon: Wallet, badge: 'FX' },
        { id: 'business_saas', label: 'B2B Agency Portal', icon: Building2, badge: 'CRM' },
      ]
    },
    {
      title: 'Community & Monetization',
      items: [
        { id: 'community', label: 'Digital Passport', icon: Award, badge: `${user?.visitedCountries?.length || 0} pts` },
        { id: 'shop', label: 'VOYA Shop & Accessories', icon: ShoppingBag, badge: 'Gear' },
        { id: 'pricing', label: 'Premium Subscriptions', icon: Sparkles, badge: 'Plus/Pro' },
        { id: 'admin', label: 'Master Admin Supreme', icon: Sliders, badge: 'Console' },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#07152F]/80 backdrop-blur-md md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 z-50 flex w-72 flex-col border-r border-white/8 bg-[#07152F] transition-transform duration-300 ease-in-out md:static md:z-20 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Official Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/8 px-5 shrink-0 bg-[#0B1B3D]/30">
          <div
            onClick={() => handleNavClick('home')}
            className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-90"
          >
            <img
              src="/brand/voya-symbol.svg"
              alt="VOYA Symbol"
              className="h-8 w-auto drop-shadow-[0_2px_10px_rgba(8,123,255,0.4)]"
            />
            <div>
              <span className="font-heading text-xl font-black tracking-wider text-white">
                VOYA
              </span>
              <p className="text-[9px] font-bold text-[#087BFF] uppercase tracking-widest -mt-0.5">
                ULTIMATE SUPERAPP
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.title}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#087BFF]/15 text-white border border-[#087BFF]/30 shadow-sm shadow-[#087BFF]/15'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-[#087BFF]' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          isActive
                            ? 'bg-[#087BFF]/25 text-[#087BFF]'
                            : 'bg-white/5 text-slate-400 group-hover:text-slate-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Card & Slogan at Bottom */}
        <div className="border-t border-white/8 p-3 bg-[#0B1B3D]/40 shrink-0">
          <div
            onClick={() => handleNavClick('profile')}
            className="flex cursor-pointer items-center justify-between rounded-xl p-2 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={user?.name || 'Traveler'}
                className="h-9 w-9 rounded-full object-cover ring-1 ring-[#087BFF]/40"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-white truncate max-w-[120px]">
                  {user?.name || 'VOYA Traveler'}
                </p>
                <p className="text-[10px] text-[#087BFF] font-semibold capitalize">
                  Plan {user?.tier || 'Free'} • {user?.homeCity || 'Madrid'}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-2 rounded-lg bg-[#07152F] p-2 text-center border border-white/5">
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              "DISCOVER THE WORLD. TRAVEL MORE."
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
