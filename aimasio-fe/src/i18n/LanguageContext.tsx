import { createContext, useContext, useEffect, useState } from "react";

type Language = "vi" | "en" | "jp";

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "yourhr_language";

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("vi");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored === "vi" || stored === "en" || stored === "jp") {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    window.localStorage.setItem(STORAGE_KEY, lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
};

