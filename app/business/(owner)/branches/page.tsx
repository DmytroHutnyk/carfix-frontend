'use client'

import {useMemo, useState} from "react";
import Link from "next/link";
import {OrbitProgress} from "react-loading-indicators";
import {Plus, Store} from "lucide-react";

import {useAuth} from "@/features/auth/useAuth";
import {isOwner} from "@/features/user/userTypes";
import {useOwnerBranches} from "@/features/ownerBranch/useOwnerBranches";
import {
    BranchFilterKey,
    BranchSortKey,
    filterBranches,
    sortBranches,
    summarizeBranches,
} from "@/features/ownerBranch/ownerBranchList";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError} from "@/lib/apiTypes";

import {Button} from "@/_components/shadcn/button";
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/_components/shadcn/empty";
import FormErrorAlert from "@/_components/formErrorAlert";
import BranchFilters from "@/business/(owner)/branches/_components/branchFilters";
import StatsStrip from "@/business/(owner)/branches/_components/statsStrip";
import BranchCard from "@/business/(owner)/branches/_components/branchCard";

export default function Page() {
    // Login and role redirects live in RequireAuth (owner layout); a non-owner just holds the spinner here.
    const {account, isLoading: isAuthLoading} = useAuth();
    const isAuthorized = account !== null && isOwner(account);

    const {branches, isLoading, isError, error} = useOwnerBranches({enabled: isAuthorized});

    const [filter, setFilter] = useState<BranchFilterKey>("all");
    const [sort, setSort] = useState<BranchSortKey>("nameAsc");

    const totals = useMemo(() => summarizeBranches(branches), [branches]);
    const visibleBranches = useMemo(
        () => sortBranches(filterBranches(branches, filter), sort),
        [branches, filter, sort]
    );

    if (isAuthLoading || !isAuthorized || isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <OrbitProgress color="var(--primary)" size="large" text="" textColor="" dense/>
            </div>
        );
    }

    return (
        <div className="py-3">
            <section>
                <h1 className="text-lg font-semibold tracking-tight lg:text-3xl lg:font-bold">My Service Points</h1>
            </section>

            {!isError && branches.length > 0 && (
                <>
                    <section className="pt-4 lg:pt-6">
                        <BranchFilters filter={filter} sort={sort} onFilterChange={setFilter} onSortChange={setSort}/>
                    </section>

                    <section className="pt-4 lg:pt-6">
                        <StatsStrip totals={totals}/>
                    </section>
                </>
            )}

            <section className="pt-4 lg:pt-6">
                {isError && (
                    <FormErrorAlert message={toDisplayError(error as ApiError).message}/>
                )}

                {!isError && branches.length === 0 && (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Store/>
                            </EmptyMedia>
                            <EmptyTitle>No service points yet</EmptyTitle>
                            <EmptyDescription>Add your first service point to see it here.</EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button asChild>
                                <Link href="/business/branches/new"><Plus/> New service point</Link>
                            </Button>
                        </EmptyContent>
                    </Empty>
                )}

                {!isError && branches.length > 0 && visibleBranches.length === 0 && (
                    <p className="pt-6 text-center text-sm text-muted-foreground lg:text-base">
                        No service points match this filter.
                    </p>
                )}

                {visibleBranches.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:gap-5 xl:grid-cols-3">
                        {visibleBranches.map((branch) => (
                            <BranchCard key={branch.branchId} branch={branch}/>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
