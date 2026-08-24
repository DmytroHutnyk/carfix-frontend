'use client'

import {ReactNode, useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {REGEXP_ONLY_DIGITS} from "input-otp";
import {CircleCheck} from "lucide-react";

import {useEmailVerification} from "@/features/user/useEmailVerification";
import {
    CODE_TTL_MINUTES,
    RESEND_COOLDOWN_SECONDS,
    VERIFICATION_CODE_LENGTH,
    VerificationCodeForm,
    verificationCodeSchema,
} from "@/features/user/emailVerificationTypes";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError} from "@/lib/apiTypes";
import {cn} from "@/lib/utils";

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "@/_components/shadcn/dialog";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/_components/shadcn/input-otp";
import {Button} from "@/_components/shadcn/button";
import {Field, FieldError, FieldLabel} from "@/_components/shadcn/field";
import FormErrorAlert from "@/_components/formErrorAlert";

const RESEND_TOO_SOON = "VERIFICATION_CODE_RESEND_TOO_SOON";

export default function VerifyEmailDialog({email, children}: {email: string; children: ReactNode}) {
    const [open, setOpen] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);
    const [verified, setVerified] = useState(false);
    const {requestCode, confirmCode, isRequesting} = useEmailVerification();

    const {
        control,
        handleSubmit,
        reset,
        setError: setFieldError,
        formState: {errors, isSubmitting},
    } = useForm<VerificationCodeForm>({
        resolver: zodResolver(verificationCodeSchema),
        defaultValues: {code: ""},
    });

    useEffect(() => {
        if (cooldown <= 0) return;
        const id = setInterval(() => setCooldown((s) => s - 1), 1000);
        return () => clearInterval(id);
    }, [cooldown]);

    const sendCode = async () => {
        setError(null);
        try {
            await requestCode();
            setNotice(`We sent a ${VERIFICATION_CODE_LENGTH}-digit code to ${email}. It expires in ${CODE_TTL_MINUTES} minutes.`);
            setCooldown(RESEND_COOLDOWN_SECONDS);
        } catch (err) {
            const display = toDisplayError(err as ApiError);
            if (display.code === RESEND_TOO_SOON) {
                setNotice(`${display.message}. Check your inbox (and spam) for the code we already sent to ${email}.`);
                return;
            }
            setError(display.message);
        }
    };

    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (next) {
            reset();
            setNotice(null);
            setError(null);
            setVerified(false);
            void sendCode();
        }
    };

    const onSubmit = async (data: VerificationCodeForm) => {
        setError(null);
        try {
            await confirmCode(data);
            setVerified(true);
        } catch (err) {
            const display = toDisplayError(err as ApiError);
            if (display.field === "code") {
                setFieldError("code", {type: "server", message: display.message});
                return;
            }
            setError(display.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="w-[calc(100%-2rem)] rounded-lg">
                <DialogHeader>
                    <DialogTitle>Verify your email</DialogTitle>
                    <DialogDescription>
                        {verified
                            ? "Your email address is now verified."
                            : notice ?? (isRequesting ? "Sending the code…" : `Enter the ${VERIFICATION_CODE_LENGTH}-digit code we emailed you.`)}
                    </DialogDescription>
                </DialogHeader>

                {verified ? (
                    <div className="flex flex-col items-center gap-3 py-2 lg:gap-4">
                        <CircleCheck className="h-10 w-10 text-success-badge-foreground lg:h-12 lg:w-12"/>
                        <p className="text-sm font-medium lg:text-base">{email} is verified</p>
                        <Button type="button" size="sm" className="lg:h-9 lg:w-35 lg:px-4 lg:py-2 lg:text-sm" onClick={() => setOpen(false)}>Close</Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3 lg:space-y-4">
                        <Field>
                            <FieldLabel htmlFor="verification-code">Verification code</FieldLabel>
                            <Controller
                                name="code"
                                control={control}
                                render={({field}) => (
                                    <InputOTP
                                        id="verification-code"
                                        maxLength={VERIFICATION_CODE_LENGTH}
                                        pattern={REGEXP_ONLY_DIGITS}
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={isSubmitting || isRequesting}
                                        autoFocus
                                    >
                                        <InputOTPGroup>
                                            {Array.from({length: VERIFICATION_CODE_LENGTH}, (_, index) => (
                                                <InputOTPSlot
                                                    key={index}
                                                    index={index}
                                                    className={cn(errors.code && "border-destructive")}
                                                />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                )}
                            />
                            {errors.code && <FieldError>{errors.code.message}</FieldError>}
                        </Field>

                        <div className="flex items-center justify-between gap-2">
                            <Button
                                type="button"
                                variant="link"
                                size="sm"
                                className="px-0 lg:h-9 lg:py-2 lg:text-sm"
                                onClick={sendCode}
                                disabled={cooldown > 0 || isRequesting || isSubmitting}
                            >
                                {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                            </Button>
                            <Button type="submit" size="sm" className="lg:h-9 lg:w-35 lg:px-4 lg:py-2 lg:text-sm" disabled={isSubmitting || isRequesting}>
                                {isSubmitting ? "Verifying..." : "Verify"}
                            </Button>
                        </div>

                        <FormErrorAlert message={error}/>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
