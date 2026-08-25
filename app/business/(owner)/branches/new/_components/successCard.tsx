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
                <CheckCircle2 className="mx-auto h-10 w-10 text-success-badge-foreground lg:h-12 lg:w-12"/>
                <CardTitle className="text-base font-semibold lg:text-2xl lg:font-bold">Workshop created</CardTitle>
                <p className="text-xs text-muted-foreground lg:text-sm">
                    <span className="font-medium text-foreground">{result.name}</span> is registered and visible to customers.
                </p>
            </CardHeader>
            <CardContent/>
            <CardFooter className="flex-col gap-2 lg:gap-3">
                <Button asChild className="w-full">
                    <Link href="/business/branches">My service points</Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="lg:h-9 lg:w-full lg:bg-secondary lg:px-4 lg:py-2 lg:text-sm lg:text-secondary-foreground lg:shadow-sm lg:hover:bg-secondary/80">
                    <Link href={`/branches/${result.id}`} target="_blank" rel="noopener noreferrer">Preview customer page</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
