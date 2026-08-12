import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {Language, SearchLocation} from "@/lib/appTypes";
import {cookieStorage} from "@/lib/cookieStorage";
import {DEFAULT_SEARCH_LOCATION, SEARCH_LOCATION_COOKIE} from "@/lib/searchLocationCookie";

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

/* A cookie, not localStorage: the server reads it in (main)/layout.tsx so the header
   renders the real location on first paint instead of gating on hydration. */
export const useSearchLocation = create<SearchLocationStore>()(
    persist(
        (set) => ({
            searchLocation: DEFAULT_SEARCH_LOCATION,
            setSearchLocation: (update) =>
                set((state) => ({
                        searchLocation: {...state.searchLocation, ...update},
                    })
                ),
        }),
        {
            name: SEARCH_LOCATION_COOKIE,
            version: 1,
            storage: createJSONStorage(() => cookieStorage),
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