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
import ServiceNamingHint from "@/business/(owner)/service-points/new/_components/serviceNamingHint";
import FieldError from "@/business/(owner)/service-points/new/_components/fieldError";
import {useServiceCategories} from "@/features/branchRegistration/useServiceCategories";
import {
    EMPTY_SERVICE_FORM,
    SERVICE_STATUS,
    SERVICE_STATUS_LABEL,
    ServiceForm,
    serviceFormSchema,
    ServiceStatus,
} from "@/features/branchRegistration/branchRegistrationTypes";
import {cn} from "@/lib/utils";

interface ServiceFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initial?: ServiceForm;
    bayTypes: string[];
    roles: string[];
    equipmentTypes: string[];
    onCreateBayType: (name: string) => void;
    onCreateRole: (name: string) => void;
    onCreateEquipmentType: (name: string) => void;
    onSave: (form: ServiceForm) => void;
}

export default function ServiceFormDialog({
                                              open, onOpenChange, initial, bayTypes, roles, equipmentTypes,
                                              onCreateBayType, onCreateRole, onCreateEquipmentType, onSave,
                                          }: ServiceFormDialogProps) {
    const isEdit = initial !== undefined;
    const {categories, isLoading: categoriesLoading, isError: categoriesError} = useServiceCategories();
    const [hintOpen, setHintOpen] = useState(false);

    const {register, control, handleSubmit, formState: {errors}} = useForm<ServiceForm>({
        resolver: zodResolver(serviceFormSchema),
        mode: "onSubmit",
        defaultValues: initial ?? EMPTY_SERVICE_FORM,
    });
    const employeeRequirements = useFieldArray({control, name: "employeeRequirements"});
    const equipmentRequirements = useFieldArray({control, name: "equipmentRequirements"});

    const invalid = (has: unknown) => cn(!!has && "border-destructive focus-visible:ring-destructive");

    const submit = (form: ServiceForm) => {
        onSave(form);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{isEdit ? "Edit service" : "Add new service"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
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
                        <FieldError message={errors.name?.message}/>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="service-description">Description</FieldLabel>
                        <Textarea {...register("description")} id="service-description" placeholder="Optional description" rows={3}
                                  aria-invalid={!!errors.description || undefined} className={invalid(errors.description)}/>
                        <FieldError message={errors.description?.message}/>
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field>
                            <FieldLabel htmlFor="service-duration">Duration (minutes)</FieldLabel>
                            <Input {...register("durationMinutes", {valueAsNumber: true})} id="service-duration" type="number" min={1} step={1}
                                   aria-invalid={!!errors.durationMinutes || undefined} className={invalid(errors.durationMinutes)}/>
                            <FieldError message={errors.durationMinutes?.message}/>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="service-price">Price (PLN)</FieldLabel>
                            <Input {...register("price", {valueAsNumber: true})} id="service-price" type="number" min={0} step="0.01"
                                   aria-invalid={!!errors.price || undefined} className={invalid(errors.price)}/>
                            <FieldError message={errors.price?.message}/>
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
                        <FieldError message={errors.categoryId?.message}/>
                        {categoriesError && <FieldError message="Couldn't load categories — reload the page and try again"/>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="service-bay-types">Acceptable bay types</FieldLabel>
                        <p className="text-xs text-muted-foreground">Any one free bay of these types can host the service.</p>
                        <Controller
                            control={control}
                            name="bayTypes"
                            render={({field}) => (
                                <MultiSelectField id="service-bay-types" values={field.value} options={bayTypes} onChange={field.onChange}
                                                  onCreate={onCreateBayType} placeholder="Select bay types" createLabel="Add bay type"
                                                  maxNameLength={40} invalid={Boolean(errors.bayTypes)}
                                                  emptyMessage="No bay types yet — type a name to add one"/>
                            )}
                        />
                        <FieldError message={errors.bayTypes?.message}/>
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
                                            <MultiSelectField id={`service-employee-req-${index}`} values={field.value} options={roles} onChange={field.onChange}
                                                              onCreate={onCreateRole} placeholder="Select roles" createLabel="Add role"
                                                              maxNameLength={50} ariaLabel={`Required employee ${index + 1} roles`}
                                                              invalid={Boolean(errors.employeeRequirements?.[index]?.roles)}
                                                              emptyMessage="No roles yet — type a name to add one"/>
                                        )}
                                    />
                                    <Button type="button" variant="ghost" size="icon" aria-label="Remove requirement"
                                            disabled={employeeRequirements.fields.length === 1}
                                            onClick={() => employeeRequirements.remove(index)}>
                                        <Trash2/>
                                    </Button>
                                    <FieldError message={errors.employeeRequirements?.[index]?.roles?.message}/>
                                </div>
                            ))}
                        </div>
                        <FieldError message={errors.employeeRequirements?.root?.message ?? errors.employeeRequirements?.message}/>
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
                                            <MultiSelectField id={`service-equipment-req-${index}`} values={field.value} options={equipmentTypes} onChange={field.onChange}
                                                              onCreate={onCreateEquipmentType} placeholder="Select equipment" createLabel="Add category"
                                                              maxNameLength={40} ariaLabel={`Required equipment ${index + 1} categories`}
                                                              invalid={Boolean(errors.equipmentRequirements?.[index]?.types)}
                                                              emptyMessage="No equipment categories yet — type a name to add one"/>
                                        )}
                                    />
                                    <Button type="button" variant="ghost" size="icon" aria-label="Remove requirement"
                                            onClick={() => equipmentRequirements.remove(index)}>
                                        <Trash2/>
                                    </Button>
                                    <FieldError message={errors.equipmentRequirements?.[index]?.types?.message}/>
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={() => equipmentRequirements.append({types: []})}>
                            <Plus/> Add required equipment
                        </Button>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="service-status">Status</FieldLabel>
                        <Controller
                            control={control}
                            name="status"
                            render={({field}) => (
                                <Select value={field.value} onValueChange={(v) => field.onChange(v as ServiceStatus)}>
                                    <SelectTrigger id="service-status"><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        {[SERVICE_STATUS.ACTIVE, SERVICE_STATUS.SUSPENDED].map((s) => (
                                            <SelectItem key={s} value={s}>{SERVICE_STATUS_LABEL[s]}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </Field>

                    <div className="flex items-center justify-between pt-2">
                        <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
