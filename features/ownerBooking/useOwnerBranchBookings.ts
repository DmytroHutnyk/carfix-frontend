import {useQuery} from "@tanstack/react-query";
import {ownerBookingApi} from "@/features/ownerBooking/ownerBookingApi";
import {ownerBookingKeys} from "@/features/ownerBooking/keys";
import {OwnerBooking} from "@/features/ownerBooking/ownerBookingTypes";
import {ApiError} from "@/lib/apiTypes";

export function useOwnerBranchBookings(branchId: string, date: string, options?: { enabled?: boolean }) {
    const query = useQuery<OwnerBooking[], ApiError>({
        queryKey: ownerBookingKeys.day(branchId, date),
        queryFn: () => ownerBookingApi.getBranchBookings(branchId, date),
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
