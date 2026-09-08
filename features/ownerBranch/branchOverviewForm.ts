import {z} from "zod";
import {
    DAY_STATUS,
    DayHours,
    openingHoursSchema,
    RegisterBranchOpeningHoursRequest,
    Weekday,
    WEEKDAYS,
} from "@/features/branchRegistration/branchRegistrationTypes";
import {
    CANCELLATION_POLICIES,
    OwnerBranchDetail,
    UpdateBranchOpeningHoursExceptionRequest,
    UpdateBranchOverviewRequest,
} from "@/features/ownerBranch/ownerBranchTypes";

export const branchAddressSchema = z.object({
    streetName: z.string().trim().min(1, "Pick an address from the suggestions").max(100, "Street cannot exceed 100 characters"),
    buildingNumber: z.string().trim().min(1, "Building number is required").max(10, "Max 10 characters"),
    flatNumber: z.string().trim().max(10, "Max 10 characters"),
    postalCode: z.string().trim().min(1, "Postal code is required").max(10, "Max 10 characters"),
    city: z.string().trim().min(1, "Pick an address from the suggestions").max(100, "City cannot exceed 100 characters"),
    region: z.string().trim().min(1, "Pick an address with a region").max(100, "Region cannot exceed 100 characters"),
    countryIso: z.string().length(2, "Pick an address from the suggestions"),
    countryName: z.string(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    googlePlaceId: z.string().nullable(),
});

export const exceptionSchema = z.object({
    date: z.string().min(1, "Pick a date"),
    isOpen: z.boolean(),
    opensAt: z.string(),
    closesAt: z.string(),
    reason: z.string().trim().max(300, "Reason cannot exceed 300 characters"),
}).superRefine((exception, ctx) => {
    if (!exception.isOpen) return;
    if (!exception.opensAt || !exception.closesAt) {
        ctx.addIssue({code: "custom", message: "Pick opening and closing time", path: ["closesAt"]});
        return;
    }
    if (exception.opensAt >= exception.closesAt) {
        ctx.addIssue({code: "custom", message: "Closing time must be after opening time", path: ["closesAt"]});
    }
});

export const branchOverviewSchema = z.object({
    name: z.string().trim().min(1, "Service point name is required").max(100, "Name cannot exceed 100 characters"),
    description: z.string().trim().max(2000, "Description cannot exceed 2000 characters"),
    cancellationPolicy: z.enum(CANCELLATION_POLICIES),
    address: branchAddressSchema,
    days: openingHoursSchema.shape.days,
    exceptions: z.array(exceptionSchema),
    carBrandIds: z.array(z.number()).min(1, "Pick at least one brand"),
});

export type BranchOverviewForm = z.infer<typeof branchOverviewSchema>;
export type BranchOverviewException = BranchOverviewForm["exceptions"][number];

const CLOSED_DAY: DayHours = {status: DAY_STATUS.CLOSED, opensAt: "", closesAt: ""};

function emptyToNull(value: string): string | null {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
}

function toClockTime(time: string): string {
    return time.slice(0, 5);
}

function toWeek(detail: OwnerBranchDetail): BranchOverviewForm["days"] {
    const week = Object.fromEntries(WEEKDAYS.map((day) => [day, {...CLOSED_DAY}])) as BranchOverviewForm["days"];
    detail.openingHours.forEach((row) => {
        week[row.dayOfWeek] = {
            status: row.mode,
            opensAt: toClockTime(row.startTime),
            closesAt: toClockTime(row.closeTime),
        };
    });
    return week;
}

export function toBranchOverviewForm(detail: OwnerBranchDetail): BranchOverviewForm {
    return {
        name: detail.name,
        description: detail.description ?? "",
        cancellationPolicy: detail.cancellationPolicy,
        address: {
            streetName: detail.address.streetName,
            buildingNumber: detail.address.buildingNumber,
            flatNumber: detail.address.flatNumber ?? "",
            postalCode: detail.address.postalCode,
            city: detail.address.city,
            region: detail.address.region,
            countryIso: detail.address.countryIso,
            countryName: detail.address.countryName,
            latitude: detail.address.latitude,
            longitude: detail.address.longitude,
            googlePlaceId: detail.address.googlePlaceId,
        },
        days: toWeek(detail),
        exceptions: detail.openingHoursExceptions.map((exception) => ({
            date: exception.date,
            isOpen: exception.isOpen,
            opensAt: exception.opensAt === null ? "" : toClockTime(exception.opensAt),
            closesAt: exception.closesAt === null ? "" : toClockTime(exception.closesAt),
            reason: exception.reason ?? "",
        })),
        carBrandIds: detail.brands.map((brand) => brand.carBrandId),
    };
}

function toOpeningHours(week: BranchOverviewForm["days"]): RegisterBranchOpeningHoursRequest[] {
    return WEEKDAYS.flatMap((day: Weekday) => {
        const hours = week[day];
        if (hours.status === DAY_STATUS.CLOSED) return [];
        return [{dayOfWeek: day, opensAt: hours.opensAt, closesAt: hours.closesAt, mode: hours.status}];
    });
}

function toExceptionRequest(exception: BranchOverviewException): UpdateBranchOpeningHoursExceptionRequest {
    return {
        date: exception.date,
        isOpen: exception.isOpen,
        opensAt: exception.isOpen ? exception.opensAt : null,
        closesAt: exception.isOpen ? exception.closesAt : null,
        reason: emptyToNull(exception.reason),
    };
}

export function toUpdateBranchOverviewRequest(form: BranchOverviewForm): UpdateBranchOverviewRequest {
    return {
        name: form.name,
        description: emptyToNull(form.description),
        cancellationPolicy: form.cancellationPolicy,
        address: {
            streetName: form.address.streetName,
            buildingNumber: form.address.buildingNumber,
            flatNumber: emptyToNull(form.address.flatNumber),
            postalCode: form.address.postalCode,
            city: form.address.city,
            region: form.address.region,
            countryIso: form.address.countryIso,
            latitude: form.address.latitude,
            longitude: form.address.longitude,
            googlePlaceId: form.address.googlePlaceId,
        },
        openingHours: toOpeningHours(form.days),
        openingHoursExceptions: form.exceptions.map(toExceptionRequest),
        carBrandIds: form.carBrandIds,
    };
}

export const EMPTY_EXCEPTION: BranchOverviewException = {
    date: "",
    isOpen: false,
    opensAt: "",
    closesAt: "",
    reason: "",
};
