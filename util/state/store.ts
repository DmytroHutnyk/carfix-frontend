import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Language, RegionCode } from "@/util/types/appTypes";

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

type RegionStore = {
    region: RegionCode;
    setRegion: (region: RegionCode) => void;
};

export const useRegion = create<RegionStore>()(
    persist(
        (set) => ({
            region: "PL",
            setRegion: (region) => set({ region }),
        }),
        { name: 'region-storage' }
    )
);