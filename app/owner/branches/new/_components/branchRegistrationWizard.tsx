"use client"

import {useBranchRegistrationDraft} from "@/features/branchRegistration/useBranchRegistrationDraft";
import BasicInfoStep from "@/owner/branches/new/_components/basicInfoStep";
import OpeningHoursStep from "@/owner/branches/new/_components/openingHoursStep";
import CarBrandsStep from "@/owner/branches/new/_components/carBrandsStep";
import ServiceBaysStep from "@/owner/branches/new/_components/serviceBaysStep";
import EquipmentStep from "@/owner/branches/new/_components/equipmentStep";
import EmployeesStep from "@/owner/branches/new/_components/employeesStep";
import ServicesStep from "@/owner/branches/new/_components/servicesStep";
import SuccessCard from "@/owner/branches/new/_components/successCard";

export default function BranchRegistrationWizard() {
    const step = useBranchRegistrationDraft((s) => s.step);
    const result = useBranchRegistrationDraft((s) => s.result);

    if (result) {
        return <SuccessCard result={result}/>;
    }

    switch (step) {
        case "basicInfo":
            return <BasicInfoStep/>;
        case "openingHours":
            return <OpeningHoursStep/>;
        case "carBrands":
            return <CarBrandsStep/>;
        case "serviceBays":
            return <ServiceBaysStep/>;
        case "equipment":
            return <EquipmentStep/>;
        case "employees":
            return <EmployeesStep/>;
        case "services":
            return <ServicesStep/>;
    }
}
