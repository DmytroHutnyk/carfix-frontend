"use client"

import {SearchX} from "lucide-react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useMemo} from "react";

import {useWorkshopSearch} from "@/features/search/useWorkshopSearch";
import {buildBranchUrl, parseInitialPage, parseSearchParams} from "@/features/search/searchUrl";
import {composeEmptyMessage, composeTitle, SEARCH_SORTS} from "@/features/search/searchList";
import {countryName, COUNTRY_CENTERS, isCountryCode} from "@/lib/appTypes";
import {toDisplayError} from "@/lib/errorHandler";
import {isApiError} from "@/lib/apiTypes";
import {useAuth} from "@/features/auth/useAuth";
import {useSelectedCarProfile} from "@/features/carProfile/useSelectedCarProfile";

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

    const {isAuthenticated, isLoading: isAuthLoading} = useAuth();
    /* /search is public — don't fire the private cars request for anonymous visitors. */
    const {selectedCarProfile, isLoading: isCarsLoading} = useSelectedCarProfile({enabled: isAuthenticated});

    const carFilterActive = !params.allBrands && selectedCarProfile != null;
    const effectiveParams = useMemo(
        () => ({...params, carProfileId: params.allBrands ? null : selectedCarProfile?.id ?? null}),
        [params, selectedCarProfile]
    );
    /* Hold the first request until we know which car applies — an unfiltered flash of results is the bug this fixes. */
    const searchEnabled = !isAuthLoading && (!isAuthenticated || !isCarsLoading);

    const {
        results, echo, total,
        isLoading, isFetching, isError, error,
        hasNextPage, isFetchingNextPage, fetchNextPage,
    } = useWorkshopSearch(effectiveParams, initialPage, searchEnabled);

    // used for clearing filters
    const NARROWING = ["q", "serviceName", "categoryId", "label", "pinnedBranchId", "radiusKm", "from", "to", "timeFrom", "timeTo"] as const;
    const hasNarrowingFilters = NARROWING.some((key) => searchParams.has(key)) || carFilterActive;
    const hasPlaceFilter = searchParams.has("city") || searchParams.has("voivodeship");

    const clearFilters = () => {
        const next = new URLSearchParams(searchParams);
        NARROWING.forEach((key) => next.delete(key));
        if (selectedCarProfile) next.set("allBrands", "1");
        next.delete("page");
        router.push(`${pathname}?${next.toString()}`);
    };

    const browseCountry = () => {
        const next = new URLSearchParams(searchParams);
        NARROWING.forEach((key) => next.delete(key));
        if (selectedCarProfile) next.set("allBrands", "1");
        next.delete("city");
        next.delete("voivodeship");
        next.delete("page");
        if (isCountryCode(params.country)) {
            const center = COUNTRY_CENTERS[params.country];
            next.set("lat", String(center.lat));
            next.set("lng", String(center.lng));
        } else {
            next.delete("lat");
            next.delete("lng");
        }
        next.set("sort", SEARCH_SORTS.NAME);
        router.push(`${pathname}?${next.toString()}`);
    };

    return (
        <div className="mx-auto w-full max-w-[1475px] px-6 py-6">
            {/*-==-==-=-=-=-=--==-=-=-=-Sticky title row-==-==-=-=-=-=-=-=-=---==*/}
            <section className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 bg-background py-3">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{composeTitle(echo, params.radiusKm)}</h1>
                    {total != null && (
                        <p className="flex items-center gap-2 text-muted-foreground">
                            <span>{total} {total === 1 ? "workshop" : "workshops"}</span>
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
                            <EmptyTitle>{composeEmptyMessage(echo, params.radiusKm)}</EmptyTitle>
                            <EmptyDescription>Try different search terms or another location.</EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <div className="flex flex-wrap justify-center gap-2">
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
                        href={buildBranchUrl(workshop.branchId, params)}
                        singleDay={params.from != null && params.from === params.to}
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
