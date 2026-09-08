import {useMutation} from "@tanstack/react-query";
import {bookingApi} from "@/features/booking/bookingApi";
import {CreateReviewForm} from "@/features/booking/bookingTypes";
import {ApiError} from "@/lib/apiTypes";

type ReviewVariables = {bookingId: string; form: CreateReviewForm};

export function useCreateReview() {
    const mutation = useMutation<void, ApiError, ReviewVariables>({
        mutationFn: ({bookingId, form}) => bookingApi.createReview(bookingId, form),
    });

    return {
        createReview: (bookingId: string, form: CreateReviewForm) =>
            mutation.mutateAsync({bookingId, form}),
    };
}
