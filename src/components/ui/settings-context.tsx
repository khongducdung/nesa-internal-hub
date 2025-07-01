
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  hideDescriptions: boolean;
  toggleDescriptions: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [hideDescriptions, setHideDescriptions] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hideDescriptions');
    if (saved) {
      setHideDescriptions(JSON.parse(saved));
    }
  }, []);

  const toggleDescriptions = () => {
    const newValue = !hideDescriptions;
    setHideDescriptions(newValue);
    localStorage.setItem('hideDescriptions', JSON.stringify(newValue));
  };

  return (
    <SettingsContext.Provider value={{ hideDescriptions, toggleDescriptions }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
