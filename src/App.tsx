/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { UpgradeModal } from './components/modals/UpgradeModal';
import { SosModal } from './components/modals/SosModal';

// Views
import { HomeView } from './components/views/HomeView';
import { ExplorerView } from './components/views/ExplorerView';
import { CheapTravelView } from './components/views/CheapTravelView';
import { HotelsView } from './components/views/HotelsView';
import { HomesView } from './components/views/HomesView';
import { ExperiencesView } from './components/views/ExperiencesView';
import { TransportView } from './components/views/TransportView';
import { InsuranceView } from './components/views/InsuranceView';
import { VisasView } from './components/views/VisasView';
import { BusinessSaasView } from './components/views/BusinessSaasView';
import { TripPlannerView } from './components/views/TripPlannerView';
import { MapsView } from './components/views/MapsView';
import { AssistantView } from './components/views/AssistantView';
import { TranslatorView } from './components/views/TranslatorView';
import { BookingsView } from './components/views/BookingsView';
import { MoneyView } from './components/views/MoneyView';
import { SafetyView } from './components/views/SafetyView';
import { EsimView } from './components/views/EsimView';
import { CommunityView } from './components/views/CommunityView';
import { ShopView } from './components/views/ShopView';
import { PricingView } from './components/views/PricingView';
import { AdminView } from './components/views/AdminView';
import { ProfileView } from './components/views/ProfileView';

const MainAppContent: React.FC = () => {
  const { activeTab } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'explore':
        return <ExplorerView />;
      case 'cheap_travel':
        return <CheapTravelView />;
      case 'hotels':
        return <HotelsView />;
      case 'homes':
        return <HomesView />;
      case 'experiences':
        return <ExperiencesView />;
      case 'transport':
        return <TransportView />;
      case 'insurance':
        return <InsuranceView />;
      case 'visas':
        return <VisasView />;
      case 'business_saas':
        return <BusinessSaasView />;
      case 'planner':
        return <TripPlannerView />;
      case 'maps':
        return <MapsView />;
      case 'assistant':
        return <AssistantView />;
      case 'translator':
        return <TranslatorView />;
      case 'trips':
      case 'bookings':
        return <BookingsView />;
      case 'money':
        return <MoneyView />;
      case 'safety':
        return <SafetyView />;
      case 'esim':
        return <EsimView />;
      case 'community':
        return <CommunityView />;
      case 'shop':
        return <ShopView />;
      case 'pricing':
        return <PricingView />;
      case 'admin':
        return <AdminView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07152F] text-slate-100 font-sans">
      {/* Desktop Left Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Scrollable Main View Container */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 pb-24 md:pb-12">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Modals */}
      <UpgradeModal />
      <SosModal />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
