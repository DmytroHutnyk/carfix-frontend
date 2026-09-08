import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ownerServiceBayApi} from "@/features/ownerServiceBay/ownerServiceBayApi";
import {ownerServiceBayKeys} from "@/features/ownerServiceBay/keys";
import {OwnerServiceBay, OwnerServiceBayType, ServiceBayRequest} from "@/features/ownerServiceBay/ownerServiceBayTypes";
import {ApiError} from "@/lib/apiTypes";

export function useOwnerServiceBays(branchId: string, options?: { enabled?: boolean }) {
    const queryClient = useQueryClient();
    const enabled = options?.enabled ?? true;

    const listQuery = useQuery<OwnerServiceBay[], ApiError>({
        queryKey: ownerServiceBayKeys.list(branchId),
        queryFn: () => ownerServiceBayApi.getServiceBays(branchId),
        enabled,
        staleTime: 60 * 1000,
    });

    const typesQuery = useQuery<OwnerServiceBayType[], ApiError>({
        queryKey: ownerServiceBayKeys.types(branchId),
        queryFn: () => ownerServiceBayApi.getServiceBayTypes(branchId),
        enabled,
        staleTime: 5 * 60 * 1000,
    });

    const invalidate = () => queryClient.invalidateQueries({queryKey: ownerServiceBayKeys.list(branchId)});

    const createMutation = useMutation<OwnerServiceBay, ApiError, ServiceBayRequest>({
        mutationFn: (body) => ownerServiceBayApi.createServiceBay(branchId, body),
        onSuccess: invalidate,
    });

    const updateMutation = useMutation<OwnerServiceBay, ApiError, { bayId: number; body: ServiceBayRequest }>({
        mutationFn: ({bayId, body}) => ownerServiceBayApi.updateServiceBay(branchId, bayId, body),
        onSuccess: invalidate,
    });

    return {
        serviceBays: listQuery.data ?? [],
        types: typesQuery.data ?? [],
        isLoading: listQuery.isLoading,
        isError: listQuery.isError,
        error: listQuery.error,
        createServiceBay: (body: ServiceBayRequest) => createMutation.mutateAsync(body),
        updateServiceBay: (bayId: number, body: ServiceBayRequest) =>
            updateMutation.mutateAsync({bayId, body}),
    };
}
