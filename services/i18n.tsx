import React, {
  createContext,
  useContext,
  useMemo,
  useState,
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

type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

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

        return typeof result === "string" ? result : key;
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