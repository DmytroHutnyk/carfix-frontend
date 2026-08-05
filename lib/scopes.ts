export const PRIVATE_SCOPE = 'private' as const;
export const PUBLIC_SCOPE = 'public' as const;

/* Prefix filter for queryClient.removeQueries / invalidateQueries. */
export const privateScope = [PRIVATE_SCOPE] as const;
