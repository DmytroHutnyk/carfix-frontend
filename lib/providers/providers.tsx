"use client"

import {ReactNode} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {isProblemDetailError, isStandardError} from "@/lib/apiTypes";

const MAX_RETRIES = 3;

// Retrying an unchanged 4xx only delays the same verdict.
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

export default function Providers({children}: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
