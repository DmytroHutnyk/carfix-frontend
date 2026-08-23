"use client"

import {ReactNode} from "react";
import {Info} from "lucide-react";
import {OrbitProgress} from "react-loading-indicators";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Button} from "@/_components/shadcn/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/_components/shadcn/popover";
import FormErrorAlert from "@/_components/formErrorAlert";
import {cn} from "@/lib/utils";

export interface WizardCardProps {
    title: string;
    subtitle?: string;
    centeredTitle?: boolean;
    wide?: boolean;
    hint?: ReactNode;
    back: { label: string; onClick: () => void };
    next: { label: string; onClick?: () => void; form?: string; disabled?: boolean };
    busy?: boolean;
    error?: string | null;
    children: ReactNode;
}

export default function WizardCard({title, subtitle, centeredTitle = false, wide = false, hint, back, next, busy = false, error = null, children}: WizardCardProps) {
    return (
        <Card className={cn("relative w-full", wide ? "max-w-5xl" : "max-w-2xl", busy && "opacity-60")}>
            {busy && (
                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-card/75">
                    <OrbitProgress color="var(--primary)" size="large" text="" textColor="" dense/>
                </div>
            )}
            {hint && (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button type="button" variant="outline" size="icon" className="absolute right-4 top-4" aria-label="More information">
                            <Info className="h-4 w-4"/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-80 text-sm">{hint}</PopoverContent>
                </Popover>
            )}
            <CardHeader className={cn(hint && "pr-16")}>
                <CardTitle className={cn("text-2xl font-bold", centeredTitle && "text-center")}>{title}</CardTitle>
                {subtitle && (
                    <p className={cn("text-sm text-muted-foreground", centeredTitle && "text-center")}>{subtitle}</p>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {children}
                <FormErrorAlert message={error}/>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <Button type="button" variant="secondary" onClick={back.onClick} disabled={busy}>{back.label}</Button>
                <Button
                    type={next.form ? "submit" : "button"}
                    form={next.form}
                    onClick={next.onClick}
                    disabled={busy || next.disabled}
                >
                    {next.label}
                </Button>
            </CardFooter>
        </Card>
    );
}
