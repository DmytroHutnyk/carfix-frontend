"use client"
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
import {useCallback, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
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

export default function SearchBar() {
    const [inputValue, setInputValue] = useState('');
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const debouncedQuery = useDebouncedValue(inputValue.trim(), 300);
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

    const handleSelect = useCallback(
        (suggestion: SearchSuggestion | null) => {
            if (!suggestion) return;
            switch (suggestion.kind) {
                case "service":
                    router.push(`/search?serviceName=${encodeURIComponent(suggestion.name)}`);
                    break;
                case "category":
                    router.push(`/search?categoryId=${suggestion.categoryId}`);
                    break;
                case "workshop":
                    router.push(`/workshops/${suggestion.branchId}`);
                    break;
            }
        },
        [router]
    );

    const handleFreeTextSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter" || event.defaultPrevented) return;
        const text = inputValue.trim();
        if (text.length < MIN_QUERY_LENGTH) return;
        setOpen(false);
        router.push(`/search?q=${encodeURIComponent(text)}`);
    };

    return (
        <Combobox
            items={groups}
            open={open}
            onOpenChange={setOpen}
            filter={null}
            onInputValueChange={setInputValue}
            onValueChange={handleSelect}
            itemToStringLabel={(suggestion: SearchSuggestion) => suggestion.name}
        >
            <ComboboxInput
                placeholder="Search services..."
                startAddon={<Search className="h-4 w-4"/>}
                disableChevron
                showClear
                onKeyDown={handleFreeTextSearch}
            />
            <ComboboxContent className="w-[min(40rem,var(--available-width))]">
                <ComboboxEmpty>
                    {inputValue.trim().length < MIN_QUERY_LENGTH
                        ? "Type at least 2 characters to search"
                        : isLoading ? "Searching..." : "No results found"}
                </ComboboxEmpty>
                <ComboboxList>
                    {(group: SuggestionGroup) => (
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
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}
