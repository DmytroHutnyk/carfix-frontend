import {z} from "zod";
import {User} from "@/features/user/userTypes";

/* Mirrors the backend EmailVerificationCode rules — display/UX only, the backend enforces them. */
export const VERIFICATION_CODE_LENGTH = 6;
export const RESEND_COOLDOWN_SECONDS = 60;
export const CODE_TTL_MINUTES = 15;

export const verificationCodeSchema = z.object({
    code: z.string().regex(/^[0-9]{6}$/, "Enter the 6-digit code from the email"),
});

export type VerificationCodeForm = z.infer<typeof verificationCodeSchema>;

export interface ConfirmEmailVerificationRequest {
    code: string;
}

export interface UseEmailVerificationReturn {
    requestCode: () => Promise<void>;
    confirmCode: (data: VerificationCodeForm) => Promise<User>;
    isRequesting: boolean;
    isConfirming: boolean;
}
