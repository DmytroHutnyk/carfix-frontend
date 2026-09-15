'use client'

import {ReactNode} from "react";
import {Filter, Search} from "lucide-react";

import {Input} from "@/_components/shadcn/input";
import {Button} from "@/_components/shadcn/button";

interface BranchFilterBarProps {
    query: string;
    onQueryChange: (query: string) => void;
    onClear: () => void;
    searchPlaceholder?: string;
    children?: ReactNode;
}

export default function BranchFilterBar({
                                            query, onQueryChange, onClear,
                                            searchPlaceholder = "Search by name", children,
                                        }: BranchFilterBarProps) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border p-3">
            <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-base font-semibold">
                    <Filter className="h-4 w-4"/> Filters:
                </p>
                <Button type="button" variant="outline" size="sm" onClick={onClear}>Clear filters</Button>
            </div>

            <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                <Input
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="pl-9"
                />
            </div>

            {children}
        </div>
    );
}
