"use client"

import {Search} from "lucide-react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useMemo} from "react";

import {Button} from "@/_components/shadcn/button";
import {useComboboxAnchor} from "@/_components/shadcn/combobox";
import SearchBar from "@/_components/root/header/searchBar";
import LocationSearchBar, {PickedPlace} from "@/_components/locationSearchBar";
import GoogleApiProvider from "@/lib/providers/googleApiProvider";

import {MIN_QUERY_LENGTH} from "@/features/search/useSearchSuggestions";
import {SearchSuggestion} from "@/features/search/searchTypes";
import {buildSearchUrl, parseSearchParams, searchTextFromParams, SearchIntent} from "@/features/search/searchUrl";
import {isCountryCode, SearchLocation} from "@/lib/appTypes";
import {useSearchLocation} from "@/lib/store";
import {useUrlDraft} from "@/lib/use-url-draft";

export default function SearchRow({initialLocation}: {initialLocation: SearchLocation}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const anchorRef = useComboboxAnchor();

    const storeLocation = useSearchLocation((s) => s.searchLocation);
    const setSearchLocation = useSearchLocation((s) => s.setSearchLocation);
    const persistedLocation = typeof window === "undefined" ? initialLocation : storeLocation;

    const params = useMemo(() => parseSearchParams(searchParams), [searchParams]);
    const onResultsPage = pathname === "/search";

    /* On /search the URL wins, so a shared link shows the location it actually searched including when it searched no city at all */
    const location: SearchLocation = onResultsPage
        ? {
            city: params.city,
            region: params.voivodeship,
            country: isCountryCode(params.country) ? params.country : persistedLocation.country,
            lat: params.lat,
            lng: params.lng,
        }
        : persistedLocation;

    const urlText = onResultsPage ? searchTextFromParams(params) : "";
    const [text, setText] = useUrlDraft(urlText);

    const urlLocationText = location.city
        ? (location.region ? `${location.city}, ${location.region}` : location.city)
        : "";
    const [locationText, setLocationText] = useUrlDraft(urlLocationText);

    const go = (intent: SearchIntent, into: SearchLocation = location) =>
        router.push(buildSearchUrl(intent, into));

    const currentIntent = (): SearchIntent => {
        const typed = text.trim();
        return typed.length >= MIN_QUERY_LENGTH ? {kind: "text", q: typed} : {kind: "browse"};
    };

    const submitTypedText = () => go(currentIntent());

    const handleSelect = (suggestion: SearchSuggestion) => {
        switch (suggestion.kind) {
            case "service":
                go({kind: "service", serviceName: suggestion.name});
                break;
            case "category":
                go({kind: "category", categoryId: suggestion.categoryId, name: suggestion.name});
                break;
            case "workshop":
                go({kind: "workshop", branchId: suggestion.branchId, name: suggestion.name});
                break;
        }
    };

    const handlePlaceSelected = (place: PickedPlace) => {
        const next: SearchLocation = {
            city: place.city,
            region: place.region,
            country: place.country ?? location.country,
            lat: place.lat,
            lng: place.lng,
        };
        setSearchLocation(next);
        if (onResultsPage) go(currentIntent(), next);
    };

    const handleCleared = () => {
        const cleared: SearchLocation = {city: null, region: null, country: location.country, lat: null, lng: null};
        setSearchLocation(cleared);
        if (onResultsPage) go(currentIntent(), cleared);
    };

    return (
        <div ref={anchorRef} className="flex flex-1 items-center gap-3">
            <div className="flex-1">
                <SearchBar
                    value={text}
                    onValueChange={setText}
                    onSubmit={submitTypedText}
                    onSelect={handleSelect}
                    anchorRef={anchorRef}
                />
            </div>

            <div className="relative w-56">
                <GoogleApiProvider>
                    <LocationSearchBar
                        value={locationText}
                        onValueChange={setLocationText}
                        onPlaceSelected={handlePlaceSelected}
                        onCleared={handleCleared}
                    />
                </GoogleApiProvider>
            </div>

            <Button onClick={submitTypedText}>
                <Search className="h-4 w-4"/>
                Search
            </Button>
        </div>
    );
}
