'use client'

import {useMemo} from "react";
import {UseFormReturn, useWatch} from "react-hook-form";
import {X} from "lucide-react";

import {BranchOverviewForm} from "@/features/ownerBranch/branchOverviewForm";
import {useCarCatalog} from "@/features/carCatalog/useCarCatalog";

import {Badge} from "@/_components/shadcn/badge";
import {FieldError} from "@/_components/shadcn/field";
import CollapsibleCard from "@/business/(owner)/branches/[branchId]/_components/collapsibleCard";
import BrandPickerDialog from "@/business/(owner)/branches/[branchId]/_components/brandPickerDialog";

export default function CarBrandsCard({form}: { form: UseFormReturn<BranchOverviewForm> }) {
    const {control, setValue, formState: {errors}} = form;
    const {brands, isBrandsLoading} = useCarCatalog(null, null);
    const selectedBrandIds = useWatch({control, name: "carBrandIds"});

    const brandNames = useMemo(() => new Map(brands.map((b) => [b.id, b.name])), [brands]);

    const setBrands = (ids: number[]) =>
        setValue("carBrandIds", ids, {shouldDirty: true, shouldValidate: true});

    return (
        <CollapsibleCard title="Car brands we work with">
            <div className="space-y-3">
                <BrandPickerDialog selected={selectedBrandIds} onConfirm={setBrands}/>
                <div className="flex flex-wrap items-center gap-2">
                    {isBrandsLoading && selectedBrandIds.length > 0 && (
                        <p className="text-sm text-muted-foreground">Loading brands…</p>
                    )}
                    {!isBrandsLoading && selectedBrandIds.map((id) => (
                        <Badge key={id} variant="secondary" className="gap-1 pr-1">
                            {brandNames.get(id) ?? `Brand ${id}`}
                            <button
                                type="button"
                                aria-label={`Remove ${brandNames.get(id) ?? `brand ${id}`}`}
                                onClick={() => setBrands(selectedBrandIds.filter((v) => v !== id))}
                                className="rounded-sm p-0.5 hover:bg-muted"
                            >
                                <X className="h-3 w-3"/>
                            </button>
                        </Badge>
                    ))}
                </div>
                {errors.carBrandIds && <FieldError>{errors.carBrandIds.message}</FieldError>}
            </div>
        </CollapsibleCard>
    );
}
