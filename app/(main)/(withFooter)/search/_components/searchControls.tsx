"use client"

import {ArrowUpDown, SlidersHorizontal} from "lucide-react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useMemo} from "react";

import {useAuth} from "@/features/auth/useAuth";
import {useCarProfiles} from "@/features/carProfile/useCarProfiles";
import {WorkshopSearchParams} from "@/features/search/searchTypes";
import {SEARCH_SORTS} from "@/features/search/searchList";
import {useUrlDraft} from "@/lib/use-url-draft";

import {Badge} from "@/_components/shadcn/badge";
import {Button} from "@/_components/shadcn/button";
import {Label} from "@/_components/shadcn/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/_components/shadcn/popover";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import {Slider} from "@/_components/shadcn/slider";

const ALL_CARS = "all";
const DEFAULT_RADIUS_KM = 50;

export default function SearchControls({params}: { params: WorkshopSearchParams }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const {isAuthenticated} = useAuth();
    /* /search is public — don't fire the private cars request for anonymous visitors. */
    const {carProfiles} = useCarProfiles({enabled: isAuthenticated});

    const vehicles = useMemo(
        () => [...carProfiles].sort((a, b) => a.name.localeCompare(b.name)),
        [carProfiles]
    );

    const hasCoords = params.lat != null && params.lng != null;
    /* The slider is dragged locally but the URL owns the committed value; the draft is
       dropped the moment the URL changes, so a page-level clear resets it too. */
    const [radius, setRadius] = useUrlDraft(params.radiusKm ?? DEFAULT_RADIUS_KM);

    const activeFilterCount = (params.radiusKm != null ? 1 : 0) + (params.carProfileId ? 1 : 0);

    const setParam = (key: string, value: string | null) => {
        const next = new URLSearchParams(searchParams);
        if (value == null) next.delete(key); else next.set(key, value);
        next.delete("page");
        router.push(`${pathname}?${next.toString()}`);
    };

    const clearFilters = () => {
        const next = new URLSearchParams(searchParams);
        next.delete("carProfileId");
        next.delete("radiusKm");
        next.delete("page");
        router.push(`${pathname}?${next.toString()}`);
    };

    return (
        <div className="flex items-center gap-2">
            {/* Distance needs a centre to measure from; every other combination is choosable. */}
            <Select value={params.sort ?? SEARCH_SORTS.NAME} onValueChange={(value) => setParam("sort", value)}>
                <SelectTrigger className="w-40">
                    <ArrowUpDown className="h-4 w-4"/>
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={SEARCH_SORTS.DISTANCE} disabled={!hasCoords}>Distance</SelectItem>
                    <SelectItem value={SEARCH_SORTS.NAME}>Name A–Z</SelectItem>
                </SelectContent>
            </Select>

            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline">
                        <SlidersHorizontal className="h-4 w-4"/>
                        Filters
                        {activeFilterCount > 0 && (
                            <Badge variant="secondary" className="ml-1 tabular-nums">{activeFilterCount}</Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="flex w-72 flex-col gap-4">
                    {isAuthenticated && (
                        <div className="flex flex-col gap-2">
                            <Label>For my car</Label>
                            <Select
                                value={params.carProfileId ?? ALL_CARS}
                                onValueChange={(value) =>
                                    setParam("carProfileId", value === ALL_CARS ? null : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All cars"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ALL_CARS}>All cars</SelectItem>
                                    {vehicles.map((car) => (
                                        <SelectItem key={car.id} value={car.id}>{car.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {hasCoords && (
                        <div className="flex flex-col gap-2">
                            <Label>Radius: {radius} km</Label>
                            <Slider
                                min={1}
                                max={50}
                                step={1}
                                value={[radius]}
                                onValueChange={([value]) => setRadius(value)}
                                onValueCommit={([value]) => setParam("radiusKm", String(value))}
                            />
                        </div>
                    )}

                    {!isAuthenticated && !hasCoords && (
                        <p className="text-sm text-muted-foreground">
                            No filters available for this search.
                        </p>
                    )}

                    <Button variant="outline" onClick={clearFilters} disabled={activeFilterCount === 0}>
                        Clear filters
                    </Button>
                </PopoverContent>
            </Popover>
        </div>
    );
}
