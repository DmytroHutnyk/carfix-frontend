import {clientApi} from "@/lib/clientApi";
import {isApiError} from "@/lib/apiTypes";
import {
    BranchRegistrationDraft,
    BranchRegistrationResponse,
    DAY_STATUS,
    OpeningHoursMode,
    RegisterBranchOpeningHoursRequest,
    RegisterBranchRequest,
    RegisterBranchServiceRequest,
    ServiceDraft,
    WEEKDAYS,
} from "@/features/branchRegistration/branchRegistrationTypes";

const MAX_REQUIREMENT_NAME = 100;

function emptyToNull(value: string): string | null {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
}

/* Requirement rows need a name the owner never types: the picked names, or a numbered fallback. */
function requirementName(picked: string[], fallback: string): string {
    const joined = picked.join(" / ");
    return joined.length > 0 && joined.length <= MAX_REQUIREMENT_NAME ? joined : fallback;
}

function toOpeningHours(draft: BranchRegistrationDraft): RegisterBranchOpeningHoursRequest[] {
    return WEEKDAYS.flatMap((day) => {
        const hours = draft.openingHours.days[day];
        if (hours.status === DAY_STATUS.CLOSED) return [];
        const mode: OpeningHoursMode = hours.status;
        return [{dayOfWeek: day, opensAt: hours.opensAt, closesAt: hours.closesAt, mode}];
    });
}

function toService(service: ServiceDraft): RegisterBranchServiceRequest {
    return {
        name: service.name,
        description: emptyToNull(service.description),
        durationMinutes: service.durationMinutes,
        price: service.price,
        categoryId: service.categoryId,
        status: service.status,
        bayTypes: service.bayTypes,
        employeeRequirements: service.employeeRequirements.map((r, i) => ({
            name: requirementName(r.roles, `Employee ${i + 1}`),
            roles: r.roles,
        })),
        equipmentRequirements: service.equipmentRequirements.map((r, i) => ({
            name: requirementName(r.types, `Equipment ${i + 1}`),
            types: r.types,
        })),
    };
}

/* Browser zone; the owner registers from where the workshop is (spec D8). */
export function browserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function toRegisterBranchRequest(draft: BranchRegistrationDraft, timezone: string): RegisterBranchRequest {
    const info = draft.basicInfo;
    if (info === null) {
        throw new Error("Basic info step not completed");
    }
    return {
        name: info.name,
        phoneNumber: `${info.phoneCountryCode}${info.phoneNumber}`,
        email: info.email,
        timezone,
        address: {
            streetName: info.streetName,
            buildingNumber: info.buildingNumber,
            flatNumber: emptyToNull(info.flatNumber),
            postalCode: info.postalCode,
            city: info.city,
            region: info.region,
            countryIso: info.countryIso,
            latitude: info.latitude,
            longitude: info.longitude,
            googlePlaceId: info.googlePlaceId === null ? null : emptyToNull(info.googlePlaceId),
        },
        openingHours: toOpeningHours(draft),
        carBrandIds: draft.carBrandIds,
        serviceBayTypes: draft.serviceBayTypes,
        serviceBays: draft.serviceBays.map((row) => ({name: row.name.trim(), type: row.type})),
        equipmentTypes: draft.equipmentTypes,
        equipment: draft.equipment.map((row) => ({name: row.name.trim(), type: row.type})),
        roles: draft.roles,
        employees: draft.employees.map((row) => ({
            firstName: row.firstName.trim(),
            lastName: row.lastName.trim(),
            roles: [row.role],
        })),
        services: draft.services.map(toService),
    };
}

export const ownerBranchApi = {
    async registerBranch(draft: BranchRegistrationDraft): Promise<BranchRegistrationResponse> {
        const body = toRegisterBranchRequest(draft, browserTimezone());
        const result = await clientApi.post<BranchRegistrationResponse, RegisterBranchRequest>('/owner/branches', body);
        if (isApiError(result)) throw result;
        return result;
    },
}
