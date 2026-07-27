import {User} from "@/util/types/userTypes";
import {clientApi} from "@/util/api/clientApi";
import {isApiError} from "@/util/types/apiTypes";
import {UpdateUserCore} from "@/util/types/profileManagementTypes";

/* Shared user-core writes — role-agnostic. The backend resolves the principal from the
 * session and returns the updated core, which the hook splices into `account.user`.
 * Role tails live in their own api module (e.g. ownerApi.updateBusiness → /owners/me). */
export const userApi = {
    //TODO extend UpdateUserCore to contain all user fields
    async updateCore(data: UpdateUserCore): Promise<User> {
        const result = await clientApi.patch<User, UpdateUserCore>('/users/me', data);

        if (isApiError(result)) {
            throw result;
        }

        return result;
    }
}
