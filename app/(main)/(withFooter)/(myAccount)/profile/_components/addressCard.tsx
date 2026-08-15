'use client'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Field, FieldDescription, FieldLabel} from "@/_components/shadcn/field";
import {Input} from "@/_components/shadcn/input";

/*
 * mock
 */
export default function AddressCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Address</CardTitle>
                <CardDescription>Your address information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Field>
                    <FieldLabel htmlFor="street">Street</FieldLabel>
                    <Input id="street" placeholder="Coming soon" disabled/>
                </Field>

                <Field>
                    <FieldLabel htmlFor="apartment">Apartment</FieldLabel>
                    <Input id="apartment" placeholder="Coming soon" disabled/>
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field>
                        <FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
                        <Input id="postalCode" placeholder="Coming soon" disabled/>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="region">Region (Województwo)</FieldLabel>
                        <Input id="region" placeholder="Coming soon" disabled/>
                    </Field>
                </div>

                <Field>
                    <FieldLabel htmlFor="country">Country</FieldLabel>
                    <Input id="country" placeholder="Coming soon" disabled/>
                </Field>

                <FieldDescription>Address management will be available soon.</FieldDescription>
            </CardContent>
        </Card>
    );
}
