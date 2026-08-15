'use client'

import {KeyRound, Mail, Phone} from "lucide-react";

import {User} from "@/features/user/userTypes";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Field, FieldDescription, FieldLabel} from "@/_components/shadcn/field";
import {Input} from "@/_components/shadcn/input";
import {Button} from "@/_components/shadcn/button";
import {Badge} from "@/_components/shadcn/badge";
import VerifyEmailDialog from "@/(main)/(withFooter)/(myAccount)/profile/_components/verifyEmailDialog";

export default function ContactSecurityCard({user}: {user: User | null}) {
    if (!user) return null;

    const emailVerified = user.emailVerifiedAt !== null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contact &amp; Security</CardTitle>
                <CardDescription>Manage your contact information and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Field>
                    <FieldLabel htmlFor="email" className="items-center gap-2">
                        Email
                        <Badge variant={emailVerified ? "success" : "destructiveSoft"}>
                            <Mail className="mr-1 h-3 w-3"/>
                            {emailVerified ? "Verified" : "Not Verified"}
                        </Badge>
                    </FieldLabel>
                    <div className="flex gap-2">
                        <Input
                            id="email"
                            type="email"
                            value={user.email}
                            readOnly
                            className="bg-muted/40"
                        />
                        <VerifyEmailDialog email={user.email}>
                            <Button type="button" disabled={emailVerified} title={emailVerified ? "Your email is verified" : undefined}>
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
                    <div className="flex gap-2">
                        <Input
                            value={user.phoneCountryCode}
                            readOnly
                            aria-label="Phone country code"
                            className="w-20 bg-muted/40 text-center"
                        />
                        <Input
                            id="phoneNumber"
                            type="tel"
                            value={user.phoneNumber}
                            readOnly
                            className="flex-1 bg-muted/40"
                        />
                        <Button type="button" disabled title="Phone verification is not available yet">
                            Verify
                        </Button>
                    </div>
                </Field>

                <div>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled
                        title="Password reset is coming soon"
                    >
                        <KeyRound className="mr-2 h-4 w-4"/>
                        Reset Password
                    </Button>
                    <FieldDescription className="mt-2">Password reset will be available soon.</FieldDescription>
                </div>
            </CardContent>
        </Card>
    );
}
