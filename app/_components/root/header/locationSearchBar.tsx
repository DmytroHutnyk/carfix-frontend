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
import {useCallback, useMemo, useRef, useState} from "react";
import {useAutocompleteSuggestions} from "@/lib/use-autocomplete-suggestions";
import {useSearchLocation} from "@/lib/store";

type PlacePrediction = google.maps.places.PlacePrediction;

function suggestionLabel(prediction: PlacePrediction) {
    const city = prediction.mainText?.text ?? prediction.text.text;
    const voivodeship = prediction.secondaryText?.text.split(", ").pop();
    return voivodeship ? `${city}, ${voivodeship}` : city;
}

export default function LocationSearchBar() {
    const [inputValue, setInputValue] = useState<string>('');
    const {suggestions, resetSession, isLoading} = useAutocompleteSuggestions(inputValue);
    const setSearchLocation = useSearchLocation((s) => s.setSearchLocation);
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
                .fetchFields({
                    fields: []
                })
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

                    const components = result?.address_components ?? [];

                    const get = (type: string) =>
                        components.find(c => c.types.includes(type))?.long_name;

                    const locality = get("locality");
                    const region = get("administrative_area_level_1");
                    const country = get("country");

                    const englishAddress = [locality, region, country]
                        .filter(Boolean)            /*almost always true, to remove?*/
                        .join(", ");

                    console.log("formattedAddress (en):", englishAddress);
                    console.log("address_components:", components);

                    setSearchLocation({
                        region: region,
                        city: locality
                    })
                    setInputValue('');
                });
        },
        [setSearchLocation, resetSession]
    );

    return (
        <Combobox
            items={predictions}
            onInputValueChange={setInputValue}
            onValueChange={handleSelect}
            itemToStringLabel={suggestionLabel}
        >
            <ComboboxInput
                placeholder="Location"
                startAddon={<MapPin className="h-4 w-4" />}
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
