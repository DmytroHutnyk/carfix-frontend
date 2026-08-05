import {PRIVATE_SCOPE} from "@/util/api/scopes";

export const bookingKeys = {
    all: [PRIVATE_SCOPE, 'bookings'] as const,
    list: () => [...bookingKeys.all, 'list'] as const,
}
