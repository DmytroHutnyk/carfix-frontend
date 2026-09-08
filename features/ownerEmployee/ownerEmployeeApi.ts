import {clientApi} from "@/lib/clientApi";
import {isApiError} from "@/lib/apiTypes";
import {OwnerEmployee, OwnerEmployeeRequest} from "@/features/ownerEmployee/ownerEmployeeTypes";

export const ownerEmployeeApi = {
    async getEmployees(branchId: string): Promise<OwnerEmployee[]> {
        const result = await clientApi.get<OwnerEmployee[]>(`/owner/branches/${branchId}/employees`);
        if (isApiError(result)) throw result;
        return result;
    },

    async createEmployee(branchId: string, body: OwnerEmployeeRequest): Promise<OwnerEmployee> {
        const result = await clientApi.post<OwnerEmployee, OwnerEmployeeRequest>(`/owner/branches/${branchId}/employees`, body);
        if (isApiError(result)) throw result;
        return result;
    },

    async updateEmployee(branchId: string, employeeId: string, body: OwnerEmployeeRequest): Promise<OwnerEmployee> {
        const result = await clientApi.put<OwnerEmployee, OwnerEmployeeRequest>(`/owner/branches/${branchId}/employees/${employeeId}`, body);
        if (isApiError(result)) throw result;
        return result;
    },
}
