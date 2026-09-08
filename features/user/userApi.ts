import {Address, User} from "@/features/user/userTypes";
import {clientApi} from "@/lib/clientApi";
import {isApiError} from "@/lib/apiTypes";
import {
    UpdateAddress,
    UpdateUserAddressRequest,
    UpdateUserCore,
    UpdateUserRequest
} from "@/features/user/profileManagementTypes";
import {ConfirmEmailVerificationRequest, VerificationCodeForm} from "@/features/user/emailVerificationTypes";

function toUpdateUserRequest(form: UpdateUserCore): UpdateUserRequest {
    return {
        name: form.name.trim(),
        surname: form.surname.trim(),
        dateOfBirth: form.dateOfBirth || null,
        preferredLocation: form.preferredLocation ?? null,
    };
}

function toUpdateUserAddressRequest(form: UpdateAddress): UpdateUserAddressRequest {
    return {
        streetName: form.streetName.trim(),
        buildingNumber: form.buildingNumber.trim(),
        flatNumber: form.flatNumber.trim() || null,
        postalCode: form.postalCode.trim(),
        city: form.city.trim(),
        region: form.region.trim(),
        countryIso: form.countryIso,
        latitude: form.latitude,
        longitude: form.longitude,
        googlePlaceId: form.googlePlaceId,
    };
}

export const userApi = {
    async updateCore(data: UpdateUserCore): Promise<User> {
        const result = await clientApi.put<User, UpdateUserRequest>('/users/me', toUpdateUserRequest(data));

        if (isApiError(result)) {
            throw result;
        }

        return result;
    },

    async updateAddress(data: UpdateAddress): Promise<Address> {
        const result = await clientApi.put<Address, UpdateUserAddressRequest>('/users/me/address', toUpdateUserAddressRequest(data));

        if (isApiError(result)) {
            throw result;
        }

        return result;
    },

    async deleteAddress(): Promise<void> {
        const result = await clientApi.delete('/users/me/address');

        if (isApiError(result)) {
            throw result;
        }
    },

    async deleteAccount(): Promise<void> {
        const result = await clientApi.delete('/users/me');

        if (isApiError(result)) {
            throw result;
        }
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
