'use client'

import {MapPin} from "lucide-react";
import {useCallback, useMemo, useRef, useState} from "react";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList
} from "@/_components/shadcn/combobox";
import {useAutocompleteSuggestions} from "@/lib/use-autocomplete-suggestions";

type PlacePrediction = google.maps.places.PlacePrediction;

/** Everything one geocoded street address contributes to the address form. */
export type PickedAddress = {
    streetName: string | null;
    buildingNumber: string | null;
    postalCode: string | null;
    city: string | null;
    region: string | null;
    countryIso: string | null;
    countryName: string | null;
    latitude: number | null;
    longitude: number | null;
    googlePlaceId: string | null;
};

/* Street-level results only, from any country: a home address is not tied to the country the
   user browses workshops in. */
const ADDRESS_REQUEST_OPTIONS: Partial<google.maps.places.AutocompleteRequest> = {
    includedPrimaryTypes: ["street_address", "premise", "subpremise", "route"],
    includedRegionCodes: [],
};

interface AddressSearchBarProps {
    id: string;
    onAddressPicked: (address: PickedAddress) => void;
}

export default function AddressSearchBar({id, onAddressPicked}: AddressSearchBarProps) {
    const [text, setText] = useState("");
    const {suggestions, resetSession} = useAutocompleteSuggestions(text, ADDRESS_REQUEST_OPTIONS);
    const geocoderRef = useRef<google.maps.Geocoder | null>(null);

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
                    const coordinates = result?.geometry.location ?? null;
                    const components = result?.address_components ?? [];

                    const find = (type: string) => components.find(c => c.types.includes(type));

                    onAddressPicked({
                        streetName: find("route")?.long_name ?? null,
                        buildingNumber: find("street_number")?.long_name ?? null,
                        postalCode: find("postal_code")?.long_name ?? null,
                        city: (find("locality") ?? find("postal_town"))?.long_name ?? null,
                        region: find("administrative_area_level_1")?.long_name ?? null,
                        countryIso: find("country")?.short_name ?? null,
                        countryName: find("country")?.long_name ?? null,
                        latitude: coordinates ? coordinates.lat() : null,
                        longitude: coordinates ? coordinates.lng() : null,
                        googlePlaceId: result?.place_id ?? place.id,
                    });
                    setText("");
                });
        },
        [onAddressPicked, resetSession]
    );

    return (
        <Combobox
            items={predictions}
            inputValue={text}
            onInputValueChange={(next, details) => {
                /* On close the combobox force-writes the selected item's label (or "") back
                   into the input; those two reasons are only ever that write. */
                if (details.reason === "none" || details.reason === "input-clear") return;
                setText(next);
            }}
            onValueChange={handleSelect}
            itemToStringLabel={(prediction: PlacePrediction) => prediction.text.text}
        >
            <ComboboxInput
                id={id}
                placeholder="Search your address"
                startAddon={<MapPin className="h-4 w-4"/>}
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
