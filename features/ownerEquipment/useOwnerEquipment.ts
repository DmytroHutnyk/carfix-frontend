import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ownerEquipmentApi} from "@/features/ownerEquipment/ownerEquipmentApi";
import {ownerEquipmentKeys} from "@/features/ownerEquipment/keys";
import {OwnerEquipment, OwnerEquipmentRequest} from "@/features/ownerEquipment/ownerEquipmentTypes";
import {ApiError} from "@/lib/apiTypes";

export function useOwnerEquipment(branchId: string, options?: { enabled?: boolean }) {
    const queryClient = useQueryClient();

    const listQuery = useQuery<OwnerEquipment[], ApiError>({
        queryKey: ownerEquipmentKeys.list(branchId),
        queryFn: () => ownerEquipmentApi.getEquipment(branchId),
        enabled: options?.enabled ?? true,
        staleTime: 60 * 1000,
    });

    const invalidate = () => queryClient.invalidateQueries({queryKey: ownerEquipmentKeys.list(branchId)});

    const createMutation = useMutation<OwnerEquipment, ApiError, OwnerEquipmentRequest>({
        mutationFn: (body) => ownerEquipmentApi.createEquipment(branchId, body),
        onSuccess: invalidate,
    });

    const updateMutation = useMutation<OwnerEquipment, ApiError, { equipmentId: string; body: OwnerEquipmentRequest }>({
        mutationFn: ({equipmentId, body}) => ownerEquipmentApi.updateEquipment(branchId, equipmentId, body),
        onSuccess: invalidate,
    });

    return {
        equipment: listQuery.data ?? [],
        isLoading: listQuery.isLoading,
        isError: listQuery.isError,
        error: listQuery.error,
        createEquipment: (body: OwnerEquipmentRequest) => createMutation.mutateAsync(body),
        updateEquipment: (equipmentId: string, body: OwnerEquipmentRequest) =>
            updateMutation.mutateAsync({equipmentId, body}),
    };
}
