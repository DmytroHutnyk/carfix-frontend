"use client"

import {ReactNode} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {isProblemDetailError, isStandardError} from "@/lib/apiTypes";

const MAX_RETRIES = 3;

/* A 4xx is a verdict on the request itself — sending it again unchanged cannot
   change the answer, it only makes the user wait for the same failure three more
   times. 5xx, network errors and anything unrecognised stay retryable. */
function isClientFault(error: unknown): boolean {
    const status = isProblemDetailError(error) || isStandardError(error) ? error.status : null;
    return status != null && status >= 400 && status < 500;
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => !isClientFault(error) && failureCount < MAX_RETRIES,
        },
        mutations: {
            retry: false,
        },
    },
});

//Created so the whole root layout does not become "client" component
export default function Providers({children}: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
