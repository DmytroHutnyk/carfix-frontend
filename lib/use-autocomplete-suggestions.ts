// Based on vis.gl's autocomplete example, accessed 2026-02-24:
// https://github.com/visgl/react-google-maps/tree/main/examples/autocomplete

import {useEffect, useRef, useState} from 'react';
import {useMapsLibrary} from '@vis.gl/react-google-maps';
import {useLanguage, useSearchLocation} from "@/lib/store";
type AutocompleteSessionToken = google.maps.places.AutocompleteSessionToken;
type AutocompleteSuggestion = google.maps.places.AutocompleteSuggestion;
type AutocompleteRequest = google.maps.places.AutocompleteRequest;

export type UseAutocompleteSuggestionsReturn = {
  suggestions: AutocompleteSuggestion[];
  isLoading: boolean;
  resetSession: () => void;
};

export function useAutocompleteSuggestions(
    inputString: string,
    requestOptions: Partial<AutocompleteRequest> = {}
): UseAutocompleteSuggestionsReturn {
    const placesLib = useMapsLibrary('places');
    const country = useSearchLocation((s) => s.searchLocation.country);
    const language = useLanguage((s) => s.language);

    const sessionTokenRef =
        useRef<AutocompleteSessionToken>(null);

    const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!placesLib) return;

        const {AutocompleteSessionToken, AutocompleteSuggestion} = placesLib;

        // One token groups requests until the selected place closes Google's billing session.
        if (!sessionTokenRef.current) {
            sessionTokenRef.current = new AutocompleteSessionToken();
        }

        const request: AutocompleteRequest = {
            includedPrimaryTypes: ["locality", "administrative_area_level_1", "country"],
            locationBias: "IP_BIAS",
            includedRegionCodes: [country],
            language: language,
            region: country,
            ...requestOptions,
            input: inputString,
            sessionToken: sessionTokenRef.current
        };

        if (inputString === '') {
            if (suggestions.length > 0) setSuggestions([]);
            return;
        }

        setIsLoading(true);
        AutocompleteSuggestion.fetchAutocompleteSuggestions(request).then(res => {
            setSuggestions(res.suggestions);
            setIsLoading(false);
        });
        // requestOptions changes by identity; suggestions only guards clearing.
        // eslint-disable-next-line react-hooks/exhaustive-deps -- requestOptions
    }, [placesLib, inputString, country, language]);

    return {
        suggestions,
        isLoading,
        resetSession: () => {
            sessionTokenRef.current = null;
            setSuggestions([]);
        }
    };
}
