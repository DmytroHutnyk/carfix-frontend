"use client"

import Link from "next/link";
import {CheckCircle2} from "lucide-react";
import {Button} from "@/_components/shadcn/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {BranchRegistrationResponse} from "@/features/branchRegistration/branchRegistrationTypes";

export default function SuccessCard({result}: { result: BranchRegistrationResponse }) {
    return (
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CheckCircle2 className="mx-auto h-12 w-12 text-success-badge-foreground"/>
                <CardTitle className="text-2xl font-bold">Workshop created</CardTitle>
                <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{result.name}</span> is registered and visible to customers.
                </p>
            </CardHeader>
            <CardContent/>
            <CardFooter className="flex-col gap-3">
                <Button asChild className="w-full">
                    <Link href={`/branches/${result.id}`}>Open workshop page</Link>
                </Button>
                <Button asChild variant="secondary" className="w-full">
                    <Link href="/business/service-points">My service points</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
