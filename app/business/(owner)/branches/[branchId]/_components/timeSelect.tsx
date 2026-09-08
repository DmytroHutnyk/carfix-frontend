'use client'

import {TIME_OPTIONS} from "@/features/branchRegistration/branchRegistrationTypes";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import {cn} from "@/lib/utils";

export default function TimeSelect({value, onChange, placeholder, ariaLabel, disabled, invalid}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    ariaLabel: string;
    disabled: boolean;
    invalid?: boolean;
}) {
    return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger aria-label={ariaLabel} aria-invalid={invalid || undefined}
                           className={cn("w-[130px]", invalid && "border-destructive")}>
                <SelectValue placeholder={placeholder}/>
            </SelectTrigger>
            <SelectContent>
                {TIME_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
        </Select>
    );
}
