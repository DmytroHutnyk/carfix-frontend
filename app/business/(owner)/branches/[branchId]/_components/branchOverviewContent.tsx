'use client'

import {OrbitProgress} from "react-loading-indicators";

import {useAuth} from "@/features/auth/useAuth";
import {isOwner} from "@/features/user/userTypes";
import {useOwnerBranchDetail} from "@/features/ownerBranch/useOwnerBranchDetail";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError} from "@/lib/apiTypes";

import FormErrorAlert from "@/_components/formErrorAlert";
import BranchOverviewEditor from "@/business/(owner)/branches/[branchId]/_components/branchOverviewEditor";

export default function BranchOverviewContent({branchId}: { branchId: string }) {
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

    return <BranchOverviewEditor branch={branch}/>;
}
