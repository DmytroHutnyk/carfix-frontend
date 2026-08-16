'use client'

import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {OrbitProgress} from "react-loading-indicators";

import {Address} from "@/features/user/userTypes";
import {useUpdateAddress} from "@/features/user/useUpdateAddress";
import {UpdateAddress, updateAddressSchema} from "@/features/user/profileManagementTypes";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError} from "@/lib/apiTypes";
import {cn} from "@/lib/utils";
import GoogleApiProvider from "@/lib/providers/googleApiProvider";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Field, FieldDescription, FieldError, FieldLabel} from "@/_components/shadcn/field";
import {Input} from "@/_components/shadcn/input";
import {Button} from "@/_components/shadcn/button";
import FormErrorAlert from "@/_components/formErrorAlert";
import AddressSearchBar, {PickedAddress} from "@/(main)/(withFooter)/(myAccount)/profile/_components/addressSearchBar";
import DeleteAddressDialog from "@/(main)/(withFooter)/(myAccount)/profile/_components/deleteAddressDialog";

function toAddressForm(address: Address | null): UpdateAddress {
    return {
        streetName: address?.streetName ?? "",
        buildingNumber: address?.buildingNumber ?? "",
        flatNumber: address?.flatNumber ?? "",
        postalCode: address?.postalCode ?? "",
        city: address?.city ?? "",
        region: address?.region ?? "",
        countryIso: address?.countryIso ?? "",
        countryName: address?.countryName ?? "",
        latitude: address?.latitude ?? null,
        longitude: address?.longitude ?? null,
        googlePlaceId: address?.googlePlaceId ?? null,
    };
}

const READ_ONLY_INPUT = "bg-muted/40";

export default function AddressCard({address}: {address: Address | null}) {
    const [error, setError] = useState<string | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const {updateAddress} = useUpdateAddress();

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: {errors, isSubmitting, isDirty},
    } = useForm<UpdateAddress>({
        resolver: zodResolver(updateAddressSchema),
        mode: "onSubmit",
        values: toAddressForm(address),
    });

    /* keepDefaultValues keeps the saved address as the baseline, so Reset returns to it and
       isDirty reflects the pick. */
    const applyPicked = (picked: PickedAddress) => {
        setError(null);
        reset({
            ...getValues(),
            streetName: picked.streetName ?? "",
            buildingNumber: picked.buildingNumber ?? "",
            flatNumber: "",
            postalCode: picked.postalCode ?? "",
            city: picked.city ?? "",
            region: picked.region ?? "",
            countryIso: picked.countryIso ?? "",
            countryName: picked.countryName ?? "",
            latitude: picked.latitude,
            longitude: picked.longitude,
            googlePlaceId: picked.googlePlaceId,
        }, {keepDefaultValues: true});
    };

    const onSubmit = async (data: UpdateAddress) => {
        setError(null);
        try {
            await updateAddress(data);
        } catch (err) {
            setError(toDisplayError(err as ApiError).message);
        }
    };

    const pickError = errors.streetName ?? errors.city ?? errors.region ?? errors.countryIso;

    return (
        <Card className="relative">
            {isSubmitting && (
                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-card/75">
                    <OrbitProgress
                        color="var(--primary)"
                        size="large"
                        text=""
                        textColor=""
                        dense
                    />
                </div>
            )}
            <CardHeader>
                <CardTitle>Address</CardTitle>
                <CardDescription>Your address information</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                    <Field>
                        <FieldLabel htmlFor="addressSearch">Find your address</FieldLabel>
                        <GoogleApiProvider>
                            <AddressSearchBar id="addressSearch" onAddressPicked={applyPicked}/>
                        </GoogleApiProvider>
                        <FieldDescription>Street, city, region and country are filled from the address you pick.</FieldDescription>
                        {pickError && <FieldError>{pickError.message}</FieldError>}
                    </Field>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_8rem_8rem]">
                        <Field>
                            <FieldLabel htmlFor="streetName">Street</FieldLabel>
                            <Input id="streetName" {...register("streetName")} readOnly className={READ_ONLY_INPUT}/>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="buildingNumber">Building no.</FieldLabel>
                            <Input
                                id="buildingNumber"
                                {...register("buildingNumber")}
                                className={cn(errors.buildingNumber && "border-destructive focus-visible:ring-destructive")}
                            />
                            {errors.buildingNumber && <FieldError>{errors.buildingNumber.message}</FieldError>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="flatNumber">Apartment</FieldLabel>
                            <Input
                                id="flatNumber"
                                {...register("flatNumber")}
                                placeholder="Optional"
                                className={cn(errors.flatNumber && "border-destructive focus-visible:ring-destructive")}
                            />
                            {errors.flatNumber && <FieldError>{errors.flatNumber.message}</FieldError>}
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="postalCode">Postal code</FieldLabel>
                            <Input
                                id="postalCode"
                                {...register("postalCode")}
                                className={cn(errors.postalCode && "border-destructive focus-visible:ring-destructive")}
                            />
                            {errors.postalCode && <FieldError>{errors.postalCode.message}</FieldError>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="city">City</FieldLabel>
                            <Input id="city" {...register("city")} readOnly className={READ_ONLY_INPUT}/>
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="region">Region</FieldLabel>
                            <Input id="region" {...register("region")} readOnly className={READ_ONLY_INPUT}/>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="countryName">Country</FieldLabel>
                            <Input id="countryName" {...register("countryName")} readOnly className={READ_ONLY_INPUT}/>
                        </Field>
                    </div>

                    <div className="flex w-full items-center justify-between gap-2 pt-2">
                        <div>
                            {address && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => setDeleteOpen(true)}
                                    disabled={isSubmitting}
                                >
                                    Remove address
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="white"
                                className="w-35"
                                onClick={() => {
                                    reset();
                                    setError(null);
                                }}
                                disabled={!isDirty || isSubmitting}
                            >
                                Reset
                            </Button>
                            <Button type="submit" className="w-35" disabled={!isDirty || isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </div>
                </form>

                <FormErrorAlert message={error} className="mt-4"/>
            </CardContent>

            <DeleteAddressDialog open={deleteOpen} onOpenChange={setDeleteOpen}/>
        </Card>
    );
}
