import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Language } from "@/util/types/app";

type LanguageStore = {
    language: Language;
    setLanguage: (language: Language) => void;
};

export const useLanguage = create<LanguageStore>()(
    persist(
        (set) => ({
            language: "EN",
            setLanguage: (language) => set({ language }),
        }),
        { name: 'language-storage' }
    )
);