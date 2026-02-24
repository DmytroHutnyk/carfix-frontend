"use client"
import {APIProvider} from "@vis.gl/react-google-maps";
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

const API_KEY: string = process.env.GOOGLE_MAPS_API_KEY as string;





export default function (
    { onPlaceSelect }: { onPlaceSelect: (place: google.maps.places.Place | null) => void}
){
    const [inputValue, setInputValue] = useState<string>('');
    const {suggestions, resetSession, isLoading} = useAutocompleteSuggestions(inputValue);

    const predictions = useMemo(
        () =>
            suggestions
                .filter(suggestion => suggestion.placePrediction)
                .map(({placePrediction}) => placePrediction!),
        [suggestions]
    );

    const handleInputChange = useCallback(
        (value: google.maps.places.PlacePrediction | string) => {
            if (typeof value === 'string') {
                setInputValue(value);
            }
        },
        []
    );

    const handleSelect = useCallback(
        (value: unknown) => {
            if (!(value instanceof google.maps.places.PlacePrediction)) return;

            const place = value.toPlace();
            place
                .fetchFields({
                    fields: [
                        'viewport',
                        'location',
                        'svgIconMaskURI',
                        'iconBackgroundColor'
                    ]
                })
                .then(() => {
                    resetSession();
                    onPlaceSelect(place);
                    setInputValue('');
                });
        },
        [onPlaceSelect]
    );




    return(
        <APIProvider apiKey={API_KEY}>
            <Combobox
                items={predictions}
                inputValue={inputValue}
                onInputValueChange={handleInputChange}
                onValueChange={handleSelect}>
                <ComboboxInput
                    placeholder="Location"
                    startAddon={<MapPin className="h-4 w-4" />}

                    showClear
                    disableChevron
                    />
                <ComboboxContent>
                    <ComboboxEmpty>No matching results - from combobox</ComboboxEmpty>
                    <ComboboxList>
                        {(item) => (
                            <ComboboxItem key={item.placeId} value={item.text}>
                                {item.text}
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>

        </APIProvider>
    )
}