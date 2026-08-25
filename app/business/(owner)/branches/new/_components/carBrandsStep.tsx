"use client"

import {useMemo, useState} from "react";
import {Checkbox} from "@/_components/shadcn/checkbox";
import {Input} from "@/_components/shadcn/input";
import {Label} from "@/_components/shadcn/label";
import {ScrollArea} from "@/_components/shadcn/scroll-area";
import {Separator} from "@/_components/shadcn/separator";
import WizardCard from "@/business/(owner)/branches/new/_components/wizardCard";
import {useCarCatalog} from "@/features/carCatalog/useCarCatalog";
import {useBranchRegistrationDraft} from "@/features/branchRegistration/useBranchRegistrationDraft";

export default function CarBrandsStep() {
    const saved = useBranchRegistrationDraft((s) => s.carBrandIds);
    const setCarBrandIds = useBranchRegistrationDraft((s) => s.setCarBrandIds);
    const next = useBranchRegistrationDraft((s) => s.next);
    const back = useBranchRegistrationDraft((s) => s.back);

    const {brands, isBrandsLoading, isBrandsError} = useCarCatalog(null, null);
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<number[]>(saved);

    const visible = useMemo(
        () => brands.filter((b) => b.name.toLowerCase().includes(query.trim().toLowerCase())),
        [brands, query]
    );
    const allVisibleSelected = visible.length > 0 && visible.every((b) => selected.includes(b.id));
    const someVisibleSelected = visible.some((b) => selected.includes(b.id));

    const toggleAll = (checked: boolean) => {
        const visibleIds = visible.map((b) => b.id);
        setSelected(checked
            ? Array.from(new Set([...selected, ...visibleIds]))
            : selected.filter((id) => !visibleIds.includes(id)));
    };

    const toggle = (id: number, checked: boolean) =>
        setSelected(checked ? [...selected, id] : selected.filter((v) => v !== id));

    const onContinue = () => {
        setCarBrandIds(selected);
        next();
    };

    return (
        <WizardCard
            title="Select car brands you service"
            back={{label: "Back", onClick: () => { setCarBrandIds(selected); back(); }}}
            next={{label: "Continue", onClick: onContinue}}
        >
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search brands…"/>
            <div className="rounded-xl border border-border p-3 lg:p-4">
                <div className="flex items-center gap-3">
                    <Checkbox
                        id="brands-select-all"
                        checked={allVisibleSelected ? true : someVisibleSelected ? "indeterminate" : false}
                        onCheckedChange={(checked) => toggleAll(checked === true)}
                    />
                    <Label htmlFor="brands-select-all" className="font-semibold">Select all</Label>
                </div>
                <Separator className="my-3"/>
                <ScrollArea className="max-h-64 [&_[data-radix-scroll-area-viewport]]:max-h-64 lg:h-72 lg:max-h-72 lg:[&_[data-radix-scroll-area-viewport]]:max-h-72">
                    <div className="space-y-2.5 pr-3 lg:space-y-3">
                        {isBrandsLoading && <p className="text-xs text-muted-foreground lg:text-sm">Loading brands…</p>}
                        {isBrandsError && (
                            <p className="text-xs text-destructive lg:text-sm">Couldn't load brands — reload the page and try again</p>
                        )}
                        {!isBrandsLoading && !isBrandsError && visible.length === 0 && (
                            <p className="text-xs text-muted-foreground lg:text-sm">No brands match “{query}”</p>
                        )}
                        {visible.map((brand) => (
                            <div key={brand.id} className="flex items-center gap-3">
                                <Checkbox
                                    id={`brand-${brand.id}`}
                                    checked={selected.includes(brand.id)}
                                    onCheckedChange={(checked) => toggle(brand.id, checked === true)}
                                />
                                <Label htmlFor={`brand-${brand.id}`} className="font-normal">{brand.name}</Label>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
            <p className="text-xs text-muted-foreground lg:text-sm">{selected.length} selected</p>
        </WizardCard>
    );
}
