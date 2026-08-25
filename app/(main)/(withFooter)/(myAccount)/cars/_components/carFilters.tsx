'use client'

import {useState} from "react";
import {Filter, Search} from "lucide-react";

import {CAR_SORT_OPTIONS, CarSortKey} from "@/features/carProfile/carProfileList";

import FilterSheet from "@/_components/filterSheet";
import FilterButton from "@/_components/filterButton";
import {Input} from "@/_components/shadcn/input";
import {Button} from "@/_components/shadcn/button";
import {Label} from "@/_components/shadcn/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";

const DEFAULT_SORT: CarSortKey = "nameAsc";

function SortSelect({value, onChange, triggerId, triggerClassName}: {
    value: CarSortKey;
    onChange: (value: CarSortKey) => void;
    triggerId?: string;
    triggerClassName: string;
}) {
    return (
        <Select value={value} onValueChange={(v) => onChange(v as CarSortKey)}>
            <SelectTrigger id={triggerId} className={triggerClassName}><SelectValue/></SelectTrigger>
            <SelectContent>
                {CAR_SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export default function CarFilters({query, sortKey, onQueryChange, onSortChange, onClear}: {
    query: string;
    sortKey: CarSortKey;
    onQueryChange: (query: string) => void;
    onSortChange: (sortKey: CarSortKey) => void;
    onClear: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [draftSort, setDraftSort] = useState<CarSortKey>(sortKey);

    return (
        <>
            <div className="flex items-center gap-2 lg:hidden">
                <div className="relative min-w-0 flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        type="search"
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder="Search vehicles"
                        aria-label="Search vehicles"
                        className="pl-9"
                    />
                </div>

                <FilterButton
                    activeCount={sortKey === DEFAULT_SORT ? 0 : 1}
                    label="Sort"
                    onClick={() => {
                        setDraftSort(sortKey);
                        setOpen(true);
                    }}
                />
            </div>

            <FilterSheet
                open={open}
                onOpenChange={setOpen}
                title="Sort"
                clearDisabled={draftSort === DEFAULT_SORT}
                onClear={() => setDraftSort(DEFAULT_SORT)}
                onApply={() => {
                    onSortChange(draftSort);
                    setOpen(false);
                }}
            >
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="car-sort">Order</Label>
                    <SortSelect value={draftSort} onChange={setDraftSort} triggerId="car-sort" triggerClassName="w-full"/>
                </div>
            </FilterSheet>

            <div className="hidden flex-wrap items-center gap-3 rounded-xl border p-3 lg:flex">
                <p className="flex items-center gap-2 text-base font-semibold">
                    <Filter className="h-4 w-4"/> Filters:
                </p>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        type="text"
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder="Search name, brand, model, plate"
                        className="w-80 pl-9"
                    />
                </div>

                <SortSelect value={sortKey} onChange={onSortChange} triggerClassName="w-36"/>

                <Button className="ml-auto" onClick={onClear}>
                    Clear filters
                </Button>
            </div>
        </>
    );
}
