import {keepPreviousData, useInfiniteQuery} from "@tanstack/react-query";
import {workshopApi} from "@/features/workshop/workshopApi";
import {workshopKeys} from "@/features/workshop/keys";
import {ReviewsSort} from "@/features/workshop/workshopTypes";

export function useWorkshopReviews(branchId: string, sort: ReviewsSort) {
    const query = useInfiniteQuery({
        queryKey: workshopKeys.reviews(branchId, sort),
        queryFn: ({pageParam}) => workshopApi.getReviews(branchId, sort, pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
            lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
        placeholderData: keepPreviousData,
        staleTime: 60_000,
    });

    const pages = query.data?.pages ?? [];
    return {
        reviews: pages.flatMap((p) => p.content),
        total: pages[0]?.totalElements,
        isLoading: query.isPending,
        isError: query.isError,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        fetchNextPage: query.fetchNextPage,
    };
}
