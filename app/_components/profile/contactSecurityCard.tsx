'use client'

import {KeyRound, Mail, Phone} from "lucide-react";

import {User} from "@/features/user/userTypes";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Field, FieldDescription, FieldLabel} from "@/_components/shadcn/field";
import {Input} from "@/_components/shadcn/input";
import {Button} from "@/_components/shadcn/button";
import {Badge} from "@/_components/shadcn/badge";
import VerifyEmailDialog from "@/_components/profile/verifyEmailDialog";

const VERIFY_BUTTON = "shrink-0 lg:h-9 lg:bg-primary lg:px-4 lg:py-2 lg:text-sm lg:text-primary-foreground lg:shadow lg:hover:bg-primary/90";

export default function ContactSecurityCard({user}: {user: User | null}) {
    if (!user) return null;

    const emailVerified = user.emailVerifiedAt !== null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contact &amp; Security</CardTitle>
                <CardDescription>Manage your contact information and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 lg:space-y-6">
                <Field>
                    <FieldLabel htmlFor="email" className="items-center gap-2">
                        Email
                        <Badge variant={emailVerified ? "success" : "destructiveSoft"}>
                            <Mail className="mr-1 h-3 w-3"/>
                            {emailVerified ? "Verified" : "Not Verified"}
                        </Badge>
                    </FieldLabel>
                    <div className="flex items-center gap-2">
                        <Input
                            id="email"
                            type="email"
                            value={user.email}
                            readOnly
                            className="bg-muted/40"
                        />
                        <VerifyEmailDialog email={user.email}>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className={VERIFY_BUTTON}
                                disabled={emailVerified}
                                title={emailVerified ? "Your email is verified" : undefined}
                            >
                                Verify
                            </Button>
                        </VerifyEmailDialog>
                    </div>
                </Field>

                <Field>
                    <FieldLabel htmlFor="phoneNumber" className="items-center gap-2">
                        Phone Number
                        <Badge variant="destructiveSoft">
                            <Phone className="mr-1 h-3 w-3"/>
                            Not Verified
                        </Badge>
                    </FieldLabel>
                    <div className="flex items-center gap-2">
                        <Input
                            value={user.phoneCountryCode}
                            readOnly
                            aria-label="Phone country code"
                            className="w-16 shrink-0 bg-muted/40 px-2 text-center lg:w-20 lg:px-3"
                        />
                        <Input
                            id="phoneNumber"
                            type="tel"
                            value={user.phoneNumber}
                            readOnly
                            className="min-w-0 flex-1 bg-muted/40"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={VERIFY_BUTTON}
                            disabled
                            title="Phone verification is not available yet"
                        >
                            Verify
                        </Button>
                    </div>
                </Field>

                <div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled
                        title="Password reset is coming soon"
                        className="text-destructive lg:h-9 lg:border-transparent lg:bg-destructive-btn lg:px-4 lg:py-2 lg:text-sm lg:text-destructive-btn-foreground lg:shadow-sm lg:hover:bg-destructive-btn/90 lg:hover:text-destructive-btn-foreground"
                    >
                        <KeyRound className="mr-1 h-3.5 w-3.5 lg:mr-2 lg:h-4 lg:w-4"/>
                        Reset Password
                    </Button>
                    <FieldDescription className="mt-2 text-xs lg:text-sm">Password reset will be available soon.</FieldDescription>
                </div>
            </CardContent>
        </Card>
    );
}
