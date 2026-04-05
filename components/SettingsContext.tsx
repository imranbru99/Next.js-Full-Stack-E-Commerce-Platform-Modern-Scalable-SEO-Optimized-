"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// 1. Define the shape of our settings
interface SettingsContextType {
  currency: string;
  currencySymbol: string;
  setCurrencyData: (code: string, symbol: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// 2. Create the Provider
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState("USD");
  const [currencySymbol, setCurrencySymbol] = useState("$");

  const setCurrencyData = (code: string, symbol: string) => {
    setCurrency(code);
    setCurrencySymbol(symbol);
  };

  return (
    <SettingsContext.Provider value={{ currency, currencySymbol, setCurrencyData }}>
      {children}
    </SettingsContext.Provider>
  );
}

// 3. Create a custom hook for easy use
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within a SettingsProvider");
  return context;
};