import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  ReactNode,
} from "react";

import en from "../locales/en.json";
import ru from "../locales/ru.json";
import et from "../locales/et.json";

export type Language = "en" | "ru" | "et";

type Messages = typeof en;

const dictionaries: Record<Language, Messages> = {
  en,
  ru,
  et,
};

const STORAGE_KEY = "portfolio-lang";

const META_DESCRIPTION: Record<Language, string> = {
  en: "Senior Product & UX Designer with 9+ years of experience in fintech: credit products, payments, personal accounts and analytical interfaces.",
  ru: "Senior Product & UX Designer с опытом более 9 лет в финтехе: кредитные продукты, платежи, личные кабинеты и аналитические интерфейсы.",
  et: "Senior Product & UX Designer üle 9-aastase kogemusega fintechis: krediiditooted, maksed, isiklikud kontod ja analüütilised liidesed.",
};

const getStoredLanguage = (): Language => {
  if (typeof window === "undefined") return "en";
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (stored === "en" || stored === "ru" || stored === "et")) {
      return stored as Language;
    }
  } catch (error) {
    console.warn("Failed to read language from localStorage:", error);
  }
  
  return "en";
};

type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(getStoredLanguage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      console.warn("Failed to save language to localStorage:", error);
    }
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    const description = META_DESCRIPTION[language];
    document
      .querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]')
      .forEach((el) => el.setAttribute("content", description));
  }, [language]);

  const value = useMemo<I18nContextType>(
    () => ({
      language,
      setLanguage,
      t: (key: string) => {
        const dict = dictionaries[language] || dictionaries.en;

        // поддержка вложенных ключей: "hero.expertiseTitle"
        const result = key.split(".").reduce<any>((acc, part) => {
          if (!acc) return undefined;
          return acc[part];
        }, dict);

        if (typeof result === "string") return result;
        const fallback = key.split(".").reduce<any>((acc, part) => (acc ? acc[part] : undefined), dictionaries.en);
        return typeof fallback === "string" ? fallback : key;
      },
    }),
    [language]
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return ctx;
};

// Фолбэк-функция, чтобы старые импорты `t` не ломали билд
export const t = (key: string, lang: Language = "en") => {
  const dict = dictionaries[lang] || dictionaries.en;
  const result = key.split(".").reduce<any>((acc, part) => {
    if (!acc) return undefined;
    return acc[part];
  }, dict);
  return typeof result === "string" ? result : key;
};