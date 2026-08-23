'use client'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/_components/shadcn/select";
import {COUNTRIES, Country, FLAG_PLACEHOLDERS, isCountryCode} from "@/lib/appTypes";
import {useSearchLocation} from "@/lib/store";

const regionsByContinent = COUNTRIES.reduce<Record<string, Country[]>>((acc, country) => {
    (acc[country.continent] ??= []).push(country);
    return acc;
}, {});

export default function RegionCard() {
    const country = useSearchLocation((s) => s.searchLocation.country);
    const setSearchLocation = useSearchLocation((s) => s.setSearchLocation);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Region</CardTitle>
                <CardDescription>Country used by the location search bar and city suggestions.</CardDescription>
            </CardHeader>
            <CardContent>
                <Select
                    value={country}
                    onValueChange={(code) => {
                        if (isCountryCode(code)) {
                            setSearchLocation({country: code, city: null, region: null, lat: null, lng: null});
                        }
                    }}
                >
                    <SelectTrigger id="region" className="w-full sm:w-64" aria-label="Region">
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(regionsByContinent).map(([continent, countries]) => (
                            <SelectGroup key={continent}>
                                <SelectLabel>{continent}</SelectLabel>
                                {countries.map((c) => (
                                    <SelectItem key={c.code} value={c.code}>
                                        <span className="mr-2">{FLAG_PLACEHOLDERS[c.code]}</span>{c.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        ))}
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>
    );
}
