import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {slotApi} from "@/features/slots/slotApi";
import {slotKeys} from "@/features/slots/keys";
import {BranchSlots, SlotsQuery} from "@/features/slots/slotTypes";
import {canonicalServiceIds} from "@/features/slots/slotList";
import {ApiError} from "@/lib/apiTypes";

export function useBranchSlots(query: SlotsQuery, options?: { enabled?: boolean }) {
    const canonical: SlotsQuery = {...query, serviceIds: canonicalServiceIds(query.serviceIds)};

    const slotsQuery = useQuery<BranchSlots, ApiError>({
        queryKey: slotKeys.range(canonical),
        queryFn: () => slotApi.getBranchSlots(canonical),
        enabled: (options?.enabled ?? true) && canonical.serviceIds.length > 0,
        staleTime: 30_000,
        placeholderData: keepPreviousData,
    });

    return {
        slots: slotsQuery.data,
        isLoading: slotsQuery.isLoading,
        isPlaceholderData: slotsQuery.isPlaceholderData,
        isError: slotsQuery.isError,
        error: slotsQuery.error,
        refetch: slotsQuery.refetch,
    };
}
