import {create} from "zustand";
import {
    BasicInfo,
    BranchRegistrationDraft,
    BranchRegistrationResponse,
    DEFAULT_OPENING_HOURS,
    EmployeeRow,
    OpeningHoursForm,
    ResourceRow,
    ServiceDraft,
} from "@/features/branchRegistration/branchRegistrationTypes";

export const WIZARD_STEPS = ["basicInfo", "openingHours", "carBrands", "serviceBays", "equipment", "employees", "services"] as const;
export type WizardStep = (typeof WIZARD_STEPS)[number];

type BranchRegistrationDraftStore = BranchRegistrationDraft & {
    step: WizardStep;
    result: BranchRegistrationResponse | null;

    goTo: (step: WizardStep) => void;
    next: () => void;
    back: () => void;

    setBasicInfo: (info: BasicInfo) => void;
    setOpeningHours: (hours: OpeningHoursForm) => void;
    setCarBrandIds: (ids: number[]) => void;
    setServiceBays: (types: string[], rows: ResourceRow[]) => void;
    setEquipment: (types: string[], rows: ResourceRow[]) => void;
    setEmployees: (roles: string[], rows: EmployeeRow[]) => void;
    setServices: (services: ServiceDraft[]) => void;
    setResult: (result: BranchRegistrationResponse) => void;
    reset: () => void;
};

function emptyDraft(): BranchRegistrationDraft {
    return {
        basicInfo: null,
        openingHours: {days: {...DEFAULT_OPENING_HOURS.days}},
        carBrandIds: [],
        serviceBayTypes: [],
        serviceBays: [],
        equipmentTypes: [],
        equipment: [],
        roles: [],
        employees: [],
        services: [],
    };
}

/* In-memory only on purpose: a half-finished registration must not resurface days later. */
export const useBranchRegistrationDraft = create<BranchRegistrationDraftStore>()((set) => ({
    ...emptyDraft(),
    step: "basicInfo",
    result: null,

    goTo: (step) => set({step}),
    next: () => set((s) => ({step: WIZARD_STEPS[Math.min(WIZARD_STEPS.indexOf(s.step) + 1, WIZARD_STEPS.length - 1)]})),
    back: () => set((s) => ({step: WIZARD_STEPS[Math.max(WIZARD_STEPS.indexOf(s.step) - 1, 0)]})),

    setBasicInfo: (basicInfo) => set({basicInfo}),
    setOpeningHours: (openingHours) => set({openingHours}),
    setCarBrandIds: (carBrandIds) => set({carBrandIds}),
    setServiceBays: (serviceBayTypes, serviceBays) => set({serviceBayTypes, serviceBays}),
    setEquipment: (equipmentTypes, equipment) => set({equipmentTypes, equipment}),
    setEmployees: (roles, employees) => set({roles, employees}),
    setServices: (services) => set({services}),
    setResult: (result) => set({result}),
    reset: () => set({...emptyDraft(), step: "basicInfo", result: null}),
}));
