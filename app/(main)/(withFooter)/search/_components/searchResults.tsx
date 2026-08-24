"use client"

import {SearchX} from "lucide-react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useMemo} from "react";

import {useWorkshopSearch} from "@/features/search/useWorkshopSearch";
import {buildBranchUrl, parseInitialPage, parseSearchParams} from "@/features/search/searchUrl";
import {composeEmptyMessage, composePlace, composeSubject, composeTitle, SEARCH_SORTS} from "@/features/search/searchList";
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

    const countLabel = total != null ? `${total} ${total === 1 ? "workshop" : "workshops"}` : null;
    const meta = [composePlace(echo, params.radiusKm), countLabel].filter(Boolean).join(" · ");

    return (
        <div className="mx-auto w-full max-w-[1475px] px-4 py-4 lg:px-6 lg:py-6">
            {/*-==-==-=-=-=-=--==-=-=-=-Sticky title row-==-==-=-=-=-=-=-=-=---==*/}
            <section className="sticky top-0 z-10 flex flex-col gap-2 bg-background py-2 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-3 lg:py-3">
                <div className="min-w-0">
                    <h1 className="line-clamp-2 text-base font-semibold tracking-tight lg:line-clamp-none lg:text-3xl lg:font-bold">
                        <span className="lg:hidden">{composeSubject(echo)}</span>
                        <span className="hidden lg:inline">{composeTitle(echo, params.radiusKm)}</span>
                    </h1>

                    {meta && (
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground lg:hidden">
                            <span className="truncate">{meta}</span>
                            {isFetching && !isFetchingNextPage && <Spinner className="h-3 w-3 shrink-0"/>}
                        </p>
                    )}

                    {total != null && (
                        <p className="hidden items-center gap-2 text-base text-muted-foreground lg:flex">
                            <span>{countLabel}</span>
                            {isFetching && !isFetchingNextPage && (
                                <span className="flex items-center gap-1.5 text-sm">
                                    <Spinner className="h-3.5 w-3.5"/>
                                    Updating…
                                </span>
                            )}
                        </p>
                    )}
                </div>

                <div className="flex min-h-8 items-center gap-2 lg:contents">
                    <ActiveFilters params={params} className="min-w-0 flex-1 overflow-x-auto lg:hidden"/>
                    <SearchControls params={params}/>
                </div>
            </section>

            <ActiveFilters params={params} className="hidden flex-wrap lg:flex"/>

            {/*-==-==-=-=-=-=--==-=-=-=-Results-==-==-=-=-=-=-=-=-=---==*/}
            <section
                aria-busy={isFetching}
                className={cn(
                    "flex flex-col gap-3 pt-3 transition-opacity lg:gap-4 lg:pt-4",
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
                            <EmptyTitle className="text-base lg:text-lg">{composeEmptyMessage(echo, params.radiusKm)}</EmptyTitle>
                            <EmptyDescription className="text-xs lg:text-sm">Try different search terms or another location.</EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <div className="flex flex-wrap justify-center gap-2">
                                {hasNarrowingFilters && hasPlaceFilter && (
                                    <Button variant="outline" size="sm" className="lg:h-9 lg:px-4 lg:py-2 lg:text-sm" onClick={clearFilters}>
                                        Clear filters, keep {params.city ?? params.voivodeship}
                                    </Button>
                                )}
                                <Button size="sm" className="lg:h-9 lg:px-4 lg:py-2 lg:text-sm" onClick={browseCountry}>
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
                        size="sm"
                        className="self-center lg:h-9 lg:px-4 lg:py-2 lg:text-sm"
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
