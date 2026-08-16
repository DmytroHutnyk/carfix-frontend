import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {bookingApi} from "@/features/booking/bookingApi";
import {bookingKeys} from "@/features/booking/keys";
import {Booking, CreateBookingRequest} from "@/features/booking/bookingTypes";
import {isStaleSlotError} from "@/features/booking/bookingList";
import {slotKeys} from "@/features/slots/keys";
import {ApiError} from "@/lib/apiTypes";

export function useBookings(options?: { enabled?: boolean }) {
    const queryClient = useQueryClient();

    const listQuery = useQuery<Booking[], ApiError>({
        queryKey: bookingKeys.list(),
        queryFn: bookingApi.getMyBookings,
        enabled: options?.enabled ?? true,
        staleTime: 5 * 60 * 1000,
    });

    /* Slots are invalidated both ways: a booking consumes availability, a stale-slot rejection proves the cached grid was already wrong. */
    const createMutation = useMutation<Booking, ApiError, CreateBookingRequest>({
        mutationFn: bookingApi.createBooking,
        onSuccess: (created) => {
            queryClient.setQueryData<Booking[]>(bookingKeys.list(), (list) => list && [...list, created]);
            queryClient.invalidateQueries({queryKey: slotKeys.branch(created.branch.branchId)});
        },
        onError: (error, request) => {
            if (isStaleSlotError(error)) {
                queryClient.invalidateQueries({queryKey: slotKeys.branch(request.branchId)});
            }
        },
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

        createBooking: (request: CreateBookingRequest) => createMutation.mutateAsync(request),
        cancelBooking: (id: string) => cancelMutation.mutateAsync(id),
    }
}
