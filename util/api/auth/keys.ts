import {PRIVATE_SCOPE} from "@/util/api/scopes";

export const authKeys = {
    all: [PRIVATE_SCOPE, 'auth'] as const,
    session: () => [...authKeys.all, 'session'] as const, //session actually stores user object
}
