import { create } from "zustand";
import { persist } from "zustand/middleware";
import {Language, CountryCode, SearchLocation} from "@/lib/appTypes";

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
                    country: "PL", /*infer from browser or ip, idk TODO*/
                    lat: null,
                    lng: null,
            },
            setSearchLocation: (update) =>
                set((state) => ({
                        searchLocation: {...state.searchLocation, ...update},
                    })
                ),
        }),
        {
            name: 'search-location-storage',
            version: 1,
            migrate: (persistedState) => {
                const old = persistedState as { searchLocation?: Partial<SearchLocation> };
                return {
                    searchLocation: {
                        city: old.searchLocation?.city ?? null,
                        region: old.searchLocation?.region ?? null,
                        country: old.searchLocation?.country ?? "PL",
                        lat: old.searchLocation?.lat ?? null,
                        lng: old.searchLocation?.lng ?? null,
                    },
                } as SearchLocationStore;
            },
        }
    )
);

type SelectedCarProfileStore = {
    selectedCarProfileId: string | null;
    setSelectedCarProfileId: (id: string) => void;
};

export const useSelectedCarProfileId = create<SelectedCarProfileStore>()(
    persist(
        (set) => ({
            selectedCarProfileId: null,
            setSelectedCarProfileId: (id) => set({ selectedCarProfileId: id }),
        }),
        { name: 'selected-car-profile-storage' }
    )
);