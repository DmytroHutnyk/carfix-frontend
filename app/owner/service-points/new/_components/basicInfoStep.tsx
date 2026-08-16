"use client"

import {useState} from "react";
import {useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {Field, FieldLabel} from "@/_components/shadcn/field";
import {Input} from "@/_components/shadcn/input";
import CountryCodeInput from "@/(auth)/register/_components/countryCodeInput";
import AddressSearchBar, {PickedAddress} from "@/_components/addressSearchBar";
import GoogleApiProvider from "@/lib/providers/googleApiProvider";
import WizardCard from "@/owner/service-points/new/_components/wizardCard";
import FieldError from "@/owner/service-points/new/_components/fieldError";
import {BasicInfo, basicInfoSchema} from "@/features/branchRegistration/branchRegistrationTypes";
import {useBranchRegistrationDraft} from "@/features/branchRegistration/useBranchRegistrationDraft";
import {countryName} from "@/lib/appTypes";
import {cn} from "@/lib/utils";

const FORM_ID = "basic-info-form";

const EMPTY: BasicInfo = {
    name: "", streetName: "", buildingNumber: "", flatNumber: "", postalCode: "", city: "", region: "",
    countryIso: "", latitude: null, longitude: null, googlePlaceId: null,
    phoneCountryCode: "", phoneNumber: "", email: "",
};

export default function BasicInfoStep() {
    const router = useRouter();
    const saved = useBranchRegistrationDraft((s) => s.basicInfo);
    const setBasicInfo = useBranchRegistrationDraft((s) => s.setBasicInfo);
    const next = useBranchRegistrationDraft((s) => s.next);

    /* Google names every country; countryName() only covers the ones the app filters by. */
    const [pickedCountryName, setPickedCountryName] = useState<string | null>(null);

    const {register, control, handleSubmit, setValue, formState: {errors}} = useForm<BasicInfo>({
        resolver: zodResolver(basicInfoSchema),
        mode: "onSubmit",
        defaultValues: saved ?? EMPTY,
    });

    const phoneCountryCode = useWatch({control, name: "phoneCountryCode"});
    const countryIso = useWatch({control, name: "countryIso"});

    const onAddressPicked = (address: PickedAddress) => {
        setValue("streetName", address.streetName ?? "", {shouldValidate: true});
        setValue("buildingNumber", address.buildingNumber ?? "", {shouldValidate: true});
        setValue("postalCode", address.postalCode ?? "", {shouldValidate: true});
        setValue("city", address.city ?? "", {shouldValidate: true});
        setValue("region", address.region ?? "", {shouldValidate: true});
        setValue("countryIso", address.countryIso ?? "", {shouldValidate: true});
        setValue("latitude", address.latitude);
        setValue("longitude", address.longitude);
        setValue("googlePlaceId", address.googlePlaceId);
        setPickedCountryName(address.countryName);
    };

    const onSubmit = (data: BasicInfo) => {
        setBasicInfo(data);
        next();
    };

    const invalid = (has: unknown) => cn(!!has && "border-destructive focus-visible:ring-destructive");

    return (
        <WizardCard
            title="Service Point configuration"
            centeredTitle
            back={{label: "Cancel", onClick: () => router.replace("/owner/service-points")}}
            next={{label: "Continue", form: FORM_ID}}
        >
            <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <Field>
                    <FieldLabel htmlFor="branch-name">Service point name</FieldLabel>
                    <Input {...register("name")} id="branch-name" placeholder="e.g., AutoFix — Nowogrodzka" aria-invalid={!!errors.name || undefined} className={invalid(errors.name)}/>
                    <FieldError message={errors.name?.message}/>
                </Field>

                <Field>
                    <FieldLabel htmlFor="branch-address-search">Address</FieldLabel>
                    <GoogleApiProvider>
                        <AddressSearchBar id="branch-address-search" placeholder="Street address including house number" onAddressPicked={onAddressPicked}/>
                    </GoogleApiProvider>
                    <p className="text-xs text-muted-foreground">Pick the address from the suggestions — street, city, region and country are filled in from it.</p>
                </Field>

                <div className="grid grid-cols-[1fr_140px_140px] gap-3">
                    <Field>
                        <FieldLabel htmlFor="branch-street">Street</FieldLabel>
                        <Input {...register("streetName")} id="branch-street" readOnly placeholder="Street" aria-invalid={!!errors.streetName || undefined} className={cn("bg-muted", invalid(errors.streetName))}/>
                        <FieldError message={errors.streetName?.message}/>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="branch-building">Building no.</FieldLabel>
                        <Input {...register("buildingNumber")} id="branch-building" placeholder="10" aria-invalid={!!errors.buildingNumber || undefined} className={invalid(errors.buildingNumber)}/>
                        <FieldError message={errors.buildingNumber?.message}/>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="branch-flat">Flat no.</FieldLabel>
                        <Input {...register("flatNumber")} id="branch-flat" placeholder="optional" aria-invalid={!!errors.flatNumber || undefined} className={invalid(errors.flatNumber)}/>
                        <FieldError message={errors.flatNumber?.message}/>
                    </Field>
                </div>

                <div className="grid grid-cols-[140px_1fr] gap-3">
                    <Field>
                        <FieldLabel htmlFor="branch-postal">Postal code</FieldLabel>
                        <Input {...register("postalCode")} id="branch-postal" placeholder="00-511" aria-invalid={!!errors.postalCode || undefined} className={invalid(errors.postalCode)}/>
                        <FieldError message={errors.postalCode?.message}/>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="branch-city">City</FieldLabel>
                        <Input {...register("city")} id="branch-city" readOnly placeholder="Select city" aria-invalid={!!errors.city || undefined} className={cn("bg-muted", invalid(errors.city))}/>
                        <FieldError message={errors.city?.message}/>
                    </Field>
                </div>

                <Field>
                    <FieldLabel htmlFor="branch-region">Region</FieldLabel>
                    <Input {...register("region")} id="branch-region" readOnly placeholder="Select region" aria-invalid={!!errors.region || undefined} className={cn("bg-muted", invalid(errors.region))}/>
                    <FieldError message={errors.region?.message}/>
                </Field>

                <Field>
                    <FieldLabel htmlFor="branch-country">Country</FieldLabel>
                    <Input id="branch-country" readOnly value={pickedCountryName ?? (countryIso ? (countryName(countryIso) ?? countryIso) : "")} placeholder="Select country" aria-invalid={!!errors.countryIso || undefined} className={cn("bg-muted", invalid(errors.countryIso))}/>
                    <input type="hidden" {...register("countryIso")}/>
                    <FieldError message={errors.countryIso?.message}/>
                </Field>

                <Field>
                    <FieldLabel htmlFor="branch-phone">Phone for customers</FieldLabel>
                    <div className="flex gap-2">
                        <CountryCodeInput value={phoneCountryCode} setValue={(v) => setValue("phoneCountryCode", v, {shouldValidate: true})}/>
                        <Input {...register("phoneNumber")} id="branch-phone" type="tel" placeholder="221234567" aria-invalid={!!errors.phoneNumber || undefined} className={cn("flex-1", invalid(errors.phoneNumber))}/>
                    </div>
                    <FieldError message={errors.phoneCountryCode?.message ?? errors.phoneNumber?.message}/>
                </Field>

                <Field>
                    <FieldLabel htmlFor="branch-email">Support email</FieldLabel>
                    <Input {...register("email")} id="branch-email" type="email" placeholder="kontakt@autofix.pl" aria-invalid={!!errors.email || undefined} className={invalid(errors.email)}/>
                    <FieldError message={errors.email?.message}/>
                </Field>
            </form>
        </WizardCard>
    );
}
