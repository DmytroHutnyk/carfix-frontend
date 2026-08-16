"use client"

import {useBranchRegistrationDraft} from "@/features/branchRegistration/useBranchRegistrationDraft";
import BasicInfoStep from "@/owner/branches/new/_components/basicInfoStep";
import OpeningHoursStep from "@/owner/branches/new/_components/openingHoursStep";
import CarBrandsStep from "@/owner/branches/new/_components/carBrandsStep";

export default function BranchRegistrationWizard() {
    const step = useBranchRegistrationDraft((s) => s.step);
    const result = useBranchRegistrationDraft((s) => s.result);

    if (result) {
        return null;
    }

    switch (step) {
        case "basicInfo":
            return <BasicInfoStep/>;
        case "openingHours":
            return <OpeningHoursStep/>;
        case "carBrands":
            return <CarBrandsStep/>;
        default:
            return <BasicInfoStep/>;
    }
}
