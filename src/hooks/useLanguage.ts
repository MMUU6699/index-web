"use client";

import { useLocalStorage } from "@mantine/hooks";
import { LANGUAGE_STORAGE_KEY } from "@/utils/constants";

export type Language = "en-US" | "ar-SA";

export const useLanguage = () => {
  const [language, setLanguage] = useLocalStorage<Language>({
    key: LANGUAGE_STORAGE_KEY,
    defaultValue: "en-US",
    getInitialValueInEffect: false,
  });

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en-US" ? "ar-SA" : "en-US"));
  };

  return { language, setLanguage, toggleLanguage };
};

export default useLanguage;
