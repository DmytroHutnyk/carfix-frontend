"use client"

import {SearchX} from "lucide-react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useMemo} from "react";

import {useWorkshopSearch} from "@/features/search/useWorkshopSearch";
import {parseInitialPage, parseSearchParams} from "@/features/search/searchUrl";
import {composeEmptyMessage, composeTitle, SEARCH_SORTS} from "@/features/search/searchList";
import {countryName} from "@/lib/appTypes";
import {toDisplayError} from "@/lib/errorHandler";
import {isApiError} from "@/lib/apiTypes";

import {Button} from "@/_components/shadcn/button";
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/_components/shadcn/empty";
import {Spinner} from "@/_components/shadcn/spinner";
import FormErrorAlert from "@/_components/formErrorAlert";
import WorkshopResultCard from "@/(main)/(withFooter)/search/_components/workshopResultCard";
import ResultCardSkeleton from "@/(main)/(withFooter)/search/_components/resultCardSkeleton";
import SearchControls from "@/(main)/(withFooter)/search/_components/searchControls";
import ActiveFilters from "@/(main)/(withFooter)/search/_components/activeFilters";
import {cn} from "@/lib/utils";

export default function SearchResults() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const params = useMemo(() => parseSearchParams(searchParams), [searchParams]);
    const initialPage = parseInitialPage(searchParams);

    const {
        results, echo, total,
        isLoading, isFetching, isError, error,
        hasNextPage, isFetchingNextPage, fetchNextPage,
    } = useWorkshopSearch(params, initialPage);

    /* Everything that narrows a search. Location is deliberately not here — keeping it is
       what makes "Clear filters" different from "Browse all workshops". */
    const NARROWING = ["q", "serviceName", "categoryId", "label", "pinnedBranchId", "carProfileId", "radiusKm"] as const;
    const hasNarrowingFilters = NARROWING.some((key) => searchParams.has(key));
    const hasPlaceFilter = searchParams.has("city") || searchParams.has("voivodeship");

    const clearFilters = () => {
        const next = new URLSearchParams(searchParams);
        NARROWING.forEach((key) => next.delete(key));
        next.delete("page");
        router.push(`${pathname}?${next.toString()}`);
    };

    /* Drops the city as well, so only the region selector's country is left. Distance has
       nothing to rank around once the city is gone, so the sort goes back to name. */
    const browseCountry = () => {
        const next = new URLSearchParams(searchParams);
        NARROWING.forEach((key) => next.delete(key));
        next.delete("city");
        next.delete("voivodeship");
        next.delete("page");
        next.set("sort", SEARCH_SORTS.NAME);
        router.push(`${pathname}?${next.toString()}`);
    };

    return (
        <div className="mx-auto w-full max-w-[1475px] px-6 py-6">
            {/*-==-==-=-=-=-=--==-=-=-=-Sticky title row-==-==-=-=-=-=-=-=-=---==*/}
            <section className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 bg-background py-3">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{composeTitle(echo)}</h1>
                    {total != null && (
                        <p className="flex items-center gap-2 text-muted-foreground">
                            <span>{total} {total === 1 ? "workshop" : "workshops"}</span>
                            {/* The list below keeps the previous results while refetching, so
                                without this a filter change looks like nothing happened. */}
                            {isFetching && !isFetchingNextPage && (
                                <span className="flex items-center gap-1.5 text-sm">
                                    <Spinner className="h-3.5 w-3.5"/>
                                    Updating…
                                </span>
                            )}
                        </p>
                    )}
                </div>
                <SearchControls params={params}/>
            </section>

            <ActiveFilters params={params}/>

            {/*-==-==-=-=-=-=--==-=-=-=-Results-==-==-=-=-=-=-=-=-=---==*/}
            <section
                aria-busy={isFetching}
                className={cn(
                    "flex flex-col gap-4 pt-4 transition-opacity",
                    isFetching && !isFetchingNextPage && "opacity-60"
                )}
            >
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
                            <div className="flex flex-wrap justify-center gap-2">
                                {/* Only offered when it would actually change the URL — a no-op button reads as broken.
                                    Hidden when there is no place to keep, because it would then do exactly what the
                                    button beside it does. */}
                                {hasNarrowingFilters && hasPlaceFilter && (
                                    <Button variant="outline" onClick={clearFilters}>
                                        Clear filters, keep {params.city ?? params.voivodeship}
                                    </Button>
                                )}
                                <Button onClick={browseCountry}>
                                    Browse all workshops in {countryName(params.country) ?? "the country"}
                                </Button>
                            </div>
                        </EmptyContent>
                    </Empty>
                )}

                {!isLoading && results.map((workshop) => (
                    <WorkshopResultCard
                        key={workshop.branchId}
                        workshop={workshop}
                        /* The backend already orders it first (ORDER BY pinned DESC); this is
                           only what tells the customer which one they clicked. */
                        pinned={workshop.branchId === params.pinnedBranchId}
                    />
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
