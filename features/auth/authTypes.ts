import {Account} from "@/features/user/userTypes";
import {z} from "zod";

export interface AuthState {
    account: Account | null;

    isLoading: boolean;

    isAuthenticated: boolean;

    isError: boolean;

    error: Error | null;
}

export interface AuthActions {
    login: (credentials: LoginCredentials) => Promise<Account>;
    register: (registerData: RegisterData) => Promise<Account>;
    logout: () => Promise<void>;
}

export interface UseAuthReturn extends AuthState, AuthActions {
}

export const registerSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Name is required")
        .max(50, "Name cannot exceed 50 characters"),

    surname: z.string()
        .trim()
        .min(1, "Surname is required")
        .max(50, "Surname cannot exceed 50 characters"),

    phoneCountryCode: z.string()
        .min(1, "Country code is required"),

    phoneNumber: z.string()
        .transform((val) => val.replace(/\s+/g, ""))
        .pipe(
            z.string()
                .min(1, "Phone number is required")
                .max(15, "Phone number cannot exceed 15 digits")
                .regex(/^[0-9]{5,15}$/, "Phone number must contain from 5 to 15 digits")
        ),

    email: z.string()
        .trim()
        .min(1, "Email is required")
        .email("Invalid email address")
        .max(30, "Email cannot exceed 30 characters"),

    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(20, "Password must be at most 20 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one digit")
        .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character"),
});

export type RegisterData = z.infer<typeof registerSchema>;


export const loginSchema = z.object({
    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email address"),
    password: z.string()
        .min(1, "Password is required")
})

export type LoginCredentials = z.infer<typeof loginSchema>


export const messageSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Name is required")
        .max(50, "Name cannot exceed 50 characters"),

    email: z.string()
        .trim()
        .min(1, "Email is required")
        .email("Invalid email address"),

    message: z.string()
        .trim()
        .min(5, "Message is too short")
        .max(5000, "Message is too long")
})

export type HelpMessage = z.infer<typeof messageSchema>;
