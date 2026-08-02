'use client'

import {useMemo, useState} from "react";
import {Controller, useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {OrbitProgress} from "react-loading-indicators";

import {CarProfile, CarProfileForm, carProfileFormSchema, ModelGeneration} from "@/util/types/carProfileTypes";
import {useCarCatalog} from "@/util/hooks/useCarCatalog";
import {useCarProfiles} from "@/util/hooks/useCarProfiles";
import {toDisplayError} from "@/util/func/errorHandler";
import {yearsFromToday} from "@/util/func/dateBounds";
import {ApiError} from "@/util/types/apiTypes";
import {cn} from "@/util/lib/utils";

import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/_components/shadcn/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import {Field, FieldLabel} from "@/_components/shadcn/field";
import {Input} from "@/_components/shadcn/input";
import {Button} from "@/_components/shadcn/button";
import FormErrorAlert from "@/_components/formErrorAlert";
import DatePicker from "@/_components/datePicker";

const ALL_YEARS = "all";

const COVERAGE_YEARS_BACK = -20;
const COVERAGE_YEARS_AHEAD = 10;

function toYearOptions(generations: ModelGeneration[]): number[] {
    const currentYear = new Date().getFullYear();
    const years = new Set<number>();
    for (const g of generations) {
        const start = g.startProduction ?? currentYear;
        const end = g.endProduction ?? currentYear;
        for (let y = start; y <= end; y++) years.add(y);
    }
    return [...years].sort((a, b) => b - a);
}

function coversYear(g: ModelGeneration, year: number): boolean {
    const currentYear = new Date().getFullYear();
    return (g.startProduction ?? currentYear) <= year && year <= (g.endProduction ?? currentYear);
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
        formState: {errors, isSubmitting},
    } = useForm<CarProfileForm>({
        resolver: zodResolver(carProfileFormSchema),
        mode: "onSubmit",
        defaultValues: isEdit ? {
            name: carProfile.name,
            brandId: carProfile.brandId,
            modelId: carProfile.modelId,
            year: null,
            modelGenerationId: carProfile.generationId,
            vin: carProfile.vin ?? "",
            plates: carProfile.plates ?? "",
            insuranceDate: carProfile.insuranceDate,
            serviceCertificateDate: carProfile.serviceCertificateDate,
        } : {
            name: "",
            brandId: null,
            modelId: null,
            year: null,
            modelGenerationId: undefined,
            vin: "",
            plates: "",
            insuranceDate: null,
            serviceCertificateDate: null,
        },
    });

    const brandId = useWatch({control, name: "brandId"});
    const modelId = useWatch({control, name: "modelId"});
    const year = useWatch({control, name: "year"});

    const {brands, models, generations} = useCarCatalog(brandId, modelId);

    const yearOptions = useMemo(() => toYearOptions(generations), [generations]);
    const engineOptions = useMemo(
        () => (year === null ? generations : generations.filter((g) => coversYear(g, year))),
        [generations, year]
    );

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
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
                {isSubmitting && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-card/75">
                        <OrbitProgress color="var(--primary)" size="large" text="" textColor="" dense/>
                    </div>
                )}
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold">
                        {isEdit ? "Edit Vehicle" : "Add Vehicle"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                    {/*-==-==-=-=-=-=--==-=-=-=-Name-==-==-=-=-=-=-=-=-=---==*/}
                    <Field>
                        <FieldLabel htmlFor="carName">Name</FieldLabel>
                        <Input
                            {...register("name")}
                            id="carName"
                            type="text"
                            placeholder="e.g. Family Car"
                            className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </Field>

                    {/*-==-==-=-=-=-=--==-=-=-=-Catalog cascade (add only)-==-==-=-=-=-=-=-=-=---==*/}
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
                                                // @ts-expect-error intentional reset to empty required field
                                                setValue("modelGenerationId", undefined);
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
                                                setValue("modelGenerationId", undefined);
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

                            <Field>
                                <FieldLabel>Year</FieldLabel>
                                <Controller
                                    name="year"
                                    control={control}
                                    render={({field}) => (
                                        <Select
                                            disabled={modelId === null}
                                            value={field.value?.toString() ?? ALL_YEARS}
                                            onValueChange={(v) => field.onChange(v === ALL_YEARS ? null : Number(v))}
                                        >
                                            <SelectTrigger><SelectValue placeholder="All years"/></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={ALL_YEARS}>All years</SelectItem>
                                                {yearOptions.map((y) => (
                                                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                        </>
                    )}

                    {/*-==-==-=-=-=-=--==-=-=-=-Engine-==-==-=-=-=-=-=-=-=---==*/}
                    <Field>
                        <FieldLabel>Engine</FieldLabel>
                        <Controller
                            name="modelGenerationId"
                            control={control}
                            render={({field}) => (
                                <Select
                                    disabled={modelId === null}
                                    value={field.value?.toString() ?? ""}
                                    onValueChange={(v) => field.onChange(Number(v))}
                                >
                                    <SelectTrigger
                                        className={cn(errors.modelGenerationId && "border-destructive focus-visible:ring-destructive")}
                                    >
                                        <SelectValue placeholder="Select engine type"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {engineOptions.map((g) => (
                                            <SelectItem key={g.id} value={g.id.toString()}>{g.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.modelGenerationId && (
                            <p className="text-sm text-destructive">{errors.modelGenerationId.message}</p>
                        )}
                    </Field>

                    {/*-==-==-=-=-=-=--==-=-=-=-Dates-==-==-=-=-=-=-=-=-=---==*/}
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

                    {/*-==-==-=-=-=-=--==-=-=-=-VIN + Plates-==-==-=-=-=-=-=-=-=---==*/}
                    <Field>
                        <FieldLabel htmlFor="vin">VIN</FieldLabel>
                        <Input
                            {...register("vin")}
                            id="vin"
                            type="text"
                            placeholder="Enter 17-character VIN"
                            className={cn(errors.vin && "border-destructive focus-visible:ring-destructive")}
                        />
                        {errors.vin && <p className="text-sm text-destructive">{errors.vin.message}</p>}
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
                        {errors.plates && <p className="text-sm text-destructive">{errors.plates.message}</p>}
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
