import {useState} from "react";
import {PopoverTrigger} from "@radix-ui/react-popover";
import {Button} from "@/_components/shadcn/button";
import {Check, ChevronsUpDown} from "lucide-react";
import {Popover, PopoverContent} from "@/_components/shadcn/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/_components/shadcn/command";
import {COUNTRY_CODES} from "@/lib/countryCodes";
import {cn} from "@/lib/utils";

export default function CountryCodeInput({value, setValue} : {value: string, setValue: (value: string) => void}) {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="white"
                    role="combobox"
                    aria-expanded={open}
                    className="h-9 w-[90px] justify-between">
                    {value ? value : <p className="text-muted-foreground">+XXX</p>}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[195px] p-0" align="start" collisionPadding={8}>
                <Command>
                    <CommandInput placeholder="Search country code"></CommandInput>
                    <CommandList>
                        <CommandEmpty>Not found</CommandEmpty>
                        <CommandGroup>
                            {COUNTRY_CODES.map((code) => (
                                <CommandItem key={code} value={code} onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue);
                                    setOpen(false);
                                }}>
                                    {code}
                                    <Check className={cn(
                                        "ml-auto",
                                        value === code ? "opacity-100" : "opacity-0",
                                    )}></Check>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}