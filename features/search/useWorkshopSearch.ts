import {keepPreviousData, useInfiniteQuery} from "@tanstack/react-query";
import {searchApi} from "@/features/search/searchApi";
import {searchKeys} from "@/features/search/keys";
import {WorkshopSearchParams} from "@/features/search/searchTypes";

export function useWorkshopSearch(params: WorkshopSearchParams, initialPage: number) {
    const query = useInfiniteQuery({
        queryKey: searchKeys.workshops(params),
        queryFn: ({pageParam}) => searchApi.searchWorkshops(params, pageParam),
        initialPageParam: initialPage,
        getNextPageParam: (lastPage) =>
            lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
        placeholderData: keepPreviousData,
        staleTime: 60_000,
    });

    const pages = query.data?.pages ?? [];
    return {
        results: pages.flatMap((p) => p.content),
        echo: pages[0]?.echo,
        total: pages[0]?.totalElements,
        isLoading: query.isPending,
        /* True during a background refetch too — with keepPreviousData the old list stays
           on screen, so this is the only signal that a filter change is in flight. */
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        fetchNextPage: query.fetchNextPage,
    };
}
