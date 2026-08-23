'use client'

import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {VariantProps} from "class-variance-authority";

import {ApiError} from "@/lib/apiTypes";
import {toDisplayError} from "@/lib/errorHandler";
import {BranchStatus, OwnerBranchDetail} from "@/features/ownerBranch/ownerBranchTypes";
import {BRANCH_STATUS_LABELS} from "@/features/ownerBranch/ownerBranchList";
import {
    BranchOverviewForm,
    branchOverviewSchema,
    toBranchOverviewForm,
    toUpdateBranchOverviewRequest,
} from "@/features/ownerBranch/branchOverviewForm";
import {useUpdateBranchOverview} from "@/features/ownerBranch/useUpdateBranchOverview";

import {Badge, badgeVariants} from "@/_components/shadcn/badge";
import {Button} from "@/_components/shadcn/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/_components/shadcn/card";
import FormErrorAlert from "@/_components/formErrorAlert";
import BranchTabs from "@/business/(owner)/branches/[branchId]/_components/branchTabs";
import BranchInformationCard from "@/business/(owner)/branches/[branchId]/_components/branchInformationCard";

const STATUS_BADGE_VARIANT: Record<BranchStatus, VariantProps<typeof badgeVariants>["variant"]> = {
    ACTIVE: "success",
    SUSPENDED: "destructiveSoft",
    VERIFICATION_PENDING: "secondary",
};

export default function BranchOverviewEditor({branch}: { branch: OwnerBranchDetail }) {
    const [error, setError] = useState<string | null>(null);
    const {updateBranch} = useUpdateBranchOverview(branch.branchId);

    const form = useForm<BranchOverviewForm>({
        resolver: zodResolver(branchOverviewSchema),
        mode: "onSubmit",
        values: toBranchOverviewForm(branch),
    });
    const {handleSubmit, reset, formState: {isDirty, isSubmitting}} = form;

    const onSubmit = async (data: BranchOverviewForm) => {
        setError(null);
        try {
            await updateBranch(toUpdateBranchOverviewRequest(data));
        } catch (err) {
            setError(toDisplayError(err as ApiError).message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 py-3">
            <section className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">{branch.name}</h1>
                    <Badge variant={STATUS_BADGE_VARIANT[branch.status]}>{BRANCH_STATUS_LABELS[branch.status]}</Badge>
                </div>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            reset();
                            setError(null);
                        }}
                        disabled={!isDirty || isSubmitting}
                    >
                        Discard
                    </Button>
                    <Button type="submit" disabled={!isDirty || isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save changes"}
                    </Button>
                </div>
            </section>

            <FormErrorAlert message={error}/>

            <BranchTabs active="overview"/>

            <BranchInformationCard form={form}/>

            <Card>
                <CardHeader><CardTitle>Opening Hours</CardTitle></CardHeader>
                <CardContent/>
            </Card>

            <Card>
                <CardHeader><CardTitle>Cancellation Policy</CardTitle></CardHeader>
                <CardContent/>
            </Card>
        </form>
    );
}
