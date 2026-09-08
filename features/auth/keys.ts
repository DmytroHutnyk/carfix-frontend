import {PRIVATE_SCOPE} from "@/lib/scopes";

export const authKeys = {
    all: [PRIVATE_SCOPE, 'auth'] as const,
    session: () => [...authKeys.all, 'session'] as const,
}
