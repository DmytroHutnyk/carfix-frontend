import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {bookingApi} from "@/util/api/booking/bookingApi";
import {bookingKeys} from "@/util/api/booking/keys";
import {Booking} from "@/util/types/bookingTypes";
import {ApiError} from "@/util/types/apiTypes";

export function useBookings(options?: { enabled?: boolean }) {
    const queryClient = useQueryClient();

    const listQuery = useQuery<Booking[], ApiError>({
        queryKey: bookingKeys.list(),
        queryFn: bookingApi.getMyBookings,
        enabled: options?.enabled ?? true,
        staleTime: 5 * 60 * 1000,
    });

    const cancelMutation = useMutation({
        mutationFn: bookingApi.cancelBooking,
        onSuccess: (cancelled) => {
            queryClient.setQueryData<Booking[]>(bookingKeys.list(), (list) =>
                list?.map((b) => (b.bookingId === cancelled.bookingId ? cancelled : b))
            );
        },
    });

    return {
        bookings: listQuery.data ?? [],
        isLoading: listQuery.isLoading,
        isError: listQuery.isError,
        error: listQuery.error,

        cancelBooking: (id: string) => cancelMutation.mutateAsync(id),
    }
}
