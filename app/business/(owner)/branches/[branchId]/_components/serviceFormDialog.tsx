"use client"

import {useState} from "react";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Info, Plus, Trash2} from "lucide-react";

import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/_components/shadcn/dialog";
import {Field, FieldLabel} from "@/_components/shadcn/field";
import {Input} from "@/_components/shadcn/input";
import {Textarea} from "@/_components/shadcn/textarea";
import {Button} from "@/_components/shadcn/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/_components/shadcn/popover";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import MultiSelectField from "@/_components/multiSelectField";
import ServiceNamingHint from "@/_components/serviceNamingHint";
import FormErrorAlert from "@/_components/formErrorAlert";
import {useServiceCategories} from "@/features/branchRegistration/useServiceCategories";
import {ServiceForm, serviceFormSchema} from "@/features/ownerService/ownerServiceTypes";
import {isApiError} from "@/lib/apiTypes";
import {toDisplayError} from "@/lib/errorHandler";
import {cn} from "@/lib/utils";

interface ServiceFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    initial: ServiceForm;
    bayTypeOptions: string[];
    roleOptions: string[];
    equipmentTypeOptions: string[];
    optionsLoading: boolean;
    onSubmit: (form: ServiceForm) => Promise<void>;
}

export default function ServiceFormDialog({
                                              open, onOpenChange, mode, initial, bayTypeOptions, roleOptions,
                                              equipmentTypeOptions, optionsLoading, onSubmit,
                                          }: ServiceFormDialogProps) {
    const {categories, isLoading: categoriesLoading, isError: categoriesError} = useServiceCategories();
    const [hintOpen, setHintOpen] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {register, control, handleSubmit, formState: {errors, isSubmitting}} = useForm<ServiceForm>({
        resolver: zodResolver(serviceFormSchema),
        mode: "onSubmit",
        defaultValues: initial,
    });
    const employeeRequirements = useFieldArray({control, name: "employeeRequirements"});
    const equipmentRequirements = useFieldArray({control, name: "equipmentRequirements"});

    const invalid = (has: unknown) => cn(!!has && "border-destructive focus-visible:ring-destructive");
    const fieldError = (message?: string) =>
        message ? <p className="text-xs text-destructive lg:text-sm">{message}</p> : null;

    const submit = async (form: ServiceForm) => {
        setSubmitError(null);
        try {
            await onSubmit(form);
            onOpenChange(false);
        } catch (err) {
            setSubmitError(isApiError(err) ? toDisplayError(err).message : "Something went wrong. Please try again.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-[calc(100vw-2rem)] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold lg:text-2xl lg:font-bold">
                        {mode === "edit" ? "Edit service" : "Add new service"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(submit)} noValidate className="space-y-3 lg:space-y-4">
                    <FormErrorAlert message={submitError}/>

                    <Field>
                        <div className="flex items-center gap-2">
                            <FieldLabel htmlFor="service-name">Name</FieldLabel>
                            <Popover open={hintOpen} onOpenChange={setHintOpen}>
                                <PopoverTrigger asChild>
                                    <button type="button" aria-label="How to name a service" className="text-muted-foreground hover:text-foreground">
                                        <Info className="h-4 w-4"/>
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="w-80 text-sm"><ServiceNamingHint/></PopoverContent>
                            </Popover>
                        </div>
                        <Input {...register("name")} id="service-name" placeholder="Service name"
                               aria-invalid={!!errors.name || undefined} className={invalid(errors.name)}/>
                        {fieldError(errors.name?.message)}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="service-description">Description</FieldLabel>
                        <Textarea {...register("description")} id="service-description" placeholder="Optional description" rows={3}
                                  aria-invalid={!!errors.description || undefined} className={invalid(errors.description)}/>
                        {fieldError(errors.description?.message)}
                    </Field>

                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="service-duration">Duration (minutes)</FieldLabel>
                            <Input {...register("durationMinutes", {valueAsNumber: true})} id="service-duration" type="number" min={1} step={1}
                                   aria-invalid={!!errors.durationMinutes || undefined} className={invalid(errors.durationMinutes)}/>
                            {fieldError(errors.durationMinutes?.message)}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="service-price">Price (PLN)</FieldLabel>
                            <Input {...register("price", {valueAsNumber: true})} id="service-price" type="number" min={0} step="0.01"
                                   aria-invalid={!!errors.price || undefined} className={invalid(errors.price)}/>
                            {fieldError(errors.price?.message)}
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="service-category">Category</FieldLabel>
                        <Controller
                            control={control}
                            name="categoryId"
                            render={({field}) => (
                                <Select value={field.value ? String(field.value) : ""} onValueChange={(v) => field.onChange(Number(v))}
                                        disabled={categoriesLoading}>
                                    <SelectTrigger id="service-category" aria-invalid={!!errors.categoryId || undefined} className={invalid(errors.categoryId)}>
                                        <SelectValue placeholder={categoriesLoading ? "Loading…" : "Select category"}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {fieldError(errors.categoryId?.message)}
                        {categoriesError && fieldError("Couldn't load categories — reload the page and try again")}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="service-bay-types">Acceptable bay types</FieldLabel>
                        <p className="text-xs text-muted-foreground">Any one free bay of these types can host the service.</p>
                        <Controller
                            control={control}
                            name="bayTypes"
                            render={({field}) => (
                                <MultiSelectField id="service-bay-types" values={field.value} options={bayTypeOptions} onChange={field.onChange}
                                                  placeholder="Select bay types" maxNameLength={40} invalid={Boolean(errors.bayTypes)}
                                                  emptyMessage={optionsLoading ? "Loading…" : "No bay types yet — add one on the Car Bays tab"}/>
                            )}
                        />
                        {fieldError(errors.bayTypes?.message)}
                    </Field>

                    <Field>
                        <FieldLabel>Required employees</FieldLabel>
                        <p className="text-xs text-muted-foreground">One row = one person needed at the same time; pick every role that qualifies for that row.</p>
                        <div className="space-y-2">
                            {employeeRequirements.fields.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-[1fr_auto] items-start gap-2">
                                    <Controller
                                        control={control}
                                        name={`employeeRequirements.${index}.roles`}
                                        render={({field}) => (
                                            <MultiSelectField id={`service-employee-req-${index}`} values={field.value} options={roleOptions} onChange={field.onChange}
                                                              placeholder="Select roles" maxNameLength={50} ariaLabel={`Required employee ${index + 1} roles`}
                                                              invalid={Boolean(errors.employeeRequirements?.[index]?.roles)}
                                                              emptyMessage={optionsLoading ? "Loading…" : "No roles yet — add an employee with roles first"}/>
                                        )}
                                    />
                                    <Button type="button" variant="ghost" size="icon" aria-label="Remove requirement"
                                            className="h-8 w-8 lg:h-9 lg:w-9"
                                            disabled={employeeRequirements.fields.length === 1}
                                            onClick={() => employeeRequirements.remove(index)}>
                                        <Trash2/>
                                    </Button>
                                    {fieldError(errors.employeeRequirements?.[index]?.roles?.message)}
                                </div>
                            ))}
                        </div>
                        {fieldError(errors.employeeRequirements?.root?.message ?? errors.employeeRequirements?.message)}
                        <Button type="button" variant="outline" size="sm" onClick={() => employeeRequirements.append({roles: []})}>
                            <Plus/> Add another required employee
                        </Button>
                    </Field>

                    <Field>
                        <FieldLabel>Required equipment</FieldLabel>
                        <p className="text-xs text-muted-foreground">One row = one unit reserved for the service; pick every category that would do.</p>
                        <div className="space-y-2">
                            {equipmentRequirements.fields.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-[1fr_auto] items-start gap-2">
                                    <Controller
                                        control={control}
                                        name={`equipmentRequirements.${index}.types`}
                                        render={({field}) => (
                                            <MultiSelectField id={`service-equipment-req-${index}`} values={field.value} options={equipmentTypeOptions} onChange={field.onChange}
                                                              placeholder="Select equipment" maxNameLength={40} ariaLabel={`Required equipment ${index + 1} categories`}
                                                              invalid={Boolean(errors.equipmentRequirements?.[index]?.types)}
                                                              emptyMessage={optionsLoading ? "Loading…" : "No equipment types yet — add equipment first"}/>
                                        )}
                                    />
                                    <Button type="button" variant="ghost" size="icon" aria-label="Remove requirement"
                                            className="h-8 w-8 lg:h-9 lg:w-9"
                                            onClick={() => equipmentRequirements.remove(index)}>
                                        <Trash2/>
                                    </Button>
                                    {fieldError(errors.equipmentRequirements?.[index]?.types?.message)}
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={() => equipmentRequirements.append({types: []})}>
                            <Plus/> Add required equipment
                        </Button>
                    </Field>

                    <div className="flex items-center justify-end gap-2 pt-2 lg:justify-between lg:gap-0">
                        <Button type="button" variant="ghost" size="sm" disabled={isSubmitting}
                                className="lg:h-9 lg:bg-secondary lg:px-4 lg:py-2 lg:text-sm lg:text-secondary-foreground lg:shadow-sm lg:hover:bg-secondary/80"
                                onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
