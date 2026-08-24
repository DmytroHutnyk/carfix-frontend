"use client"

import {Search} from "lucide-react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useMemo, useState, useSyncExternalStore} from "react";
import {format} from "date-fns";

import {Button} from "@/_components/shadcn/button";
import {useComboboxAnchor} from "@/_components/shadcn/combobox";
import SearchBar, {SearchBarFieldProps} from "@/_components/root/header/searchBar";
import LocationSearchBar, {LocationFieldProps, PickedPlace} from "@/_components/locationSearchBar";
import MobileSearchSheet from "@/_components/root/header/mobileSearchSheet";
import GoogleApiProvider from "@/lib/providers/googleApiProvider";

import {MIN_QUERY_LENGTH} from "@/features/search/useSearchSuggestions";
import {SearchSuggestion} from "@/features/search/searchTypes";
import {buildSearchUrl, parseSearchParams, searchTextFromParams, SearchIntent} from "@/features/search/searchUrl";
import {countryName, isCountryCode, SearchLocation} from "@/lib/appTypes";
import {useSearchLocation} from "@/lib/store";
import {useUrlDraft} from "@/lib/use-url-draft";

const subscribeToNothing = () => () => {};

const dayLabel = (iso: string) => format(new Date(`${iso}T00:00:00`), "MMM d");

export default function SearchRow({initialLocation}: {initialLocation: SearchLocation}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const anchorRef = useComboboxAnchor();

    const [sheetOpen, setSheetOpen] = useState(false);

    const storeLocation = useSearchLocation((s) => s.searchLocation);
    const setSearchLocation = useSearchLocation((s) => s.setSearchLocation);
    /* While hydrating, the persisted store still reports its default; the cookie the server rendered with wins until then. */
    const hydrated = useSyncExternalStore(subscribeToNothing, () => true, () => false);
    const persistedLocation = hydrated ? storeLocation : initialLocation;

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

    const searchField: SearchBarFieldProps = {
        value: text,
        onValueChange: setText,
        onSubmit: submitTypedText,
        onSelect: handleSelect,
    };

    const locationField: LocationFieldProps = {
        value: locationText,
        onValueChange: setLocationText,
        onPlaceSelected: handlePlaceSelected,
        onCleared: handleCleared,
    };

    const closeSheet = () => setSheetOpen(false);

    const sheetSearchField: SearchBarFieldProps = {
        ...searchField,
        onSubmit: () => {
            submitTypedText();
            closeSheet();
        },
        onSelect: (suggestion) => {
            handleSelect(suggestion);
            closeSheet();
        },
    };

    /* Every other way out of the sheet is a navigation — a suggestion picked, a place picked on /search */
    const paramsKey = searchParams.toString();
    useEffect(() => {
        setSheetOpen(false);
    }, [pathname, paramsKey]);

    const dates = params.from && params.to
        ? (params.from === params.to ? dayLabel(params.from) : `${dayLabel(params.from)} – ${dayLabel(params.to)}`)
        : "Any date";
    const pillSummary = `${location.city ?? countryName(location.country) ?? location.country} · ${dates}`;

    return (
        <GoogleApiProvider>
            <div ref={anchorRef} className="hidden flex-1 items-center gap-3 lg:flex">
                {!sheetOpen && (
                    <>
                        <div className="min-w-0 flex-1">
                            <SearchBar {...searchField} anchorRef={anchorRef}/>
                        </div>

                        <div className="relative w-56 min-w-0">
                            <LocationSearchBar {...locationField}/>
                        </div>

                        <Button onClick={submitTypedText} aria-label="Search" className="shrink-0">
                            <Search className="h-4 w-4"/>
                            <span>Search</span>
                        </Button>
                    </>
                )}
            </div>

            <MobileSearchSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                query={urlText}
                summary={pillSummary}
                search={sheetSearchField}
                location={locationField}
            />
        </GoogleApiProvider>
    );
}
