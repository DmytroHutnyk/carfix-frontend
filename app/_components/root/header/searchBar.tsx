"use client"
import {RefObject, useMemo} from "react";
import {Search, Store, Tag, Wrench} from "lucide-react";
import {
    Combobox,
    ComboboxCollection,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxLabel,
    ComboboxList
} from "@/_components/shadcn/combobox";
import {MIN_QUERY_LENGTH, useSearchSuggestions} from "@/features/search/useSearchSuggestions";
import {SearchSuggestion} from "@/features/search/searchTypes";
import {useDebouncedValue} from "@/lib/use-debounced-value";

type SuggestionGroup = {
    label: string;
    items: SearchSuggestion[];
};

function suggestionKey(suggestion: SearchSuggestion) {
    switch (suggestion.kind) {
        case "service": return `service-${suggestion.name}`;
        case "category": return `category-${suggestion.categoryId}`;
        case "workshop": return `workshop-${suggestion.branchId}`;
    }
}

interface SearchBarProps {
    id?: string;
    className?: string;
    value: string;
    onValueChange: (value: string) => void;
    onSubmit: () => void;
    onSelect: (suggestion: SearchSuggestion) => void;
    anchorRef?: RefObject<HTMLDivElement | null>;
    inline?: boolean;
    autoFocus?: boolean;
    inputRef?: RefObject<HTMLInputElement | null>;
}

export type SearchBarFieldProps = Pick<SearchBarProps, "value" | "onValueChange" | "onSubmit" | "onSelect">;

export default function SearchBar({id, className, value, onValueChange, onSubmit, onSelect, anchorRef, inline = false, autoFocus = false, inputRef}: SearchBarProps) {
    const debouncedQuery = useDebouncedValue(value.trim(), 300);
    const {suggestions, isLoading} = useSearchSuggestions(debouncedQuery);

    const groups = useMemo<SuggestionGroup[]>(() => {
        if (!suggestions) return [];
        const result: SuggestionGroup[] = [];
        if (suggestions.services.length > 0) {
            result.push({
                label: "Services",
                items: suggestions.services.map(s => ({kind: "service", ...s})),
            });
        }
        if (suggestions.categories.length > 0) {
            result.push({
                label: "Categories",
                items: suggestions.categories.map(c => ({kind: "category", ...c})),
            });
        }
        if (suggestions.workshops.length > 0) {
            result.push({
                label: "Workshops",
                items: suggestions.workshops.map(w => ({kind: "workshop", ...w})),
            });
        }
        return result;
    }, [suggestions]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter" || event.defaultPrevented) return;
        if (value.trim().length < MIN_QUERY_LENGTH) return;
        onSubmit();
    };

    const emptyMessage = value.trim().length < MIN_QUERY_LENGTH
        ? "Type at least 2 characters to search"
        : isLoading ? "Searching..." : "No results found";

    const renderGroup = (group: SuggestionGroup) => (
        <ComboboxGroup key={group.label} items={group.items}>
            <ComboboxLabel>{group.label}</ComboboxLabel>
            <ComboboxCollection>
                {(item: SearchSuggestion) => (
                    <ComboboxItem key={suggestionKey(item)} value={item}>
                        {item.kind === "service" && (
                            <>
                                <Wrench className="text-muted-foreground"/>
                                <span>{item.name}</span>
                                <span className="ml-auto text-xs text-muted-foreground">{item.categoryName}</span>
                            </>
                        )}
                        {item.kind === "category" && (
                            <>
                                <Tag className="text-muted-foreground"/>
                                <span>{item.name}</span>
                            </>
                        )}
                        {item.kind === "workshop" && (
                            <>
                                <Store className="text-muted-foreground"/>
                                <span>{item.name}</span>
                            </>
                        )}
                    </ComboboxItem>
                )}
            </ComboboxCollection>
        </ComboboxGroup>
    );

    return (
        <Combobox
            items={groups}
            filter={null}
            inline={inline}
            inputValue={value}
            onInputValueChange={(next, details) => {
                if (details.reason === "none" || details.reason === "input-clear") return;
                onValueChange(next);
            }}
            onValueChange={(suggestion: SearchSuggestion | null) => suggestion && onSelect(suggestion)}
            itemToStringLabel={(suggestion: SearchSuggestion) => suggestion.name}
        >
            <ComboboxInput
                ref={inputRef}
                id={id}
                className={className}
                placeholder="Search services..."
                enterKeyHint="search"
                startAddon={<Search className="h-4 w-4"/>}
                disableChevron
                showClear
                autoFocus={autoFocus}
                onKeyDown={handleKeyDown}
            />
            {inline ? (
                groups.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">{emptyMessage}</p>
                ) : (
                    <ComboboxList className="max-h-none px-0 py-2">{renderGroup}</ComboboxList>
                )
            ) : (
                <ComboboxContent anchor={anchorRef}>
                    <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
                    <ComboboxList>{renderGroup}</ComboboxList>
                </ComboboxContent>
            )}
        </Combobox>
    );
}
