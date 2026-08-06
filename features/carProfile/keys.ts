import {PRIVATE_SCOPE} from "@/lib/scopes";

export const carProfileKeys = {
    all: [PRIVATE_SCOPE, 'carProfiles'] as const,
    list: () => [...carProfileKeys.all, 'list'] as const,
}
