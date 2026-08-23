"use client"
import {MapPin, XIcon} from "lucide-react";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList
} from "@/_components/shadcn/combobox";
import {InputGroupButton} from "@/_components/shadcn/input-group";
import {useCallback, useMemo, useRef} from "react";
import {useAutocompleteSuggestions} from "@/lib/use-autocomplete-suggestions";
import {CountryCode, isCountryCode} from "@/lib/appTypes";

type PlacePrediction = google.maps.places.PlacePrediction;

/** Everything one geocoded place contributes to a search. */
export type PickedPlace = {
    city: string | null;
    region: string | null;
    country: CountryCode | null;
    lat: number | null;
    lng: number | null;
};

function suggestionLabel(prediction: PlacePrediction) {
    const city = prediction.mainText?.text ?? prediction.text.text;
    const voivodeship = prediction.secondaryText?.text.split(", ").pop();
    return voivodeship ? `${city}, ${voivodeship}` : city;
}

interface LocationSearchBarProps {
    id?: string;
    className?: string;
    placeholder?: string;
    value: string;
    onValueChange: (value: string) => void;
    onPlaceSelected: (place: PickedPlace) => void;
    onCleared: () => void;
    requestOptions?: Partial<google.maps.places.AutocompleteRequest>;
}

export default function LocationSearchBar({id, className, placeholder = "Location", value, onValueChange, onPlaceSelected, onCleared, requestOptions}: LocationSearchBarProps) {
    const {suggestions, resetSession} = useAutocompleteSuggestions(value, requestOptions);
    const geocoderRef = useRef<google.maps.Geocoder | null>(null);

    // map AutocompleteSuggestion[] to placePrediction[]
    const predictions = useMemo(
        () =>
            suggestions
                .filter(suggestion => suggestion.placePrediction)
                .map(({placePrediction}) => placePrediction!),
        [suggestions]
    );

    const handleSelect = useCallback(
        (prediction: PlacePrediction | null) => {
            if (!prediction) return;

            const place: google.maps.places.Place = prediction.toPlace();

            // fetchFields closes the autocomplete session (bundled billing)
            place
                .fetchFields({fields: []})
                .then(() => {
                    resetSession();

                    if (!geocoderRef.current) {
                        geocoderRef.current = new google.maps.Geocoder();
                    }

                    return geocoderRef.current.geocode({
                        placeId: place.id,
                        language: "en",
                    });
                })
                .then((response) => {
                    const result = response.results[0];
                    /* For a locality this is the city centre — the point distances and the
                       radius are measured from. */
                    const coordinates = result?.geometry.location ?? null;
                    const components = result?.address_components ?? [];

                    const find = (type: string) => components.find(c => c.types.includes(type));
                    const countryCode = find("country")?.short_name;

                    onPlaceSelected({
                        city: find("locality")?.long_name ?? null,
                        region: find("administrative_area_level_1")?.long_name ?? null,
                        /* short_name is the ISO code — the same alphabet the region selector
                           and the backend country filter speak. */
                        country: isCountryCode(countryCode) ? countryCode : null,
                        lat: coordinates ? coordinates.lat() : null,
                        lng: coordinates ? coordinates.lng() : null,
                    });
                })
                .catch(() => resetSession());
        },
        [onPlaceSelected, resetSession]
    );

    return (
        <Combobox
            items={predictions}
            inputValue={value}
            onInputValueChange={(next, details) => {
                /* On close the combobox force-writes the selected item's label (or "") back
                   into the input; those two reasons are only ever that write. */
                if (details.reason === "none" || details.reason === "input-clear") return;
                onValueChange(next);
                if (next === "") onCleared();
            }}
            onValueChange={handleSelect}
            itemToStringLabel={suggestionLabel}
        >
            <ComboboxInput
                id={id}
                className={className}
                placeholder={placeholder}
                startAddon={<MapPin className="h-4 w-4"/>}
                endAddon={value !== "" && (
                    <InputGroupButton size="icon-xs" variant="ghost" aria-label="Clear location"
                                      onClick={() => {
                                          onValueChange("");
                                          onCleared();
                                      }}>
                        <XIcon className="pointer-events-none"/>
                    </InputGroupButton>
                )}
                disableChevron
            />
            <ComboboxContent>
                <ComboboxEmpty>No results found</ComboboxEmpty>
                <ComboboxList>
                    {(item) => (
                        <ComboboxItem key={item.placeId} value={item}>
                            {suggestionLabel(item)}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}
