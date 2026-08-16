'use client'

import {Field, FieldDescription, FieldError, FieldLabel} from "@/_components/shadcn/field";
import LocationSearchBar, {PickedPlace} from "@/_components/locationSearchBar";
import GoogleApiProvider from "@/lib/providers/googleApiProvider";
import {Location} from "@/features/user/userTypes";
import {locationLabel} from "@/features/user/preferredLocation";
import {useSearchLocation} from "@/lib/store";
import {useUrlDraft} from "@/lib/use-url-draft";

const CITY_REQUEST_OPTIONS: Partial<google.maps.places.AutocompleteRequest> = {includedPrimaryTypes: ["locality"]};

interface PreferredLocationFieldProps {
    value: Location | null;
    onChange: (value: Location | null) => void;
    error?: string;
}

export default function PreferredLocationField({value, onChange, error}: PreferredLocationFieldProps) {
    const searchCountry = useSearchLocation((s) => s.searchLocation.country);
    /* Typed text is a draft over the saved label; it expires when the label changes (pick, clear, reset). */
    const [text, setText] = useUrlDraft(locationLabel(value));

    const handlePlaceSelected = (place: PickedPlace) => {
        const next: Location = {
            city: place.city ?? "",
            region: place.region ?? "",
            countryIso: place.country ?? searchCountry,
            latitude: place.lat,
            longitude: place.lng,
        };
        onChange(next);
        setText(locationLabel(next));
    };

    return (
        <Field>
            <FieldLabel htmlFor="preferredLocation">Preferred location</FieldLabel>
            <GoogleApiProvider>
                <LocationSearchBar
                    id="preferredLocation"
                    placeholder="City"
                    value={text}
                    onValueChange={setText}
                    onPlaceSelected={handlePlaceSelected}
                    onCleared={() => onChange(null)}
                    requestOptions={CITY_REQUEST_OPTIONS}
                />
            </GoogleApiProvider>
            <FieldDescription>Your city — prefills the location in the search bar when you sign in.</FieldDescription>
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
}
