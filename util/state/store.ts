import { create } from "zustand";
import { persist } from "zustand/middleware";
import {Language, CountryCode, SearchLocation} from "@/util/types/appTypes";

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

type SearchLocationStore ={
    searchLocation: SearchLocation;
    setSearchLocation: (update: Partial<SearchLocation>) => void;
}

export const useSearchLocation = create<SearchLocationStore>()(
    persist(
        (set) => ({
            searchLocation: {
                    city: null,
                    region: null,
                    country: "PL"
            },
            setSearchLocation: (update) =>
                set((state) => ({
                        searchLocation: {...state.searchLocation, ...update},
                    })
                ),
        }),
        { name: 'search-location-storage'}
    )
);