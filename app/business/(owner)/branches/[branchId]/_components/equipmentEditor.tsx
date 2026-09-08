'use client'

import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ChevronDown} from "lucide-react";

import {EquipmentForm, OwnerEquipment, equipmentFormSchema, toEquipmentForm} from "@/features/ownerEquipment/ownerEquipmentTypes";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError} from "@/lib/apiTypes";
import {cn} from "@/lib/utils";

import {Card, CardContent} from "@/_components/shadcn/card";
import {Input} from "@/_components/shadcn/input";
import {Textarea} from "@/_components/shadcn/textarea";
import {Button} from "@/_components/shadcn/button";
import {Label} from "@/_components/shadcn/label";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/_components/shadcn/collapsible";
import {Separator} from "@/_components/shadcn/separator";
import FormErrorAlert from "@/_components/formErrorAlert";

export default function EquipmentEditor({equipment, submitLabel, onSubmit}: {
    equipment: OwnerEquipment | null;
    submitLabel: string;
    onSubmit: (form: EquipmentForm) => Promise<void>;
}) {
    const [error, setError] = useState<string | null>(null);

    const {register, handleSubmit, formState: {errors, isSubmitting, isDirty}} = useForm<EquipmentForm>({
        resolver: zodResolver(equipmentFormSchema),
        mode: "onSubmit",
        values: toEquipmentForm(equipment),
    });

    const submit = async (form: EquipmentForm) => {
        setError(null);
        try {
            await onSubmit(form);
        } catch (err) {
            setError(toDisplayError(err as ApiError).message);
        }
    };

    return (
        <Card>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <Label>Name</Label>
                            <Input {...register("name")} className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}/>
                            {errors.name && <p className="text-xs text-destructive lg:text-sm">{errors.name.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label>Type</Label>
                            <Input {...register("type")} placeholder="e.g. Lift" className={cn(errors.type && "border-destructive focus-visible:ring-destructive")}/>
                            {errors.type && <p className="text-xs text-destructive lg:text-sm">{errors.type.message}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label>Notes</Label>
                        <Textarea
                            {...register("notes")}
                            rows={4}
                            placeholder="Anything worth remembering about this equipment"
                            className={cn("resize-none", errors.notes && "border-destructive focus-visible:ring-destructive")}
                        />
                        {errors.notes && <p className="text-xs text-destructive lg:text-sm">{errors.notes.message}</p>}
                    </div>

                    <Separator/>

                    <Collapsible>
                        <CollapsibleTrigger type="button" className="flex w-full items-center justify-between text-sm font-semibold">
                            Availability Schedule
                            <ChevronDown className="h-4 w-4"/>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-3">
                            <p className="text-sm text-muted-foreground">Availability schedule editing is coming soon.</p>
                        </CollapsibleContent>
                    </Collapsible>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={isSubmitting || (equipment !== null && !isDirty)}>
                            {isSubmitting ? "Saving..." : submitLabel}
                        </Button>
                    </div>

                    <FormErrorAlert message={error}/>
                </form>
            </CardContent>
        </Card>
    );
}
