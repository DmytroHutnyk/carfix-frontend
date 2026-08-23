import {z} from "zod";
import {Address, User} from "@/features/user/userTypes";

export interface UseUpdateCoreReturn {
    updateCore: (data: UpdateUserCore) => Promise<User>;
}

export interface UseUpdateAddressReturn {
    updateAddress: (data: UpdateAddress) => Promise<Address>;
    deleteAddress: () => Promise<void>;
}

export const locationSchema = z.object({
    city: z.string().min(1, "Pick a city from the suggestions"),
    region: z.string().min(1, "Pick a city from the suggestions"),
    countryIso: z.string().length(2, "Country is required"),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
});

/* Shared user-core fields editable from the profile page. The backend resolves the
 * principal from the session, so no id is sent. Role tails get
 * their own schema + endpoint. */
export const updateUserCoreSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Name is required")
        .max(50, "Name cannot exceed 50 characters"),

    surname: z.string()
        .trim()
        .min(1, "Surname is required")
        .max(50, "Surname cannot exceed 50 characters"),

    dateOfBirth: z.string()       // ISO date string "2000-01-15"
        .nullable()
        .optional()
        .refine(
            (val) => !val || !isNaN(Date.parse(val)),
            "Invalid date"
        )
        .refine(
            (val) => !val || new Date(val) < new Date(),
            "Date of birth must be in the past"
        ),

    preferredLocation: locationSchema.nullable(),
})

export type UpdateUserCore = z.infer<typeof updateUserCoreSchema>;

export interface LocationRequest {
    city: string;
    region: string;
    countryIso: string;
    latitude: number | null;
    longitude: number | null;
}

export interface UpdateUserRequest {
    name: string;
    surname: string;
    dateOfBirth: string | null;
    preferredLocation: LocationRequest | null;
}

/* Address card form; countryName is display-only and never sent. */
export const updateAddressSchema = z.object({
    streetName: z.string()
        .trim()
        .min(1, "Pick an address from the suggestions")
        .max(100, "Street cannot exceed 100 characters"),

    buildingNumber: z.string()
        .trim()
        .min(1, "Building number is required")
        .max(10, "Building number cannot exceed 10 characters"),

    flatNumber: z.string()
        .trim()
        .max(10, "Apartment number cannot exceed 10 characters"),

    postalCode: z.string()
        .trim()
        .min(1, "Postal code is required")
        .max(10, "Postal code cannot exceed 10 characters"),

    city: z.string()
        .trim()
        .min(1, "Pick an address from the suggestions")
        .max(100, "City cannot exceed 100 characters"),

    region: z.string()
        .trim()
        .min(1, "Pick an address with a region")
        .max(100, "Region cannot exceed 100 characters"),

    countryIso: z.string()
        .length(2, "Pick an address from the suggestions"),

    countryName: z.string(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    googlePlaceId: z.string().nullable(),
});

export type UpdateAddress = z.infer<typeof updateAddressSchema>;

export interface UpdateUserAddressRequest {
    streetName: string;
    buildingNumber: string;
    flatNumber: string | null;
    postalCode: string;
    city: string;
    region: string;
    countryIso: string;
    latitude: number | null;
    longitude: number | null;
    googlePlaceId: string | null;
}
