"use client"

import {useEffect} from "react";
import {useBranchRegistrationDraft} from "@/features/branchRegistration/useBranchRegistrationDraft";
import BasicInfoStep from "@/owner/service-points/new/_components/basicInfoStep";
import OpeningHoursStep from "@/owner/service-points/new/_components/openingHoursStep";
import CarBrandsStep from "@/owner/service-points/new/_components/carBrandsStep";
import ServiceBaysStep from "@/owner/service-points/new/_components/serviceBaysStep";
import EquipmentStep from "@/owner/service-points/new/_components/equipmentStep";
import EmployeesStep from "@/owner/service-points/new/_components/employeesStep";
import ServicesStep from "@/owner/service-points/new/_components/servicesStep";
import SuccessCard from "@/owner/service-points/new/_components/successCard";

export default function BranchRegistrationWizard() {
    const step = useBranchRegistrationDraft((s) => s.step);
    const result = useBranchRegistrationDraft((s) => s.result);
    const reset = useBranchRegistrationDraft((s) => s.reset);

    /* Leaving the flow starts the next visit with a clean wizard. */
    useEffect(() => reset, [reset]);

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
