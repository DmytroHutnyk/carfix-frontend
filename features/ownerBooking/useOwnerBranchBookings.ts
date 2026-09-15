import {useQuery} from "@tanstack/react-query";
import {ownerBookingApi} from "@/features/ownerBooking/ownerBookingApi";
import {ownerBookingKeys} from "@/features/ownerBooking/keys";
import {OwnerBooking} from "@/features/ownerBooking/ownerBookingTypes";
import {ApiError} from "@/lib/apiTypes";

export function useOwnerBranchBookings(branchId: string, from: string, to: string, options?: { enabled?: boolean }) {
    const query = useQuery<OwnerBooking[], ApiError>({
        queryKey: ownerBookingKeys.range(branchId, from, to),
        queryFn: () => ownerBookingApi.getBranchBookings(branchId, from, to),
        enabled: options?.enabled ?? true,
        staleTime: 60 * 1000,
    });

    return {
        bookings: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
}
