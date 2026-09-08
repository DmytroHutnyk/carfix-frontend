"use client"

import {useState} from "react";
import {Check, ChevronsUpDown, Plus} from "lucide-react";
import {Button} from "@/_components/shadcn/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/_components/shadcn/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator} from "@/_components/shadcn/command";
import {cn} from "@/lib/utils";

interface CreatableSelectProps {
    id?: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    onCreate: (name: string) => void;
    placeholder: string;
    maxNameLength: number;
    ariaLabel?: string;
    createLabel?: string;
    searchPlaceholder?: string;
    invalid?: boolean;
    className?: string;
}

export default function CreatableSelect({
                                            id, value, options, onChange, onCreate, placeholder, maxNameLength, ariaLabel,
                                            createLabel = "Add", searchPlaceholder = "Search or type a new one…",
                                            invalid = false, className,
                                        }: CreatableSelectProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    const trimmed = query.trim();
    const filtered = options.filter((option) => option.toLowerCase().includes(trimmed.toLowerCase()));
    const exists = options.some((option) => option.toLowerCase() === trimmed.toLowerCase());
    const canCreate = trimmed.length > 0 && trimmed.length <= maxNameLength && !exists;

    const close = () => {
        setOpen(false);
        setQuery("");
    };

    const create = () => {
        onCreate(trimmed);
        onChange(trimmed);
        close();
    };

    return (
        <Popover open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-label={ariaLabel}
                    aria-expanded={open}
                    aria-invalid={invalid || undefined}
                    className={cn("w-full justify-between font-normal", !value && "text-muted-foreground",
                        invalid && "border-destructive focus-visible:ring-destructive", className)}
                >
                    <span className="truncate">{value || placeholder}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput placeholder={searchPlaceholder} value={query} onValueChange={setQuery} maxLength={maxNameLength}/>
                    <CommandList>
                        <CommandEmpty>Type a name to add the first one</CommandEmpty>
                        {filtered.length > 0 && (
                            <CommandGroup>
                                {filtered.map((option) => (
                                    <CommandItem
                                        key={option}
                                        value={option}
                                        onSelect={() => {
                                            onChange(option);
                                            close();
                                        }}
                                    >
                                        {option}
                                        <Check className={cn("ml-auto h-4 w-4", value === option ? "opacity-100" : "opacity-0")}/>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                        {canCreate && (
                            <>
                                {filtered.length > 0 && <CommandSeparator alwaysRender/>}
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
    );
}
