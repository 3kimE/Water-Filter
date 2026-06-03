"use client";

import { createContext, useContext } from "react";
import type { SiteSettings } from "@/lib/data";

const SettingsContext = createContext<SiteSettings | null>(null);

export function SettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SiteSettings {
  const s = useContext(SettingsContext);
  if (!s) throw new Error("useSettings must be used within a SettingsProvider");
  return s;
}
