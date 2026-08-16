"use client"

import {useState} from "react";
import {Check, ChevronsUpDown, Plus, X} from "lucide-react";
import {Badge} from "@/_components/shadcn/badge";
import {Button} from "@/_components/shadcn/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/_components/shadcn/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator} from "@/_components/shadcn/command";
import {cn} from "@/lib/utils";

interface MultiSelectFieldProps {
    id?: string;
    values: string[];
    options: string[];
    onChange: (values: string[]) => void;
    onCreate?: (name: string) => void;
    placeholder: string;
    createLabel?: string;
    searchPlaceholder?: string;
    invalid?: boolean;
    emptyMessage?: string;
}

/* Multi pick from a user-defined list, shown as removable chips under the trigger; optional inline creation. */
export default function MultiSelectField({
                                             id, values, options, onChange, onCreate, placeholder,
                                             createLabel = "Add", searchPlaceholder = "Search…",
                                             invalid = false, emptyMessage = "Nothing to pick yet",
                                         }: MultiSelectFieldProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    const trimmed = query.trim();
    const filtered = options.filter((option) => option.toLowerCase().includes(trimmed.toLowerCase()));
    const exists = options.some((option) => option.toLowerCase() === trimmed.toLowerCase());
    const canCreate = onCreate !== undefined && trimmed.length > 0 && !exists;

    const toggle = (option: string) =>
        onChange(values.includes(option) ? values.filter((v) => v !== option) : [...values, option]);

    const create = () => {
        onCreate?.(trimmed);
        onChange([...values, trimmed]);
        setQuery("");
    };

    return (
        <div className="space-y-2">
            <Popover open={open} onOpenChange={(next) => { setOpen(next); if (!next) setQuery(""); }}>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn("w-full justify-between font-normal", values.length === 0 && "text-muted-foreground",
                            invalid && "border-destructive")}
                    >
                        <span className="truncate">{values.length === 0 ? placeholder : `${values.length} selected`}</span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput placeholder={searchPlaceholder} value={query} onValueChange={setQuery}/>
                        <CommandList>
                            <CommandEmpty>{emptyMessage}</CommandEmpty>
                            {filtered.length > 0 && (
                                <CommandGroup>
                                    {filtered.map((option) => (
                                        <CommandItem key={option} value={option} onSelect={() => toggle(option)}>
                                            {option}
                                            <Check className={cn("ml-auto h-4 w-4", values.includes(option) ? "opacity-100" : "opacity-0")}/>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                            {canCreate && (
                                <>
                                    {filtered.length > 0 && <CommandSeparator/>}
                                    <CommandGroup>
                                        <CommandItem value={`create:${trimmed}`} onSelect={create}>
                                            <Plus className="mr-2 h-4 w-4"/>
                                            {createLabel} “{trimmed}”
                                        </CommandItem>
                                    </CommandGroup>
                                </>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {values.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {values.map((value) => (
                        <Badge key={value} variant="secondary" className="gap-1 pr-1 font-normal">
                            {value}
                            <button
                                type="button"
                                aria-label={`Remove ${value}`}
                                className="rounded-sm p-0.5 hover:bg-secondary-foreground/10"
                                onClick={() => onChange(values.filter((v) => v !== value))}
                            >
                                <X className="h-3 w-3"/>
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
