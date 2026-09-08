'use client'

import {ReactNode} from "react";
import {VariantProps} from "class-variance-authority";
import {OrbitProgress} from "react-loading-indicators";

import {useAuth} from "@/features/auth/useAuth";
import {isOwner} from "@/features/user/userTypes";
import {useOwnerBranchDetail} from "@/features/ownerBranch/useOwnerBranchDetail";
import {BranchStatus} from "@/features/ownerBranch/ownerBranchTypes";
import {BRANCH_STATUS_LABELS} from "@/features/ownerBranch/ownerBranchList";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError} from "@/lib/apiTypes";

import {Badge, badgeVariants} from "@/_components/shadcn/badge";
import FormErrorAlert from "@/_components/formErrorAlert";
import BranchTabs, {BranchTabKey} from "@/business/(owner)/branches/[branchId]/_components/branchTabs";

const STATUS_BADGE_VARIANT: Record<BranchStatus, VariantProps<typeof badgeVariants>["variant"]> = {
    ACTIVE: "success",
    SUSPENDED: "destructiveSoft",
    VERIFICATION_PENDING: "secondary",
};

export default function BranchTabShell({branchId, active, children}: {
    branchId: string;
    active: BranchTabKey;
    children: ReactNode;
}) {
    const {account, isLoading: isAuthLoading} = useAuth();
    const isAuthorized = account !== null && isOwner(account);
    const {branch, isLoading, isError, error} = useOwnerBranchDetail(branchId, {enabled: isAuthorized});

    if (isAuthLoading || !isAuthorized || isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <OrbitProgress color="var(--primary)" size="large" text="" textColor="" dense/>
            </div>
        );
    }

    if (isError || branch === null) {
        return (
            <div className="py-3">
                <FormErrorAlert message={toDisplayError(error as ApiError).message}/>
            </div>
        );
    }

    return (
        <div className="space-y-6 py-3">
            <section className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{branch.name}</h1>
                <Badge variant={STATUS_BADGE_VARIANT[branch.status]}>{BRANCH_STATUS_LABELS[branch.status]}</Badge>
            </section>

            <BranchTabs active={active}/>

            {children}
        </div>
    );
}
