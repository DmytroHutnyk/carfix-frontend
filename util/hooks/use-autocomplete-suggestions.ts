/**
 * SOURCE: vis.gl react-google-maps<br>
 * URL: https://github.com/visgl/react-google-maps/tree/main/examples/autocomplete<br>
 * CITATION KEY: [G-MAPS-PLACES-01]<br>
 * ACCESSED: 2026-02-24<br>
 * DERIVATION: Based on the project’s example implementation.<br>
 * MODIFICATIONS:
 * - TODO
 */


import {useEffect, useRef, useState} from 'react';
import {useMapsLibrary} from '@vis.gl/react-google-maps';
import {useLanguage, useSearchLocation} from "@/util/state/store";
type AutocompleteSessionToken = google.maps.places.AutocompleteSessionToken;
type AutocompleteSuggestion = google.maps.places.AutocompleteSuggestion;
type AutocompleteRequest = google.maps.places.AutocompleteRequest;

export type UseAutocompleteSuggestionsReturn = {
  suggestions: AutocompleteSuggestion[];
  isLoading: boolean;
  resetSession: () => void;
};

/**
 * A reusable hook that retrieves autocomplete suggestions from the Google Places API.
 * The data is loaded from the new Autocomplete Data API.
 * (https://developers.google.com/maps/documentation/javascript/place-autocomplete-data)
 *
 * @param inputString The input string for which to fetch autocomplete suggestions.
 * @param requestOptions Additional options for the autocomplete request
 *   (See {@link https://developers.google.com/maps/documentation/javascript/reference/autocomplete-data#AutocompleteRequest}).
 *
 * @returns An object containing the autocomplete suggestions, the current loading-status,
 *   and a function to reset the session.
 *
 * @example
 * ```jsx
 * const MyComponent = () => {
 *   const [input, setInput] = useState('');
 *   const { suggestions, isLoading, resetSession } = useAutocompleteSuggestions(input, {
 *     includedPrimaryTypes: ['restaurant']
 *   });
 *
 *   return (
 *     <div>
 *       <input value={input} onChange={(e) => setInput(e.target.value)} />
 *       <ul>
 *         {suggestions.map(({placePrediction}) => (
 *           <li key={placePrediction.placeId}>{placePrediction.text.text}</li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAutocompleteSuggestions(
    inputString: string,
    requestOptions: Partial<AutocompleteRequest> = {}
): UseAutocompleteSuggestionsReturn {
    const placesLib = useMapsLibrary('places');
    const { country } = useSearchLocation((s) => s.searchLocation);
    const language = useLanguage((s) => s.language);

    // stores the current sessionToken
    const sessionTokenRef =
        useRef<AutocompleteSessionToken>(null);

    // the suggestions based on the specified input
    const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);

    // indicates if there is currently an incomplete request to the places API
    const [isLoading, setIsLoading] = useState(false);

    // once the PlacesLibrary is loaded and whenever the input changes, a query
    // is sent to the Autocomplete Data API.
    useEffect(() => {
        if (!placesLib) return;

        const {AutocompleteSessionToken, AutocompleteSuggestion} = placesLib;

        // Create a new session if one doesn't already exist. This has to be reset
        // after `fetchFields` for one of the returned places is called by calling
        // the `resetSession` function returned from this hook.
        if (!sessionTokenRef.current) {
            sessionTokenRef.current = new AutocompleteSessionToken();
        }

        const request: AutocompleteRequest = {
            ...requestOptions,
            input: inputString,
            includedPrimaryTypes: ["locality", "administrative_area_level_1", "country"],
            locationBias: "IP_BIAS",        /*Bias results to a specified location.*/
            includedRegionCodes: [country],  /*Only include results in the specified regions*/
            language: language,             /*The results may be in mixed languages if the language used in input is different from language, or if the returned Place does not have a translation from the local language to language.*/
            region: country,                 /*This affects address formatting, result ranking, and may influence what results are returned. This does not restrict results to the specified region.*/
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
        // is intentionally excluded to avoid re-fetching on every render (object
        // reference changes), and suggestions.length is only used in the
        // early-return guard.
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
