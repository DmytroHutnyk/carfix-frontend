import {clientApi} from "@/lib/clientApi";
import {isApiError} from "@/lib/apiTypes";
import {Booking, CreateBookingRequest} from "@/features/booking/bookingTypes";

export const bookingApi = {
    async getMyBookings(): Promise<Booking[]> {
        const result = await clientApi.get<Booking[]>('/customer/bookings');
        if (isApiError(result)) throw result;
        return result;
    },

    async createBooking(request: CreateBookingRequest): Promise<Booking> {
        const result = await clientApi.post<Booking, CreateBookingRequest>('/customer/bookings', request);
        if (isApiError(result)) throw result;
        return result;
    },

    async cancelBooking(id: string): Promise<Booking> {
        const result = await clientApi.post<Booking, undefined>(`/customer/bookings/${id}/cancel`);
        if (isApiError(result)) throw result;
        return result;
    },
}
