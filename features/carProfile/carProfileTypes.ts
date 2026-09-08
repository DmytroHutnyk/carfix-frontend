import {z} from "zod";

export interface CarProfile {
    id: string;
    name: string;
    vin: string | null;
    plates: string | null;
    serviceCertificateDate: string | null;
    insuranceDate: string | null;
    brandId: number;
    brandName: string;
    modelId: number;
    modelName: string;
    versionId: number;
    versionName: string;
}

export interface CarBrand {
    id: number;
    name: string;
}

export interface CarModel {
    id: number;
    name: string;
    brandId: number;
}

export interface ModelVersion {
    id: number;
    name: string;
    startProduction: number | null;
    endProduction: number | null;
    modelId: number;
}

export interface CreateCarProfileRequest {
    name: string;
    vin: string | null;
    plates: string | null;
    serviceCertificateDate: string | null;
    insuranceDate: string | null;
    modelVersionId: number;
}

export interface UpdateCarProfileRequest {
    name: string;
    modelVersionId: number;
    vin: string | null;
    plates: string | null;
    insuranceDate: string | null;
    serviceCertificateDate: string | null;
}

const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;
const PLATES_REGEX = /^(?=.{5,10}$)(?=.*[A-Z])(?=.*\d)[A-Z0-9](?:[ -]?[A-Z0-9])+$/;

export const carProfileFormSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Name is required")
        .max(100, "Name cannot exceed 100 characters"),

    brandId: z.number().nullable(),
    modelId: z.number().nullable(),
    year: z.number().nullable(),

    modelVersionId: z.number("Version is required"),

    vin: z.string()
        .trim()
        .toUpperCase()
        .refine((v) => !v || VIN_REGEX.test(v), "VIN must be 17 characters — letters (no I/O/Q) and digits"),

    plates: z.string()
        .trim()
        .toUpperCase()
        .refine((v) => !v || PLATES_REGEX.test(v), "Invalid plates format"),

    insuranceDate: z.string().nullable(),
    serviceCertificateDate: z.string().nullable(),
});

export type CarProfileForm = z.infer<typeof carProfileFormSchema>;
