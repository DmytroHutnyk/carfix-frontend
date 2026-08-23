import Link from "next/link";
import {ArrowUpDown, Plus} from "lucide-react";
import {Button} from "@/_components/shadcn/button";
import {ToggleGroup, ToggleGroupItem} from "@/_components/shadcn/toggle-group";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import {
    BRANCH_FILTER_OPTIONS,
    BRANCH_SORT_OPTIONS,
    BranchFilterKey,
    BranchSortKey,
} from "@/features/ownerBranch/ownerBranchList";

export default function BranchFilters({filter, sort, onFilterChange, onSortChange}: {
    filter: BranchFilterKey;
    sort: BranchSortKey;
    onFilterChange: (filter: BranchFilterKey) => void;
    onSortChange: (sort: BranchSortKey) => void;
}) {
    return (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border p-2 sm:gap-3 sm:p-3">
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
                <SelectTrigger className="min-w-0 flex-1 justify-start gap-2 sm:ml-auto sm:w-52 sm:flex-initial [&>span]:min-w-0 [&>svg:last-of-type]:ml-auto">
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
    );
}
