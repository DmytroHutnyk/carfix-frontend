"use client"
import {MapPin} from "lucide-react";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList
} from "@/_components/shadcn/combobox";
import {useCallback, useMemo, useRef} from "react";
import {useAutocompleteSuggestions} from "@/lib/use-autocomplete-suggestions";
import {CountryCode} from "@/lib/appTypes";

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
    value: string;
    onValueChange: (value: string) => void;
    onPlaceSelected: (place: PickedPlace) => void;
}

export default function LocationSearchBar({value, onValueChange, onPlaceSelected}: LocationSearchBarProps) {
    const {suggestions, resetSession} = useAutocompleteSuggestions(value);
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

                    onPlaceSelected({
                        city: find("locality")?.long_name ?? null,
                        region: find("administrative_area_level_1")?.long_name ?? null,
                        /* short_name is the ISO code — the same alphabet the region selector
                           and the backend country filter speak. */
                        country: (find("country")?.short_name as CountryCode | undefined) ?? null,
                        lat: coordinates ? coordinates.lat() : null,
                        lng: coordinates ? coordinates.lng() : null,
                    });
                });
        },
        [onPlaceSelected, resetSession]
    );

    return (
        <Combobox
            items={predictions}
            inputValue={value}
            onInputValueChange={onValueChange}
            onValueChange={handleSelect}
            itemToStringLabel={suggestionLabel}
        >
            <ComboboxInput
                placeholder="Location"
                startAddon={<MapPin className="h-4 w-4"/>}
                showClear
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
