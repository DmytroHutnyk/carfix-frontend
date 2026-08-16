"use client"

import {useEffect} from "react";
import {useBranchRegistrationDraft} from "@/features/branchRegistration/useBranchRegistrationDraft";
import BasicInfoStep from "@/business/(owner)/service-points/new/_components/basicInfoStep";
import OpeningHoursStep from "@/business/(owner)/service-points/new/_components/openingHoursStep";
import CarBrandsStep from "@/business/(owner)/service-points/new/_components/carBrandsStep";
import ServiceBaysStep from "@/business/(owner)/service-points/new/_components/serviceBaysStep";
import EquipmentStep from "@/business/(owner)/service-points/new/_components/equipmentStep";
import EmployeesStep from "@/business/(owner)/service-points/new/_components/employeesStep";
import ServicesStep from "@/business/(owner)/service-points/new/_components/servicesStep";
import SuccessCard from "@/business/(owner)/service-points/new/_components/successCard";

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
