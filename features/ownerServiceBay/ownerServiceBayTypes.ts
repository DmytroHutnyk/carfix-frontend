import {z} from "zod";

export type ServiceBayStatus = "ACTIVE" | "SUSPENDED";

export interface OwnerServiceBay {
    id: number;
    name: string;
    typeId: number;
    type: string;
    notes: string | null;
    status: ServiceBayStatus;
}

export interface OwnerServiceBayType {
    id: number;
    name: string;
}

export interface ServiceBayRequest {
    name: string;
    serviceBayTypeId: number;
    notes: string | null;
}

export const serviceBayFormSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(100, "Name cannot exceed 100 characters"),
    serviceBayTypeId: z.number({message: "Select a type"}).int().min(1, "Select a type"),
    notes: z.string().trim().max(2000, "Notes cannot exceed 2000 characters"),
});

export type ServiceBayForm = z.infer<typeof serviceBayFormSchema>;

export function toServiceBayForm(bay: OwnerServiceBay | null): ServiceBayForm {
    if (!bay) {
        return {name: "", serviceBayTypeId: 0, notes: ""};
    }
    return {
        name: bay.name,
        serviceBayTypeId: bay.typeId,
        notes: bay.notes ?? "",
    };
}

export function toServiceBayRequest(form: ServiceBayForm): ServiceBayRequest {
    const notes = form.notes.trim();
    return {
        name: form.name.trim(),
        serviceBayTypeId: form.serviceBayTypeId,
        notes: notes ? notes : null,
    };
}
