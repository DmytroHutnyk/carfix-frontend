import {z} from "zod";

/* ---------- vocab shared with the backend (enum names on the wire) ---------- */

export const WEEKDAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"] as const;
export type Weekday = (typeof WEEKDAYS)[number];
export const WEEKDAY_LABEL: Record<Weekday, string> = {
    MONDAY: "Monday", TUESDAY: "Tuesday", WEDNESDAY: "Wednesday", THURSDAY: "Thursday",
    FRIDAY: "Friday", SATURDAY: "Saturday", SUNDAY: "Sunday",
};
export const WORKING_DAYS: Weekday[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

export const OPENING_MODE = {OPEN: "OPEN", BY_APPOINTMENT: "BY_APPOINTMENT"} as const;
export type OpeningHoursMode = (typeof OPENING_MODE)[keyof typeof OPENING_MODE];

/* UI status of a weekday: the two backend modes plus CLOSED (= no row sent) */
export const DAY_STATUS = {OPEN: "OPEN", BY_APPOINTMENT: "BY_APPOINTMENT", CLOSED: "CLOSED"} as const;
export type DayStatus = (typeof DAY_STATUS)[keyof typeof DAY_STATUS];
export const DAY_STATUS_LABEL: Record<DayStatus, string> = {OPEN: "Open", BY_APPOINTMENT: "By appointment", CLOSED: "Closed"};

export const SERVICE_STATUS = {ACTIVE: "ACTIVE", SUSPENDED: "SUSPENDED"} as const;
export type ServiceStatus = (typeof SERVICE_STATUS)[keyof typeof SERVICE_STATUS];
export const SERVICE_STATUS_LABEL: Record<ServiceStatus, string> = {ACTIVE: "Active", SUSPENDED: "Stopped"};

/* "00:00" … "23:30" in 30-minute steps for the opening-hours selects */
export const TIME_OPTIONS: string[] = Array.from({length: 48}, (_, i) =>
    `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`);

/* ---------- wire: mirrors adaptersIn branch/dto (name-for-name) ---------- */

export interface RegisterBranchAddressRequest {
    streetName: string;
    buildingNumber: string;
    flatNumber: string | null;
    postalCode: string;
    city: string;
    region: string;
    countryIso: string;
    latitude: number | null;
    longitude: number | null;
    googlePlaceId: string | null;
}

export interface RegisterBranchOpeningHoursRequest {
    dayOfWeek: Weekday;
    opensAt: string;   // "HH:mm"
    closesAt: string;
    mode: OpeningHoursMode;
}

export interface RegisterBranchServiceBayRequest {
    name: string;
    type: string;
}

export interface RegisterBranchEquipmentRequest {
    name: string;
    type: string;
}

export interface RegisterBranchEmployeeRequest {
    firstName: string;
    lastName: string;
    roles: string[];
}

export interface RegisterBranchEmployeeRequirementRequest {
    name: string;
    roles: string[];
}

export interface RegisterBranchEquipmentRequirementRequest {
    name: string;
    types: string[];
}

export interface RegisterBranchServiceRequest {
    name: string;
    description: string | null;
    durationMinutes: number;
    price: number;
    categoryId: number;
    status: ServiceStatus;
    bayTypes: string[];
    employeeRequirements: RegisterBranchEmployeeRequirementRequest[];
    equipmentRequirements: RegisterBranchEquipmentRequirementRequest[];
}

export interface RegisterBranchRequest {
    name: string;
    phoneNumber: string;
    email: string;
    timezone: string;
    address: RegisterBranchAddressRequest;
    openingHours: RegisterBranchOpeningHoursRequest[];
    carBrandIds: number[];
    serviceBayTypes: string[];
    serviceBays: RegisterBranchServiceBayRequest[];
    equipmentTypes: string[];
    equipment: RegisterBranchEquipmentRequest[];
    roles: string[];
    employees: RegisterBranchEmployeeRequest[];
    services: RegisterBranchServiceRequest[];
}

export interface BranchRegistrationResponse {
    id: string;
    name: string;
    status: string;
}

export interface ServiceCategoryResponse {
    id: number;
    name: string;
}

/* ---------- step 1 ---------- */

export const basicInfoSchema = z.object({
    name: z.string().trim().min(1, "Service point name is required").max(100, "Name cannot exceed 100 characters"),
    streetName: z.string().trim().min(1, "Pick the address from the suggestions").max(100),
    buildingNumber: z.string().trim().min(1, "Building number is required").max(10, "Max 10 characters"),
    flatNumber: z.string().trim().max(10, "Max 10 characters"),
    postalCode: z.string().trim().min(1, "Postal code is required").max(10, "Max 10 characters"),
    city: z.string().trim().min(1, "Pick the address from the suggestions").max(100),
    region: z.string().trim().min(1, "Pick the address from the suggestions").max(100),
    countryIso: z.string().length(2, "Pick the address from the suggestions"),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    googlePlaceId: z.string().nullable(),
    phoneCountryCode: z.string().min(1, "Country code is required"),
    phoneNumber: z.string()
        .transform((val) => val.replace(/\s+/g, ""))
        .pipe(z.string().regex(/^[0-9]{5,12}$/, "Phone number must contain from 5 to 12 digits")),
    email: z.string().trim().min(1, "Support email is required").email("Invalid email address").max(50, "Email cannot exceed 50 characters"),
});
export type BasicInfo = z.infer<typeof basicInfoSchema>;

/* ---------- step 2 ---------- */

const dayHoursSchema = z.object({
    status: z.enum([DAY_STATUS.OPEN, DAY_STATUS.BY_APPOINTMENT, DAY_STATUS.CLOSED]),
    opensAt: z.string(),
    closesAt: z.string(),
}).superRefine((day, ctx) => {
    if (day.status === DAY_STATUS.CLOSED) return;
    if (!day.opensAt || !day.closesAt) {
        ctx.addIssue({code: "custom", message: "Pick opening and closing time", path: ["closesAt"]});
        return;
    }
    if (day.opensAt >= day.closesAt) {
        ctx.addIssue({code: "custom", message: "Closing time must be after opening time", path: ["closesAt"]});
    }
});
export type DayHours = z.infer<typeof dayHoursSchema>;

export const openingHoursSchema = z.object({
    days: z.object({
        MONDAY: dayHoursSchema, TUESDAY: dayHoursSchema, WEDNESDAY: dayHoursSchema, THURSDAY: dayHoursSchema,
        FRIDAY: dayHoursSchema, SATURDAY: dayHoursSchema, SUNDAY: dayHoursSchema,
    }),
});
export type OpeningHoursForm = z.infer<typeof openingHoursSchema>;

export const DEFAULT_OPENING_HOURS: OpeningHoursForm = {
    days: {
        MONDAY: {status: "OPEN", opensAt: "09:00", closesAt: "17:00"},
        TUESDAY: {status: "OPEN", opensAt: "09:00", closesAt: "17:00"},
        WEDNESDAY: {status: "OPEN", opensAt: "09:00", closesAt: "17:00"},
        THURSDAY: {status: "OPEN", opensAt: "09:00", closesAt: "17:00"},
        FRIDAY: {status: "OPEN", opensAt: "09:00", closesAt: "17:00"},
        SATURDAY: {status: "BY_APPOINTMENT", opensAt: "", closesAt: ""},
        SUNDAY: {status: "CLOSED", opensAt: "", closesAt: ""},
    },
};

/* ---------- steps 4–6 (plain rows, validated on Continue) ---------- */

export interface ResourceRow {
    id: string;      // client-side key only
    name: string;
    type: string;    // "" until picked
}

export interface EmployeeRow {
    id: string;
    firstName: string;
    lastName: string;
    role: string;    // "" until picked; the wire carries it as roles: [role]
}

/* ---------- step 7 ---------- */

export const serviceFormSchema = z.object({
    name: z.string().trim().min(1, "Service name is required").max(100, "Name cannot exceed 100 characters"),
    description: z.string().trim().max(500, "Description cannot exceed 500 characters"),
    /* registered with valueAsNumber — an empty input arrives as NaN and fails z.number() with the message below */
    durationMinutes: z.number("Duration is required").int("Whole minutes only").min(1, "At least 1 minute").max(1440, "At most 1440 minutes"),
    price: z.number("Price is required").min(0, "Price cannot be negative").max(99999.99, "Price is too large"),
    categoryId: z.number("Category is required").int().positive("Category is required"),
    status: z.enum([SERVICE_STATUS.ACTIVE, SERVICE_STATUS.SUSPENDED]),
    bayTypes: z.array(z.string()).min(1, "Pick at least one bay type"),
    employeeRequirements: z.array(z.object({
        roles: z.array(z.string()).min(1, "Pick at least one role"),
    })).min(1, "Add at least one required employee"),
    equipmentRequirements: z.array(z.object({
        types: z.array(z.string()).min(1, "Pick at least one equipment type"),
    })),
});
export type ServiceForm = z.infer<typeof serviceFormSchema>;

export interface ServiceDraft extends ServiceForm {
    id: string;      // client-side key only
}

export const EMPTY_SERVICE_FORM: ServiceForm = {
    name: "", description: "", durationMinutes: 30, price: 0, categoryId: 0, status: "ACTIVE",
    bayTypes: [], employeeRequirements: [{roles: []}], equipmentRequirements: [],
};

/* ---------- the whole draft ---------- */

export interface BranchRegistrationDraft {
    basicInfo: BasicInfo | null;
    openingHours: OpeningHoursForm;
    carBrandIds: number[];
    serviceBayTypes: string[];
    serviceBays: ResourceRow[];
    equipmentTypes: string[];
    equipment: ResourceRow[];
    roles: string[];
    employees: EmployeeRow[];
    services: ServiceDraft[];
}
