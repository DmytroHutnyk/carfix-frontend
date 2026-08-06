import {PRIVATE_SCOPE} from "@/lib/scopes";

export const bookingKeys = {
    all: [PRIVATE_SCOPE, 'bookings'] as const,
    list: () => [...bookingKeys.all, 'list'] as const,
}
