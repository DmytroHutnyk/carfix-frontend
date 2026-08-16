export interface Slot {
    startTime: string;
    endTime: string;
}

export interface DaySlots {
    date: string;
    slots: Slot[];
}

export interface BranchSlots {
    tz: string;
    chainable: boolean;
    days: DaySlots[];
}

export interface SlotsQuery {
    branchId: string;
    serviceIds: number[];
    from: string;
    to: string;
}

export interface VisitRange {
    from: string;
    to: string;
}

export interface SlotPick extends Slot {
    date: string;
}
