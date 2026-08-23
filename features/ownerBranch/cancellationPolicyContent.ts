import {CancellationPolicy} from "@/features/ownerBranch/ownerBranchTypes";

export const CANCELLATION_POLICY_CONTENT: Record<CancellationPolicy, { title: string; summary: string; details: string }> = {
    STRICT: {
        title: "Strict",
        summary: "Full refund if cancelled 48+ hours before appointment",
        details: "Cancellations made 48 hours or more before the scheduled appointment will receive a full refund. Cancellations made within 48 hours will incur a 50% cancellation fee. No-shows will be charged the full service amount.",
    },
    MODERATE: {
        title: "Moderate",
        summary: "Full refund if cancelled 24+ hours before appointment",
        details: "Cancellations made 24 hours or more before the scheduled appointment will receive a full refund. Cancellations made within 24 hours will incur a 25% cancellation fee. No-shows will be charged 50% of the service amount.",
    },
    FLEXIBLE: {
        title: "Flexible",
        summary: "Full refund if cancelled 2+ hours before appointment",
        details: "Cancellations made 2 hours or more before the scheduled appointment will receive a full refund. Cancellations made within 2 hours will incur a 10% processing fee. No-shows will be charged 25% of the service amount.",
    },
};
