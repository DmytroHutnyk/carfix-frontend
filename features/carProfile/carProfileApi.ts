import {clientApi} from "@/util/api/clientApi";
import {isApiError} from "@/util/types/apiTypes";
import {
    CarProfile,
    CarProfileForm,
    CreateCarProfileRequest,
    UpdateCarProfileRequest
} from "@/features/carProfile/carProfileTypes";

function toCreateRequest(form: CarProfileForm): CreateCarProfileRequest {
    return {
        name: form.name.trim(),
        vin: form.vin || null,
        plates: form.plates || null,
        serviceCertificateDate: form.serviceCertificateDate || null,
        insuranceDate: form.insuranceDate || null,
        modelVersionId: form.modelVersionId,
    };
}

function toUpdateRequest(form: CarProfileForm): UpdateCarProfileRequest {
    return {
        name: form.name.trim(),
        modelVersionId: form.modelVersionId,
        vin: form.vin || null,
        plates: form.plates || null,
        insuranceDate: form.insuranceDate || null,
        serviceCertificateDate: form.serviceCertificateDate || null,
    };
}

export const carProfileApi = {
    async getMyCarProfiles(): Promise<CarProfile[]> {
        const result = await clientApi.get<CarProfile[]>('/customer/car-profiles');
        if (isApiError(result)) throw result;
        return result;
    },

    async createCarProfile(form: CarProfileForm): Promise<CarProfile> {
        const result = await clientApi.post<CarProfile, CreateCarProfileRequest>(
            '/customer/car-profiles', toCreateRequest(form));
        if (isApiError(result)) throw result;
        return result;
    },

    async updateCarProfile(id: string, form: CarProfileForm): Promise<CarProfile> {
        const result = await clientApi.put<CarProfile, UpdateCarProfileRequest>(
            `/customer/car-profiles/${id}`, toUpdateRequest(form));
        if (isApiError(result)) throw result;
        return result;
    },

    async deleteCarProfile(id: string): Promise<void> {
        const result = await clientApi.delete(`/customer/car-profiles/${id}`);
        if (isApiError(result)) throw result;
    },
}
