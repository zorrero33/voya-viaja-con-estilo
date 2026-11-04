import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserTier } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  updateUserTier: (tier: UserTier) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (open: boolean) => void;
  isSosModalOpen: boolean;
  setIsSosModalOpen: (open: boolean) => void;
  selectedDestinationId: string | null;
  setSelectedDestinationId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      if (data.success && data.data) {
        setUser(data.data);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateUserTier = async (tier: UserTier): Promise<boolean> => {
    try {
      const res = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, billingCycle: 'monthly', userEmail: user?.email })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        return true;
      }
    } catch (err) {
      console.error('Error upgrading tier:', err);
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        activeTab,
        setActiveTab,
        updateUserTier,
        refreshProfile: fetchProfile,
        isUpgradeModalOpen,
        setIsUpgradeModalOpen,
        isSosModalOpen,
        setIsSosModalOpen,
        selectedDestinationId,
        setSelectedDestinationId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
