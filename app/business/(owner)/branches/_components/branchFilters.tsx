"use client"

import {useState} from "react";
import Link from "next/link";
import {ArrowUpDown, Plus} from "lucide-react";
import {Button} from "@/_components/shadcn/button";
import {Label} from "@/_components/shadcn/label";
import {ToggleGroup, ToggleGroupItem} from "@/_components/shadcn/toggle-group";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import FilterSheet from "@/_components/filterSheet";
import FilterButton from "@/(main)/(withFooter)/(myAccount)/_components/filterButton";
import {
    BRANCH_FILTER_OPTIONS,
    BRANCH_SORT_OPTIONS,
    BranchFilterKey,
    BranchSortKey,
} from "@/features/ownerBranch/ownerBranchList";

const DEFAULT_FILTER: BranchFilterKey = "all";
const DEFAULT_SORT: BranchSortKey = "nameAsc";

export default function BranchFilters({filter, sort, onFilterChange, onSortChange}: {
    filter: BranchFilterKey;
    sort: BranchSortKey;
    onFilterChange: (filter: BranchFilterKey) => void;
    onSortChange: (sort: BranchSortKey) => void;
}) {
    const [open, setOpen] = useState(false);
    const [draftFilter, setDraftFilter] = useState<BranchFilterKey>(filter);
    const [draftSort, setDraftSort] = useState<BranchSortKey>(sort);

    const active = (filter === DEFAULT_FILTER ? 0 : 1) + (sort === DEFAULT_SORT ? 0 : 1);
    const draftActive = (draftFilter === DEFAULT_FILTER ? 0 : 1) + (draftSort === DEFAULT_SORT ? 0 : 1);

    return (
        <>
            <div className="flex items-center gap-2 lg:hidden">
                <FilterButton
                    activeCount={active}
                    onClick={() => {
                        setDraftFilter(filter);
                        setDraftSort(sort);
                        setOpen(true);
                    }}
                />
                <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                    {BRANCH_FILTER_OPTIONS.find((o) => o.value === filter)?.label}
                    {" · "}
                    {BRANCH_SORT_OPTIONS.find((o) => o.value === sort)?.label}
                </p>
                <Button size="sm" className="shrink-0" asChild>
                    <Link href="/business/branches/new"><Plus/> New</Link>
                </Button>
            </div>

            <FilterSheet
                open={open}
                onOpenChange={setOpen}
                clearDisabled={draftActive === 0}
                onClear={() => {
                    setDraftFilter(DEFAULT_FILTER);
                    setDraftSort(DEFAULT_SORT);
                }}
                onApply={() => {
                    onFilterChange(draftFilter);
                    onSortChange(draftSort);
                    setOpen(false);
                }}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="branch-filter-status">Show</Label>
                        <Select value={draftFilter} onValueChange={(v) => setDraftFilter(v as BranchFilterKey)}>
                            <SelectTrigger id="branch-filter-status" className="w-full"><SelectValue/></SelectTrigger>
                            <SelectContent>
                                {BRANCH_FILTER_OPTIONS.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="branch-filter-sort">Sort by</Label>
                        <Select value={draftSort} onValueChange={(v) => setDraftSort(v as BranchSortKey)}>
                            <SelectTrigger id="branch-filter-sort" className="w-full"><SelectValue/></SelectTrigger>
                            <SelectContent>
                                {BRANCH_SORT_OPTIONS.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </FilterSheet>

            <div className="hidden flex-wrap items-center gap-3 rounded-xl border p-3 lg:flex">
                <ToggleGroup
                    type="single"
                    variant="outline"
                    value={filter}
                    onValueChange={(value) => value && onFilterChange(value as BranchFilterKey)}
                    aria-label="Filter service points"
                    className="flex-wrap"
                >
                    {BRANCH_FILTER_OPTIONS.map((o) => (
                        <ToggleGroupItem key={o.value} value={o.value}>{o.label}</ToggleGroupItem>
                    ))}
                </ToggleGroup>

                <Select value={sort} onValueChange={(v) => onSortChange(v as BranchSortKey)}>
                    <SelectTrigger className="ml-auto w-52 justify-start gap-2 [&>span]:min-w-0 [&>svg:last-of-type]:ml-auto">
                        <ArrowUpDown className="h-4 w-4 text-muted-foreground"/>
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        {BRANCH_SORT_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button className="shrink-0" asChild>
                    <Link href="/business/branches/new"><Plus/> New</Link>
                </Button>
            </div>
        </>
    );
}
