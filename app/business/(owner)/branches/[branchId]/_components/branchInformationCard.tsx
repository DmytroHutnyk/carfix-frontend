'use client'

import {useMemo} from "react";
import {UseFormReturn, useWatch} from "react-hook-form";
import {X} from "lucide-react";

import {BranchOverviewForm} from "@/features/ownerBranch/branchOverviewForm";
import {useCarCatalog} from "@/features/carCatalog/useCarCatalog";
import GoogleApiProvider from "@/lib/providers/googleApiProvider";
import {cn} from "@/lib/utils";

import AddressSearchBar, {PickedAddress} from "@/_components/addressSearchBar";
import {Badge} from "@/_components/shadcn/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Field, FieldDescription, FieldError, FieldLabel} from "@/_components/shadcn/field";
import {Input} from "@/_components/shadcn/input";
import {Textarea} from "@/_components/shadcn/textarea";
import BrandPickerDialog from "@/business/(owner)/branches/[branchId]/_components/brandPickerDialog";

const READ_ONLY_INPUT = "bg-muted/40";

export default function BranchInformationCard({form}: { form: UseFormReturn<BranchOverviewForm> }) {
    const {control, register, reset, getValues, setValue, formState: {errors}} = form;
    const {brands, isBrandsLoading} = useCarCatalog(null, null);
    const selectedBrandIds = useWatch({control, name: "carBrandIds"});

    const brandNames = useMemo(() => new Map(brands.map((b) => [b.id, b.name])), [brands]);

    const applyPicked = (picked: PickedAddress) => {
        const address = getValues("address");
        reset({
            ...getValues(),
            address: {
                ...address,
                streetName: picked.streetName ?? "",
                buildingNumber: picked.buildingNumber ?? address.buildingNumber,
                postalCode: picked.postalCode ?? address.postalCode,
                city: picked.city ?? "",
                region: picked.region ?? "",
                countryIso: picked.countryIso ?? "",
                countryName: picked.countryName ?? "",
                latitude: picked.latitude,
                longitude: picked.longitude,
                googlePlaceId: picked.googlePlaceId,
            },
        }, {keepDefaultValues: true});
    };

    const setBrands = (ids: number[]) =>
        setValue("carBrandIds", ids, {shouldDirty: true, shouldValidate: true});

    const addressErrors = errors.address;
    const pickError = addressErrors?.streetName ?? addressErrors?.city ?? addressErrors?.region ?? addressErrors?.countryIso;

    return (
        <Card>
            <CardHeader><CardTitle>Branch Information</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <Field>
                            <FieldLabel htmlFor="branchName">Branch Name</FieldLabel>
                            <Input
                                id="branchName"
                                {...register("name")}
                                className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}
                            />
                            {errors.name && <FieldError>{errors.name.message}</FieldError>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="branchDescription">Description</FieldLabel>
                            <Textarea
                                id="branchDescription"
                                rows={5}
                                placeholder="Describe your service point..."
                                {...register("description")}
                                className={cn(errors.description && "border-destructive focus-visible:ring-destructive")}
                            />
                            {errors.description && <FieldError>{errors.description.message}</FieldError>}
                        </Field>
                    </div>

                    <div className="space-y-4">
                        <Field>
                            <FieldLabel htmlFor="branchAddressSearch">Address</FieldLabel>
                            <GoogleApiProvider>
                                <AddressSearchBar id="branchAddressSearch" onAddressPicked={applyPicked}/>
                            </GoogleApiProvider>
                            <FieldDescription>Street, city, region and country are filled from the address you pick.</FieldDescription>
                            {pickError && <FieldError>{pickError.message}</FieldError>}
                        </Field>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_7rem_7rem]">
                            <Field>
                                <FieldLabel htmlFor="branchStreetName">Street</FieldLabel>
                                <Input id="branchStreetName" {...register("address.streetName")} readOnly className={READ_ONLY_INPUT}/>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="branchBuildingNumber">Building no.</FieldLabel>
                                <Input
                                    id="branchBuildingNumber"
                                    {...register("address.buildingNumber")}
                                    className={cn(addressErrors?.buildingNumber && "border-destructive focus-visible:ring-destructive")}
                                />
                                {addressErrors?.buildingNumber && <FieldError>{addressErrors.buildingNumber.message}</FieldError>}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="branchFlatNumber">Apartment</FieldLabel>
                                <Input
                                    id="branchFlatNumber"
                                    placeholder="Optional"
                                    {...register("address.flatNumber")}
                                    className={cn(addressErrors?.flatNumber && "border-destructive focus-visible:ring-destructive")}
                                />
                                {addressErrors?.flatNumber && <FieldError>{addressErrors.flatNumber.message}</FieldError>}
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="branchPostalCode">Postal Code</FieldLabel>
                                <Input
                                    id="branchPostalCode"
                                    {...register("address.postalCode")}
                                    className={cn(addressErrors?.postalCode && "border-destructive focus-visible:ring-destructive")}
                                />
                                {addressErrors?.postalCode && <FieldError>{addressErrors.postalCode.message}</FieldError>}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="branchCity">City</FieldLabel>
                                <Input id="branchCity" {...register("address.city")} readOnly className={READ_ONLY_INPUT}/>
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="branchRegion">Region</FieldLabel>
                                <Input id="branchRegion" {...register("address.region")} readOnly className={READ_ONLY_INPUT}/>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="branchCountryName">Country</FieldLabel>
                                <Input id="branchCountryName" {...register("address.countryName")} readOnly className={READ_ONLY_INPUT}/>
                            </Field>
                        </div>
                    </div>
                </div>

                <Field>
                    <FieldLabel htmlFor="branchBrands">Car brands we work with</FieldLabel>
                    <div id="branchBrands" className="flex flex-wrap items-center gap-2">
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
                        <BrandPickerDialog selected={selectedBrandIds} onConfirm={setBrands}/>
                    </div>
                    {errors.carBrandIds && <FieldError>{errors.carBrandIds.message}</FieldError>}
                </Field>
            </CardContent>
        </Card>
    );
}
