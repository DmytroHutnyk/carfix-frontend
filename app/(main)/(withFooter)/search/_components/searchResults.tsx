"use client"

import {SearchX} from "lucide-react";
import Link from "next/link";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useMemo} from "react";

import {useWorkshopSearch} from "@/features/search/useWorkshopSearch";
import {parseInitialPage, parseSearchParams} from "@/features/search/searchUrl";
import {composeEmptyMessage, composeTitle} from "@/features/search/searchList";
import {toDisplayError} from "@/lib/errorHandler";
import {isApiError} from "@/lib/apiTypes";

import {Button} from "@/_components/shadcn/button";
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/_components/shadcn/empty";
import FormErrorAlert from "@/_components/formErrorAlert";
import WorkshopResultCard from "@/(main)/(withFooter)/search/_components/workshopResultCard";
import ResultCardSkeleton from "@/(main)/(withFooter)/search/_components/resultCardSkeleton";
import SearchControls from "@/(main)/(withFooter)/search/_components/searchControls";

export default function SearchResults() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const params = useMemo(() => parseSearchParams(searchParams), [searchParams]);
    const initialPage = parseInitialPage(searchParams);

    const {
        results, echo, total,
        isLoading, isError, error,
        hasNextPage, isFetchingNextPage, fetchNextPage,
    } = useWorkshopSearch(params, initialPage);

    /* The empty state's "Clear filters" drops everything that narrowed the search but KEEPS the
       location — that is what separates it from "Browse all workshops", which drops that too.
       (The Filters popover has its own narrower clear, scoped to what that panel edits.) */
    const CLEARABLE = ["q", "serviceName", "categoryId", "carProfileId", "radiusKm"] as const;
    const hasClearableFilters = CLEARABLE.some((key) => searchParams.has(key));

    const clearFilters = () => {
        const next = new URLSearchParams(searchParams);
        CLEARABLE.forEach((key) => next.delete(key));
        next.delete("page");
        const qs = next.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname);
    };

    return (
        <div className="mx-auto w-full max-w-[1475px] px-6 py-6">
            {/*-==-==-=-=-=-=--==-=-=-=-Sticky title row-==-==-=-=-=-=-=-=-=---==*/}
            <section className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 bg-background py-3">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{composeTitle(echo)}</h1>
                    {total != null && (
                        <p className="text-muted-foreground">
                            {total} {total === 1 ? "workshop" : "workshops"}
                        </p>
                    )}
                </div>
                <SearchControls params={params}/>
            </section>

            {/*-==-==-=-=-=-=--==-=-=-=-Results-==-==-=-=-=-=-=-=-=---==*/}
            <section className="flex flex-col gap-4 pt-4">
                {/* useInfiniteQuery types its error as Error, so narrow instead of casting —
                    searchApi throws ApiError values, anything else falls back to a generic message. */}
                {isError && (
                    <FormErrorAlert message={isApiError(error)
                        ? toDisplayError(error).message
                        : "Unknown error. Please try again"}/>
                )}

                {isLoading && !isError &&
                    Array.from({length: 4}, (_, i) => <ResultCardSkeleton key={i}/>)}

                {!isLoading && !isError && results.length === 0 && (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <SearchX/>
                            </EmptyMedia>
                            <EmptyTitle>{composeEmptyMessage(echo)}</EmptyTitle>
                            <EmptyDescription>Try different search terms or another location.</EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <div className="flex gap-2">
                                {/* Hidden when there is nothing to clear — a no-op button reads as broken */}
                                {hasClearableFilters && (
                                    <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
                                )}
                                <Button asChild>
                                    <Link href="/search">Browse all workshops</Link>
                                </Button>
                            </div>
                        </EmptyContent>
                    </Empty>
                )}

                {!isLoading && results.map((workshop) => (
                    <WorkshopResultCard key={workshop.branchId} workshop={workshop}/>
                ))}

                {hasNextPage && (
                    <Button
                        variant="outline"
                        className="self-center"
                        disabled={isFetchingNextPage}
                        onClick={() => fetchNextPage()}
                    >
                        {isFetchingNextPage ? "Loading..." : "Load more"}
                    </Button>
                )}
            </section>
        </div>
    );
}
