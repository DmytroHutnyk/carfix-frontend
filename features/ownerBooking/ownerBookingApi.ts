import {clientApi} from "@/lib/clientApi";
import {isApiError} from "@/lib/apiTypes";
import {OwnerBooking} from "@/features/ownerBooking/ownerBookingTypes";

export const ownerBookingApi = {
    async getBranchBookings(branchId: string, from: string, to: string): Promise<OwnerBooking[]> {
        const result = await clientApi.get<OwnerBooking[]>(`/owner/branches/${branchId}/bookings?from=${from}&to=${to}`);
        if (isApiError(result)) throw result;
        return result;
    },
}
