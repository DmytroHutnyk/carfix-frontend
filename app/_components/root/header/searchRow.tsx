"use client"

import {Search} from "lucide-react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useMemo} from "react";

import {Button} from "@/_components/shadcn/button";
import {Input} from "@/_components/shadcn/input";
import {useComboboxAnchor} from "@/_components/shadcn/combobox";
import SearchBar from "@/_components/root/header/searchBar";
import LocationSearchBar, {PickedPlace} from "@/_components/root/header/locationSearchBar";
import GoogleApiProvider from "@/lib/providers/googleApiProvider";

import {MIN_QUERY_LENGTH} from "@/features/search/useSearchSuggestions";
import {SearchSuggestion} from "@/features/search/searchTypes";
import {buildSearchUrl, parseSearchParams, searchTextFromParams, SearchIntent} from "@/features/search/searchUrl";
import {SearchLocation} from "@/lib/appTypes";
import {useSearchLocation} from "@/lib/store";
import {useIsHydrated} from "@/lib/use-is-hydrated";
import {useUrlDraft} from "@/lib/use-url-draft";

/* Same shell the header renders before client state is known, so nothing shifts on hydration. */
function SearchRowShell() {
    return (
        <div className="flex flex-1 items-center gap-3">
            <div className="flex-1"><Input placeholder="Search services..." disabled/></div>
            <div className="w-56"><Input placeholder="Location" disabled/></div>
            <Button disabled><Search className="h-4 w-4"/>Search</Button>
        </div>
    );
}

export default function SearchRow() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const hydrated = useIsHydrated();

    const storeLocation = useSearchLocation((s) => s.searchLocation);
    const setSearchLocation = useSearchLocation((s) => s.setSearchLocation);

    const params = useMemo(() => parseSearchParams(searchParams), [searchParams]);
    const onResultsPage = pathname === "/search";

    /* On /search the URL wins, so a shared link shows the location it actually searched.
       Everywhere else the persisted store is all there is. */
    const location: SearchLocation = onResultsPage && params.city
        ? {
            city: params.city,
            region: params.voivodeship,
            country: (params.country as SearchLocation["country"]) ?? storeLocation.country,
            lat: params.lat,
            lng: params.lng,
        }
        : storeLocation;

    const urlText = onResultsPage ? searchTextFromParams(params) : "";
    const [text, setText] = useUrlDraft(urlText);

    const urlLocationText = location.city
        ? (location.region ? `${location.city}, ${location.region}` : location.city)
        : "";
    const [locationText, setLocationText] = useUrlDraft(urlLocationText);

    const go = (intent: SearchIntent, into: SearchLocation = location) =>
        router.push(buildSearchUrl(intent, into));

    const submitTypedText = () => {
        const typed = text.trim();
        go(typed.length >= MIN_QUERY_LENGTH ? {kind: "text", q: typed} : {kind: "browse"});
    };

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
        /* Picking a place on the results page re-runs the search immediately — that visible
           reload is the feedback that the new location was taken. */
        if (onResultsPage) {
            const typed = text.trim();
            go(typed.length >= MIN_QUERY_LENGTH ? {kind: "text", q: typed} : {kind: "browse"}, next);
        }
    };

    if (!hydrated) {
        return <SearchRowShell/>;
    }

    return (
        <SearchRowInner
            text={text}
            setText={setText}
            locationText={locationText}
            setLocationText={setLocationText}
            onSubmit={submitTypedText}
            onSelect={handleSelect}
            onPlaceSelected={handlePlaceSelected}
        />
    );
}

/* Split out so useComboboxAnchor is only called on the hydrated path — the shell has no
   combobox to anchor, and hooks must not be conditional. */
function SearchRowInner({
                            text, setText, locationText, setLocationText,
                            onSubmit, onSelect, onPlaceSelected,
                        }: {
    text: string;
    setText: (value: string) => void;
    locationText: string;
    setLocationText: (value: string) => void;
    onSubmit: () => void;
    onSelect: (suggestion: SearchSuggestion) => void;
    onPlaceSelected: (place: PickedPlace) => void;
}) {
    const anchorRef = useComboboxAnchor();

    return (
        <div ref={anchorRef} className="flex flex-1 items-center gap-3">
            <div className="flex-1">
                <SearchBar
                    value={text}
                    onValueChange={setText}
                    onSubmit={onSubmit}
                    onSelect={onSelect}
                    anchorRef={anchorRef}
                />
            </div>

            <div className="relative w-56">
                <GoogleApiProvider>
                    <LocationSearchBar
                        value={locationText}
                        onValueChange={setLocationText}
                        onPlaceSelected={onPlaceSelected}
                    />
                </GoogleApiProvider>
            </div>

            {/* preventDefault on mousedown keeps focus in the combobox: without it the blur
                reverts the input to the last selected suggestion and the click below reads
                that stale value instead of what was just typed. */}
            <Button onMouseDown={(event) => event.preventDefault()} onClick={onSubmit}>
                <Search className="h-4 w-4"/>
                Search
            </Button>
        </div>
    );
}
