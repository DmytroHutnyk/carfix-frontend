import {z} from "zod";

export interface OwnerEquipment {
    id: string;
    name: string;
    type: string;
    notes: string;
    status?: string;
}

export interface OwnerEquipmentRequest {
    name: string;
    type: string;
    notes: string;
}

export const equipmentFormSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(100, "Name cannot exceed 100 characters"),
    type: z.string().trim().max(50, "Type cannot exceed 50 characters"),
    notes: z.string().trim().max(500, "Notes cannot exceed 500 characters"),
});

export type EquipmentForm = z.infer<typeof equipmentFormSchema>;

export function toEquipmentForm(equipment: OwnerEquipment | null): EquipmentForm {
    if (!equipment) {
        return {name: "", type: "", notes: ""};
    }
    return {
        name: equipment.name,
        type: equipment.type,
        notes: equipment.notes,
    };
}

export function toEquipmentRequest(form: EquipmentForm): OwnerEquipmentRequest {
    return {
        name: form.name.trim(),
        type: form.type.trim(),
        notes: form.notes.trim(),
    };
}
