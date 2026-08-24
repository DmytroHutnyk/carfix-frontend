"use client"
import {ComponentPropsWithoutRef, forwardRef} from "react";
import {Search} from "lucide-react";
import {cn} from "@/lib/utils";

interface SearchPillProps extends ComponentPropsWithoutRef<"button"> {
    query: string;
    summary: string;
}

const SearchPill = forwardRef<HTMLButtonElement, SearchPillProps>(function SearchPill(
    {query, summary, className, ...props},
    ref
) {
    return (
        <button
            ref={ref}
            type="button"
            className={cn(
                "flex h-11 w-full items-center gap-3 rounded-full border bg-background px-4 text-left shadow-sm",
                className
            )}
            {...props}
        >
            <Search className="h-[18px] w-[18px] shrink-0 text-muted-foreground"/>
            <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium leading-tight">
                    {query || "What needs fixing?"}
                </span>
                <span className="truncate text-xs leading-tight text-muted-foreground">
                    {summary}
                </span>
            </span>
        </button>
    );
});

export default SearchPill;
