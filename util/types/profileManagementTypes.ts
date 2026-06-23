import {z} from "zod";
import {User} from "@/util/types/userTypes";

export interface UseUpdateCoreReturn {
    updateCore: (data: UpdateUserCore) => Promise<User>;
}

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
})

export type UpdateUserCore = z.infer<typeof updateUserCoreSchema>;
