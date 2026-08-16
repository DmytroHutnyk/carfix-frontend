"use client"

import {useBranchRegistrationDraft} from "@/features/branchRegistration/useBranchRegistrationDraft";
import BasicInfoStep from "@/owner/branches/new/_components/basicInfoStep";

export default function BranchRegistrationWizard() {
    const step = useBranchRegistrationDraft((s) => s.step);
    const result = useBranchRegistrationDraft((s) => s.result);

    if (result) {
        return null;
    }

    switch (step) {
        case "basicInfo":
            return <BasicInfoStep/>;
        default:
            return <BasicInfoStep/>;
    }
}
