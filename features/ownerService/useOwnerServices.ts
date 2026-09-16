import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ownerServiceApi} from "@/features/ownerService/ownerServiceApi";
import {ownerServiceKeys} from "@/features/ownerService/keys";
import {OwnerService, ServiceRequest} from "@/features/ownerService/ownerServiceTypes";
import {ApiError} from "@/lib/apiTypes";

export function useOwnerServices(branchId: string, options?: { enabled?: boolean }) {
    const queryClient = useQueryClient();
    const enabled = options?.enabled ?? true;

    const listQuery = useQuery<OwnerService[], ApiError>({
        queryKey: ownerServiceKeys.list(branchId),
        queryFn: () => ownerServiceApi.getServices(branchId),
        enabled,
        staleTime: 60 * 1000,
    });

    const invalidate = () => queryClient.invalidateQueries({queryKey: ownerServiceKeys.list(branchId)});

    const createMutation = useMutation<OwnerService, ApiError, ServiceRequest>({
        mutationFn: (body) => ownerServiceApi.createService(branchId, body),
        onSuccess: invalidate,
    });

    const updateMutation = useMutation<OwnerService, ApiError, { serviceId: number; body: ServiceRequest }>({
        mutationFn: ({serviceId, body}) => ownerServiceApi.updateService(branchId, serviceId, body),
        onSuccess: invalidate,
    });

    const activateMutation = useMutation<OwnerService, ApiError, number>({
        mutationFn: (serviceId) => ownerServiceApi.activateService(branchId, serviceId),
        onSuccess: invalidate,
    });

    const suspendMutation = useMutation<OwnerService, ApiError, number>({
        mutationFn: (serviceId) => ownerServiceApi.suspendService(branchId, serviceId),
        onSuccess: invalidate,
    });

    const deleteMutation = useMutation<void, ApiError, number>({
        mutationFn: (serviceId) => ownerServiceApi.deleteService(branchId, serviceId),
        onSuccess: invalidate,
    });

    return {
        services: listQuery.data ?? [],
        isLoading: listQuery.isLoading,
        isError: listQuery.isError,
        error: listQuery.error,
        createService: (body: ServiceRequest) => createMutation.mutateAsync(body),
        updateService: (serviceId: number, body: ServiceRequest) => updateMutation.mutateAsync({serviceId, body}),
        activateService: (serviceId: number) => activateMutation.mutateAsync(serviceId),
        suspendService: (serviceId: number) => suspendMutation.mutateAsync(serviceId),
        deleteService: (serviceId: number) => deleteMutation.mutateAsync(serviceId),
    };
}
