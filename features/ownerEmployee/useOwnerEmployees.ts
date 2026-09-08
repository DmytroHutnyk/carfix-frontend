import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ownerEmployeeApi} from "@/features/ownerEmployee/ownerEmployeeApi";
import {ownerEmployeeKeys} from "@/features/ownerEmployee/keys";
import {OwnerEmployee, OwnerEmployeeRequest} from "@/features/ownerEmployee/ownerEmployeeTypes";
import {ApiError} from "@/lib/apiTypes";

export function useOwnerEmployees(branchId: string, options?: { enabled?: boolean }) {
    const queryClient = useQueryClient();

    const listQuery = useQuery<OwnerEmployee[], ApiError>({
        queryKey: ownerEmployeeKeys.list(branchId),
        queryFn: () => ownerEmployeeApi.getEmployees(branchId),
        enabled: options?.enabled ?? true,
        staleTime: 60 * 1000,
    });

    const invalidate = () => queryClient.invalidateQueries({queryKey: ownerEmployeeKeys.list(branchId)});

    const createMutation = useMutation<OwnerEmployee, ApiError, OwnerEmployeeRequest>({
        mutationFn: (body) => ownerEmployeeApi.createEmployee(branchId, body),
        onSuccess: invalidate,
    });

    const updateMutation = useMutation<OwnerEmployee, ApiError, { employeeId: string; body: OwnerEmployeeRequest }>({
        mutationFn: ({employeeId, body}) => ownerEmployeeApi.updateEmployee(branchId, employeeId, body),
        onSuccess: invalidate,
    });

    return {
        employees: listQuery.data ?? [],
        isLoading: listQuery.isLoading,
        isError: listQuery.isError,
        error: listQuery.error,
        createEmployee: (body: OwnerEmployeeRequest) => createMutation.mutateAsync(body),
        updateEmployee: (employeeId: string, body: OwnerEmployeeRequest) =>
            updateMutation.mutateAsync({employeeId, body}),
    };
}
