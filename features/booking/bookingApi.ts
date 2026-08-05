import {clientApi} from "@/util/api/clientApi";
import {isApiError} from "@/util/types/apiTypes";
import {Booking} from "@/features/booking/bookingTypes";

export const bookingApi = {
    async getMyBookings(): Promise<Booking[]> {
        const result = await clientApi.get<Booking[]>('/customer/bookings');
        if (isApiError(result)) throw result;
        return result;
    },

    async cancelBooking(id: string): Promise<Booking> {
        const result = await clientApi.post<Booking, undefined>(`/customer/bookings/${id}/cancel`);
        if (isApiError(result)) throw result;
        return result;
    },
}
