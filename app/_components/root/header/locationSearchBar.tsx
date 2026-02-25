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
import {useCallback, useMemo, useState} from "react";
import {useAutocompleteSuggestions} from "@/util/hooks/use-autocomplete-suggestions";
type PlacePrediction = google.maps.places.PlacePrediction;
type Place = google.maps.Place;

export default function LocationSearchBar(
    { onPlaceSelect }: { onPlaceSelect: (place: Place | null) => void}
) {
    const [inputValue, setInputValue] = useState<string>('');
    const {suggestions, resetSession, isLoading} = useAutocompleteSuggestions(inputValue);

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

            const place = prediction.toPlace();
            place
                .fetchFields({
                    fields: [
                        'location',
                        'iconBackgroundColor'
                    ]
                })
                .then(() => {
                    resetSession();
                    onPlaceSelect(place);
                    setInputValue('');
                });
        },
        [onPlaceSelect, resetSession]
    );

    return (
        <Combobox
            items={predictions}
            onInputValueChange={setInputValue}
            onValueChange={handleSelect}
            itemToStringLabel={(item: PlacePrediction) => item.text.text}
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
                            {item.text.text}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}