"use client"
import {useRef} from "react";
import {Search} from "lucide-react";
import {Button} from "@/_components/shadcn/button";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/_components/shadcn/sheet";
import SearchPill from "@/_components/root/header/searchPill";
import SearchBar, {SearchBarFieldProps} from "@/_components/root/header/searchBar";
import LocationSearchBar, {LocationFieldProps} from "@/_components/locationSearchBar";

interface MobileSearchSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    query: string;
    summary: string;
    search: SearchBarFieldProps;
    location: LocationFieldProps;
}

export default function MobileSearchSheet({open, onOpenChange, query, summary, search, location}: MobileSearchSheetProps) {
    const servicesInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="lg:hidden">
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetTrigger asChild>
                    <SearchPill query={query} summary={summary} aria-label="Open search"/>
                </SheetTrigger>

                <SheetContent
                    side="top"
                    className="flex h-[100dvh] flex-col gap-0 p-4 lg:p-4"
                    onOpenAutoFocus={(event) => {
                        event.preventDefault();
                        servicesInputRef.current?.focus();
                    }}
                >
                    <SheetHeader className="h-9 shrink-0 justify-center pr-10">
                        <SheetTitle className="text-base font-semibold lg:text-base">Search</SheetTitle>
                    </SheetHeader>

                    <div className="-mx-4 min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pt-4">
                        <SearchBar inputRef={servicesInputRef} inline {...search}/>
                        <LocationSearchBar inline onSubmit={search.onSubmit} {...location}/>
                    </div>

                    <div className="shrink-0 pt-3">
                        <Button className="w-full" onClick={search.onSubmit}>
                            <Search className="h-4 w-4"/>
                            Search
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
