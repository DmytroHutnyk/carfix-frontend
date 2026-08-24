"use client"

import {useState} from "react";
import {ArrowUpDown, SlidersHorizontal} from "lucide-react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

import {useAuth} from "@/features/auth/useAuth";
import {useSelectedCarProfile} from "@/features/carProfile/useSelectedCarProfile";
import {WorkshopSearchParams} from "@/features/search/searchTypes";
import {AVAILABILITY_PARAMS, hasAvailabilityFilter, SEARCH_SORTS} from "@/features/search/searchList";
import {useUrlDraft} from "@/lib/use-url-draft";

import {Badge} from "@/_components/shadcn/badge";
import {Button} from "@/_components/shadcn/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItemWithCheck,
    DropdownMenuTrigger,
} from "@/_components/shadcn/dropdown-menu";
import {Label} from "@/_components/shadcn/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/_components/shadcn/popover";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import {Slider} from "@/_components/shadcn/slider";
import FilterSheet from "@/_components/filterSheet";
import AvailabilityFilter from "@/(main)/(withFooter)/search/_components/availabilityFilter";

const ALL_BRANDS = "all";
const DEFAULT_RADIUS_KM = 50;

export default function SearchControls({params}: { params: WorkshopSearchParams }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const {isAuthenticated} = useAuth();
    /* /search is public — don't fire the private cars request for anonymous visitors. */
    const {carProfiles, selectedCarProfile, selectCarProfile} = useSelectedCarProfile({enabled: isAuthenticated});
    const hasCarSelect = isAuthenticated && carProfiles.length > 0;

    const carFilterActive = !params.allBrands && selectedCarProfile != null;
    const isServiceSearch = params.serviceName != null;
    const hasAvailability = hasAvailabilityFilter(params);

    const hasCoords = params.lat != null && params.lng != null;
    /* The slider is dragged locally but the URL owns the committed value; the draft is
       dropped the moment the URL changes, so a page-level clear resets it too. */
    const [radius, setRadius] = useUrlDraft(params.radiusKm ?? DEFAULT_RADIUS_KM);
    const [sheetOpen, setSheetOpen] = useState(false);

    const activeFilterCount = (params.radiusKm != null ? 1 : 0) + (carFilterActive ? 1 : 0) + (hasAvailability ? 1 : 0);
    const sort = params.sort ?? SEARCH_SORTS.NAME;

    const setParam = (key: string, value: string | null) => {
        const next = new URLSearchParams(searchParams);
        if (value == null) next.delete(key); else next.set(key, value);
        next.delete("page");
        router.push(`${pathname}?${next.toString()}`);
    };

    const clearFilters = () => {
        const next = new URLSearchParams(searchParams);
        next.delete("radiusKm");
        if (selectedCarProfile) next.set("allBrands", "1");
        AVAILABILITY_PARAMS.forEach((key) => next.delete(key));
        next.delete("page");
        router.push(`${pathname}?${next.toString()}`);
    };

    const filterBody = (
        <div className="flex flex-col gap-4">
            {hasCarSelect && (
                <div className="flex flex-col gap-2">
                    <Label>For my car</Label>
                    <Select
                        value={params.allBrands ? ALL_BRANDS : selectedCarProfile?.id ?? ALL_BRANDS}
                        onValueChange={(value) => {
                            if (value === ALL_BRANDS) {
                                setParam("allBrands", "1");
                            } else {
                                selectCarProfile(value);
                                setParam("allBrands", null);
                            }
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All brands"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL_BRANDS}>All brands</SelectItem>
                            {carProfiles.map((car) => (
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

            {isServiceSearch && <AvailabilityFilter params={params}/>}

            {!hasCarSelect && !hasCoords && !isServiceSearch && (
                <p className="text-sm text-muted-foreground">
                    No filters available for this search.
                </p>
            )}
        </div>
    );

    return (
        <>
            {/*-==-==-=-=-=-=--==-=-=-=-Mobile toolbar-==-==-=-=-=-=-=-=-=---==*/}
            <div className="ml-auto flex shrink-0 items-center gap-2 lg:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <ArrowUpDown/>
                            {sort === SEARCH_SORTS.DISTANCE ? "Distance" : "Name"}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setParam("sort", value)}>
                            <DropdownMenuRadioItemWithCheck value={SEARCH_SORTS.DISTANCE} disabled={!hasCoords}>
                                Distance
                            </DropdownMenuRadioItemWithCheck>
                            <DropdownMenuRadioItemWithCheck value={SEARCH_SORTS.NAME}>
                                Name A–Z
                            </DropdownMenuRadioItemWithCheck>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" size="sm" onClick={() => setSheetOpen(true)}>
                    <SlidersHorizontal/>
                    Filters
                    {activeFilterCount > 0 && (
                        <Badge className="h-4 px-1.5 text-[10px] tabular-nums">{activeFilterCount}</Badge>
                    )}
                </Button>

                <FilterSheet
                    open={sheetOpen}
                    onOpenChange={setSheetOpen}
                    onClear={clearFilters}
                    onApply={() => setSheetOpen(false)}
                    clearDisabled={activeFilterCount === 0}
                >
                    {filterBody}
                </FilterSheet>
            </div>

            {/*-==-==-=-=-=-=--==-=-=-=-Desktop controls-==-==-=-=-=-=-=-=-=---==*/}
            <div className="hidden w-auto items-center gap-2 lg:flex">
                {/* Distance needs a centre to measure from; every other combination is choosable. */}
                <Select value={sort} onValueChange={(value) => setParam("sort", value)}>
                    <SelectTrigger className="h-9 w-40">
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
                        <Button variant="outline" className="h-9">
                            <SlidersHorizontal className="h-4 w-4"/>
                            Filters
                            {activeFilterCount > 0 && (
                                <Badge variant="secondary" className="ml-1 tabular-nums">{activeFilterCount}</Badge>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        align="end"
                        collisionPadding={16}
                        className="flex w-[18rem] flex-col gap-4"
                    >
                        {filterBody}
                        <Button variant="outline" onClick={clearFilters} disabled={activeFilterCount === 0}>
                            Clear filters
                        </Button>
                    </PopoverContent>
                </Popover>
            </div>
        </>
    );
}
