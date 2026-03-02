import {User} from "@/util/types/appTypes";

export interface ProfileActions{
    updateProfile: (params: { id: string; data: UpdateProfile }) => Promise<User>;
}

/*Do we actually need this?*/
export interface UseProfileReturn extends ProfileActions{

}

/*Update profile*/
import {z} from "zod";

export const updateProfileSchema = z.object({
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


export type UpdateProfile = z.infer<typeof updateProfileSchema>;