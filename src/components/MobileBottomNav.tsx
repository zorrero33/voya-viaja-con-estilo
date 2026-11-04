import React from 'react';
import { Compass, Globe2, Briefcase, Bot, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useAuth();
  const { t } = useLanguage();

  const items = [
    { id: 'home', label: t('navHome'), icon: Compass },
    { id: 'explore', label: t('navExplore'), icon: Globe2 },
    { id: 'trips', label: t('navTrips'), icon: Briefcase },
    { id: 'assistant', label: 'AI Concierge', icon: Bot },
    { id: 'profile', label: t('navProfile'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#07152F]/95 backdrop-blur-xl md:hidden pb-safe">
      <div className="flex h-16 items-center justify-around px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
                isActive ? 'text-[#087BFF]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-110 text-[#087BFF]' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#087BFF] shadow-[0_0_8px_#087BFF]" />
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-bold text-white' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
