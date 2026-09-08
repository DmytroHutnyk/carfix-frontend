'use client'

import {useMemo, useState} from "react";
import {Controller, useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {OrbitProgress} from "react-loading-indicators";

import {CarProfile, CarProfileForm, carProfileFormSchema, ModelVersion} from "@/features/carProfile/carProfileTypes";
import {useCarCatalog} from "@/features/carCatalog/useCarCatalog";
import {useCarProfiles} from "@/features/carProfile/useCarProfiles";
import {toDisplayError} from "@/lib/errorHandler";
import {yearsFromToday} from "@/lib/dateBounds";
import {ApiError} from "@/lib/apiTypes";
import {cn} from "@/lib/utils";

import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/_components/shadcn/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import {Field, FieldLabel} from "@/_components/shadcn/field";
import {Input} from "@/_components/shadcn/input";
import {Button} from "@/_components/shadcn/button";
import FormErrorAlert from "@/_components/formErrorAlert";
import DatePicker from "@/_components/datePicker";

const COVERAGE_YEARS_BACK = -20;
const COVERAGE_YEARS_AHEAD = 10;

function toYearOptions(version: ModelVersion | undefined): number[] {
    if (version === undefined) return [];

    const currentYear = new Date().getFullYear();
    const start = version.startProduction ?? currentYear;
    const end = version.endProduction ?? currentYear;

    const years: number[] = [];
    for (let y = end; y >= start; y--) years.push(y);
    return years;
}

export default function CarFormDialog({open, onOpenChange, carProfile}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    carProfile?: CarProfile;
}) {
    const isEdit = carProfile !== undefined;
    const [error, setError] = useState<string | null>(null);
    const {createCarProfile, updateCarProfile} = useCarProfiles({enabled: false});

    const coverageBounds = useMemo(() => ({
        min: yearsFromToday(COVERAGE_YEARS_BACK),
        max: yearsFromToday(COVERAGE_YEARS_AHEAD),
    }), []);

    const {
        control,
        register,
        handleSubmit,
        setValue,
        resetField,
        formState: {errors, isSubmitting},
    } = useForm<CarProfileForm>({
        resolver: zodResolver(carProfileFormSchema),
        mode: "onSubmit",
        defaultValues: isEdit ? {
            name: carProfile.name,
            brandId: carProfile.brandId,
            modelId: carProfile.modelId,
            year: null,
            modelVersionId: carProfile.versionId,
            vin: carProfile.vin ?? "",
            plates: carProfile.plates ?? "",
            insuranceDate: carProfile.insuranceDate,
            serviceCertificateDate: carProfile.serviceCertificateDate,
        } : {
            name: "",
            brandId: null,
            modelId: null,
            year: null,
            modelVersionId: undefined,
            vin: "",
            plates: "",
            insuranceDate: null,
            serviceCertificateDate: null,
        },
    });

    const brandId = useWatch({control, name: "brandId"});
    const modelId = useWatch({control, name: "modelId"});
    const modelVersionId = useWatch({control, name: "modelVersionId"});

    const {brands, models, versions} = useCarCatalog(brandId, modelId);

    const selectedVersion = useMemo(
        () => versions.find((v) => v.id === modelVersionId),
        [versions, modelVersionId]
    );
    const yearOptions = useMemo(() => toYearOptions(selectedVersion), [selectedVersion]);

    const onSubmit = async (form: CarProfileForm) => {
        setError(null);
        try {
            if (isEdit) {
                await updateCarProfile(carProfile.id, form);
            } else {
                await createCarProfile(form);
            }
            onOpenChange(false);
        } catch (err) {
            setError(toDisplayError(err as ApiError).message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg sm:max-w-md">
                {isSubmitting && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-card/75">
                        <OrbitProgress color="var(--primary)" size="large" text="" textColor="" dense/>
                    </div>
                )}
                <DialogHeader>
                    <DialogTitle className="text-center text-base font-semibold lg:text-2xl lg:font-bold">
                        {isEdit ? "Edit Vehicle" : "Add Vehicle"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3 lg:space-y-4">
                    <Field>
                        <FieldLabel htmlFor="carName">Name</FieldLabel>
                        <Input
                            {...register("name")}
                            id="carName"
                            type="text"
                            placeholder="e.g. Family Car"
                            className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}
                        />
                        {errors.name && <p className="text-xs text-destructive lg:text-sm">{errors.name.message}</p>}
                    </Field>

                    {!isEdit && (
                        <>
                            <Field>
                                <FieldLabel>Brand</FieldLabel>
                                <Controller
                                    name="brandId"
                                    control={control}
                                    render={({field}) => (
                                        <Select
                                            value={field.value?.toString() ?? ""}
                                            onValueChange={(v) => {
                                                field.onChange(Number(v));
                                                setValue("modelId", null);
                                                setValue("year", null);
                                                resetField("modelVersionId");
                                            }}
                                        >
                                            <SelectTrigger><SelectValue placeholder="Select a brand"/></SelectTrigger>
                                            <SelectContent>
                                                {brands.map((b) => (
                                                    <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Model</FieldLabel>
                                <Controller
                                    name="modelId"
                                    control={control}
                                    render={({field}) => (
                                        <Select
                                            disabled={brandId === null}
                                            value={field.value?.toString() ?? ""}
                                            onValueChange={(v) => {
                                                field.onChange(Number(v));
                                                setValue("year", null);
                                                resetField("modelVersionId");
                                            }}
                                        >
                                            <SelectTrigger><SelectValue placeholder="Select a model"/></SelectTrigger>
                                            <SelectContent>
                                                {models.map((m) => (
                                                    <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                        </>
                    )}

                    <Field>
                        <FieldLabel>Version</FieldLabel>
                        <Controller
                            name="modelVersionId"
                            control={control}
                            render={({field}) => (
                                <Select
                                    disabled={modelId === null}
                                    value={field.value?.toString() ?? ""}
                                    onValueChange={(v) => {
                                        field.onChange(Number(v));
                                        setValue("year", null);
                                    }}
                                >
                                    <SelectTrigger
                                        className={cn(errors.modelVersionId && "border-destructive focus-visible:ring-destructive")}
                                    >
                                        <SelectValue placeholder="Select version"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {versions.map((version) => (
                                            <SelectItem key={version.id} value={version.id.toString()}>{version.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.modelVersionId && (
                            <p className="text-xs text-destructive lg:text-sm">{errors.modelVersionId.message}</p>
                        )}
                    </Field>

                    {!isEdit && (
                        <Field>
                            <FieldLabel>Year</FieldLabel>
                            <Controller
                                name="year"
                                control={control}
                                render={({field}) => (
                                    <Select
                                        disabled={selectedVersion === undefined}
                                        value={field.value?.toString() ?? ""}
                                        onValueChange={(v) => field.onChange(Number(v))}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Select year"/></SelectTrigger>
                                        <SelectContent>
                                            {yearOptions.map((y) => (
                                                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </Field>
                    )}

                    <Controller
                        name="insuranceDate"
                        control={control}
                        render={({field}) => (
                            <DatePicker
                                id="insuranceDate"
                                label="Insurance to"
                                className="w-full"
                                value={field.value}
                                onChange={field.onChange}
                                error={!!errors.insuranceDate}
                                minDate={coverageBounds.min}
                                maxDate={coverageBounds.max}
                            />
                        )}
                    />
                    <Controller
                        name="serviceCertificateDate"
                        control={control}
                        render={({field}) => (
                            <DatePicker
                                id="serviceCertificateDate"
                                label="Vehicle inspection valid until"
                                className="w-full"
                                value={field.value}
                                onChange={field.onChange}
                                error={!!errors.serviceCertificateDate}
                                minDate={coverageBounds.min}
                                maxDate={coverageBounds.max}
                            />
                        )}
                    />

                    <Field>
                        <FieldLabel htmlFor="vin">VIN</FieldLabel>
                        <Input
                            {...register("vin")}
                            id="vin"
                            type="text"
                            placeholder="Enter 17-character VIN"
                            className={cn(errors.vin && "border-destructive focus-visible:ring-destructive")}
                        />
                        {errors.vin && <p className="text-xs text-destructive lg:text-sm">{errors.vin.message}</p>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="plates">Plates</FieldLabel>
                        <Input
                            {...register("plates")}
                            id="plates"
                            type="text"
                            placeholder="e.g. WA 12345"
                            className={cn(errors.plates && "border-destructive focus-visible:ring-destructive")}
                        />
                        {errors.plates && <p className="text-xs text-destructive lg:text-sm">{errors.plates.message}</p>}
                    </Field>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save"}
                    </Button>

                    <FormErrorAlert message={error}/>
                </form>
            </DialogContent>
        </Dialog>
    )
}
