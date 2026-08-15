import {User} from "@/features/user/userTypes";
import {clientApi} from "@/lib/clientApi";
import {isApiError} from "@/lib/apiTypes";
import {UpdateUserCore, UpdateUserRequest} from "@/features/user/profileManagementTypes";
import {ConfirmEmailVerificationRequest, VerificationCodeForm} from "@/features/user/emailVerificationTypes";

//not sure this is the best appraoch, to have a look later
function toUpdateUserRequest(form: UpdateUserCore): UpdateUserRequest {
    return {
        name: form.name.trim(),
        surname: form.surname.trim(),
        dateOfBirth: form.dateOfBirth || null,
    };
}

/* Shared user-core writes — role-agnostic. The backend resolves the principal from the
 * session and returns the updated core, which the hook splices into `account.user`.
 * Role tails live in their own api module (e.g. ownerApi.updateBusiness → /owners/me). */
export const userApi = {
    //TODO extend UpdateUserCore to contain all user fields
    async updateCore(data: UpdateUserCore): Promise<User> {
        const result = await clientApi.put<User, UpdateUserRequest>('/users/me', toUpdateUserRequest(data));

        if (isApiError(result)) {
            throw result;
        }

        return result;
    },

    async requestEmailVerification(): Promise<void> {
        const result = await clientApi.post<void, undefined>('/users/me/email-verification');

        if (isApiError(result)) {
            throw result;
        }
    },

    async confirmEmailVerification(data: VerificationCodeForm): Promise<User> {
        const body: ConfirmEmailVerificationRequest = {code: data.code};
        const result = await clientApi.post<User, ConfirmEmailVerificationRequest>('/users/me/email-verification/confirm', body);

        if (isApiError(result)) {
            throw result;
        }

        return result;
    },
}
